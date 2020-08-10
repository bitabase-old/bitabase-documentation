---
title: Removing Users
author: Mark Wylde
authorURL: http://twitter.com/markiswylde
---

As I mentioned in the last blog post, there is an undocumented feature which allows a special
collection `users` to be "logged into" and therefore restrict certain actions on another collection.

The idea was that if you have headers `username` and `password`, the server would try and find a record
in a `users` collection, and pass that into the scope of the initial reducer.

This was really a workaround of the async problem in reducers, before we moved the main language to
[presh](https://github.com/korynunn/presh) where async is made very simple.

Once the benchmarking and stress testing has been complete and code improvements have put the project
to a satisfactory requests per second, I'll be implementing internal operations.

## Internal Operations
The specifications may change as I'm implementing it, but my thoughts can be seen in some examples below.

For all these examples, pretend there is a `users` table with a `username`, `password` and of course `id` field.

### Simple
In the example below the first reducer searches in the `users` table for a record where the `username` and `password`
match their corresponding values in the request header.

```javascript
const collection = {
  name: 'messages',
  reducers: [
    `{
      ...body,
      user: get('users', {
        username: headers['X-Username'],
        password: headers['X-Password'],
      })
    }`,

    `{ ...body, userId: user ? user.id : reject('401', 'You are not logged in') }`
  ]
}
```

Therefore to post a new `message` you could do:

```javascript
fetch('https://test.bitabase.com/messages', {
  method: 'post',
  headers: {
    'X-Username': 'mark',
    'X-Password': 'supersecret'
  }
})
```

So long as a record if users exists in the `users` collection for `mark` and the plain text password
is `supersecret` then the record will be posted and the userId field will be set correctly.

If the user can not be found, it will reject to the client with a `401`.

### Hashing
In the above example we stored the users password in plaintext. This is obviously terrible, so lets
hash the password. If we look at the [scripting](https://docs.bitabase.com/docs/api/scripting)
documentation, we can see two methods `hashText` and `verifyHash`.

So let's ensure when we create a user their password is hashed.

```javascript
const collection = {
  name: 'users',
  reducers: [
    `{ ...body, password: hashText(body.password) }`
  ]
}
```

The above schema ensures anytime a user is `post`, `put`, `patched`, there password will be hashed and
the plain text never stored.

But now we need to authenticate the user. Let's take the same code from the "Basic" example above,
verifying the password's hash.

```javascript
const collection = {
  name: 'messages',
  reducers: [
    `{
      ...body,
      user: get('users', {
        username: headers['X-Username']
      })
    }`,

    `{
      ...body,
      user: verifyHash(headers['X-Password'], user.password) ? user : null
    }`,

    `{ ...body, userId: user ? user.id : reject('401', 'You are not logged in') }`
  ]
}
```

Now when we post to `messages`, the above reducers will:
Reducer 1: Get a users record from the `users` table, matching only on `X-Username`.
Reducer 2: Compare the hashed password with the plaintext one, setting the user to null if it does not match.
Reducer 3: Reject if the user does not exist

### Sessions
It's probably not great practice to continuously send the username and password with every requests, so why
don't we introduce the concept of sessions into our database.

```javascript
const usersCollection = {
  name: 'users',
  reducers: [
    // Hash the users password when they create or update their account
    `{ ...body, password: hashText(body.password) }`
  ]
}

const sessionsCollection = {
  name: 'sessions',
  reducers: [
    // Allow anyone to create a session, but only internal requests can get and list
    `request.isInternal || method === 'post' ? { ...body, ...headers } : reject('403', 'Forbidden')`,

    // Find the user in the post body when creating a new session
    `{ user: get('users', { username: body.username }) }`,

    // Ensure their password matched the stored hashed one
    `{ user: verifyHash(headers['X-Password'], user.password) ? user : null }`,

    // Generate a secret random string for the token or reject if not logged in
    `user ? { token: generateSecureRandomString(16), userId: user.id } : reject('401', 'You are not logged in') }`
  ]
}
```

```javascript
const collection = {
  name: 'messages',
  reducers: [
    // Find a session matching the request header
    `{
      ...body,
      session: get('sessions', {
        token: headers['X-Session-Token']
      }),
    }`,

    // Find the user for the previously fetched session
    `{
      ...body,
      user: get('users', {
        id: session.userId
      }),
    }`,

    // Add the userId to the record, or reject if they are not signed in
    `{ ...body, userId: user ? user.id : reject('401', 'You are not logged in') }`
  ]
}
```

### Other operations
Methods for all operations would be included:

```
get(collectionName, query)
post(collectionName, recordData)
put(collectionName, query, recordData)
patch(collectionName, query, partialRecordData)
delete(collectionName, query)
```

Also the method `generateSecureRandomString` does not exist in scripting just yet, so I'll need to
get that implemented.

For now you will only be able to query collections within the same database, as an `isInternal` property
will be given, allowing you to have specific `reducer` logic for internal requests.

## Conclusion
There may be things missing from above, and that will become apparent when during implementation. But
I'm confident this approach will allow complete flexibility to implement custom authentication logic.

I will now be removing the current hardcoded "magical" `users` collection from the bitabase server and
that will hopefully improve the benchmarking speeds from the previous blog post.

Since I'm not sure how much longer the optimisation piece will take, the features above will probably
not be worked on for a while.
