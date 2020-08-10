---
title: Introducing sub queries
author: Mark Wylde
authorURL: http://twitter.com/markiswylde
---

Some updates for the work done this month.

## Performance
I managed to spin up some VM's on a cloud host provider and ran bitabase-stressed getting around 600 writes per second, which was a shame but not unexpected.

What was surprising is rqlite was no longer taking the majority of CPU. The node process was capping out at around 70%, which still left me with some unanswered questions.

So I decided to create a [benchmarking app](https://github.com/bitabase/barely-benchmarked) which consists of two simple servers. One that talks to bitabase-server (not the clustered bitabase, only the server), and another that talks to postgres.

They both ended up maxing out at 600 requests per second, which makes me think there something about NodeJS's networking that I don't understand. My next step is to play around with a server that doesn't connect to either postgres or bitabase and see how many requests I can get.

## Users
In a previous release of bitabase-server, I removed the users' functionality, but there was still some remaining. Namely, every request was trying to parse users if credentials have been provided.

With the latest server release, this has been completely removed, along with the remaining tests. Authentication is no longer available in bitabase. Unless you implement it yourself. More on that next...

## Sub queries
I have added a first attempt at sub queries into the bitabase server, and a small change to the gateway to allow querying databases when the host domain does not match up.

Having a look at the test in bitabase-server we can see the following collection config:

```javascript
// Create a new collection called 'groups'
yield righto(callarestJson, {
  url: 'http://localhost:8000/v1/databases/test/collections',
  method: 'post',
  body: {
    name: 'groups'
  }
});

// Create a new record in 'groups' with key 'admin'
yield righto(callarestJson, {
  url: 'http://localhost:8000/v1/databases/test/records/groups',
  method: 'post',
  body: {
    key: 'admin', value: 'Administrator'
  }
});

// Create a new record in 'groups' with key 'b'
yield righto(callarestJson, {
  url: 'http://localhost:8000/v1/databases/test/records/groups',
  method: 'post',
  body: {
    key: 'user', value: 'Standard User'
  }
});

// Create a new test collection that will add a `lookupValue` key
yield righto(callarestJson, {
  url: 'http://localhost:8000/v1/databases/test/collections',
  method: 'post',
  body: {
    name: 'users',
    transducers: [`
      {
        ...body,
        lookupValue: bitabase.getOne('groups', {
          query: {
            key: 'user'
          }
        }).value}
    `]
  }
});

// Create a new record in the test collection
const testInsert = yield righto(callarestJson, {
  url: 'http://localhost:8000/v1/databases/test/records/users',
  method: 'post',
  body: {
    name: 'Joe Bloggs'
  }
});
```

This shows us the addition of a new command in the reducer evaluation scope called `bitabase.getOne`.

This works by going back to the gateway and performing a query. You can only query collections inside the same database and the presenters and transducers will run as if it was hit by an external request.

If you want to bypass some transducers, you will need to implement logic in your code. Maybe adding an authorized header that you could check may come in helpful, but I won't implement it until we have a use case.

## Branding
The logo and icons where inconsistent across the github profile, documentation and repos. I've updated them all to make them more consistent. I used Affinity Designer for this, and stored the afdesign file in the bitabase-documentation repo.
