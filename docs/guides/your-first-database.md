---
id: your-first-database
title: Your First Database
sidebar_label: Your First Database
---

All of the documentation that you see on the main bitabase.com "How It works" page are features coming by the end of this year.

But at the time of writing this post there are only a few endpoints currently available. I'm going to walk you through what you can do right now.

# Step 1: Create an account
Go on over to bitabase.com and sign up for your account, then login.

# Step 2: Create a new database
Once logged in you should see the following screen:
![47|690x415](https://community.bitabase.com/uploads/default/original/1X/60f634123368935c8fbfa02b79945be0a13e0dc1.png) 

Click the "Create a new database" button then enter a random name. Note that this name will be the subdomain that you access your database. For example BILLY would be accessed at billy.bitabase.net. For this reason you must choose a name no one else has though of.

# Step 3: Create a collection
Now your database is up and running it's time to get techy. Open your Chrome (or other browsers) DevTools and we'll paste some code to create our first collection:

> You will need to replace YOURDATABASE with the actual name of your database, and put your sessionId and sessionSecret from the information in the my account page

```javascript
fetch('https://api.bitabase.net/v1/databases/YOURDATABASE/collections', {
  method: 'post',
  body: JSON.stringify({
    name: 'people',
    schema: {
      firstName: ['required', 'string'],
      lastName: ['required', 'string'],
      email: ['required', 'string']
    }
  }),
  headers: {
    'Content-Type': 'application/json',
    'X-Session-Id': 'get this from your my account page',
    'X-Session-Secret': 'get this from your my account page',
    'X-Requested-With': 'fetch'
  }
}).then(r => r.json()).then(console.log)
```

# Step 4: Go see your collection
Great, you now have a collection. Let's go over and see what's in there. In a new tab goto:
https://YOURDATABASE.bitabase.net/people

If all went well you should see the following:

```json
{
  "count": 0,
  "items": []
}
```

# Step 5: Insert a record
It's looking a bit lonely, isn't it? Let's add a person in there.

Open a new DevTools window (making sure your are still on the YOURDATABASE.bitabase.net site).

> CORS has not been enabled yet (at the time of this tutorial), so if you try and access the url from a site other than the your database subdomain you will be hit with errors. In the future you will be able to specify/whitelist domains that can access your url.

Paste the following code.

```javascript
fetch('https://test.bitabase.net/people', {
fetch('https://YOURDATABASE.bitabase.net/people', {
  method: 'post',
  body: JSON.stringify({
      firstName: 'Joe',
      lastName: 'Bloggs',
      email: 'joe.bloggs@example.com'
  }),
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'fetch'
  }
}).then(r => r.json()).then(console.log)
```
> Notice how we didn't need our sessionId or sessionSecret any more. This is before you are now accessing your own personal collection, that your clients can directly use from your own apps.

# Step 6: Lets look at our new record
Just like in step 4, go back to that tab and refresh. Otherwise you can open a new tab and navigate to: https://YOURDATABASE.bitabase.net/people

You should now see a list of your records, containing one item. Joe Bloggs.

```json
{
  "count": 1,
  "items": [
    {
      "id": "dd9330d6-d2d8-431b-8b74-213d0159bd18",
      "firstName": "Joe",
      "lastName": "Bloggs",
      "email": "joe.bloggs@example.com"
    }
  ]
}
```
