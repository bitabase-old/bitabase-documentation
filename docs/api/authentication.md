---
id: authentication
title: Authentication
sidebar_label: Authentication
---

## Sessions
Sessions are created when you sign in to the Bitabase Client UI, or login to the API.

For example, to create a session you would make the following call:

```javascript
fetch('https://api.bitabase.net/v1/sessions', {
  method: 'post',
  body: {
    email: 'test@example.com',
    password: 'secretpassword'
  }
})
```

This will return an object containing information about your user and your session details.

```javascript
{
  "sessionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "sessionSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "email": "test@example.com",
    "date_created": 1574159136981
  }
}
```

If you are already signed into the Bitabase Client Website your session details will be displayed, 
but hidden initially, in your [my account page](https://www.bitabase.com/my-account).

## Making requests
When accessing any of the Bitabase Management API's you must provide a session id and secret to the REST call.

For example, when creating a database you would making the following call:

```javascript
fetch('https://api.bitabase.net/v1/databases', {
  method: 'post',
  body: {
    name: 'mytestdb'
  },
  headers: {
    'X-Session-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'X-Session-Secret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
})
```