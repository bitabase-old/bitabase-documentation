---
id: collections
title: Collections
sidebar_label: Collections
---

## What are collections
A database has multiple collections, which are queriable sets of records. They are owned by exactly one database.

## Resource Definition
| Name              | Type    | Required | Validation   | Description                           |
|-------------------|---------|----------|--------------|---------------------------------------|
| name              | string  | required | Alphanumeric | The name to reference your collection |
| schema            | object  |          |              | See schema section below              |
| transducers       | array   |          |              | See transducers section below         |
| presenters        | array   |          |              | See presenters section below          |
| date_created      | integer |          |              | A timestamp of the date created       |

> More information on scripting can be found on the [scripting](api/scripting.md) page.

### schema
The `schema` property is an optional object where the key is the name of the field, and the value is
an array of validations.

If you do not provide a `schema` then no validation will be perform on incoming requests, meaning
any client who passes the transducers (more information below) can create any record they like.

If your clients are using bitabase directly, you probably want to define a schema to keep your data
consistent. If you are using bitabase on a server, as a middle man, then you may find it easier to
do your validations on your own server side.

Validations can be custom scripts, or picked from the prebuilt validations below:
- string
- number
- array
- required

An example of an advanced validation schema is:

```json
"schema": {
  "personName": [
    "required",
    "string",
    "value !== 'admin' ? '' : 'Can not use the name admin'"
  ],
  "email": [
    "required",
    "string",
    "includes(value, '@') ? '' : 'Must be an email'"
  ]
}
```

> More information on scripting can be found on the [scripting](api/scripting.md) page.

### transducers
Much like controllers in a typical web application, transducers allow you to control
the business logic of your endpoints.

When performing an http request, bitabase server will reduce over the transducers passing in
the result from the previous transducers until you finish with the record to be inserted.

Some tasks you might want to do in a transducer are:
- Restrict certain methods from being actioned
- Validate only certain fields have been provided

An example of a transducers is:

```json
"transducers": [
  "{...body firstName: toUpperCase(body.firstName)}"
]
```

This transducer will put every field the client provided into the database, but change the
firstName property to upper case.

An example of restricting access is below:

```json
"transducers": [
  "method === 'delete' ? reject(401 'you can not delete') : body",
  "headers['X-Example-Token'] !== '12345' && reject(401, 'example token was invalid')"
]
```

### presenters
If you want to change the response data after it has come from the database or been mutated, then
you can set `presenters`.

An example of a presenter is:

```json
"presenters": [
  "{...body fullName: concat(body.firstName body.lastName)}"
]
```

This will output every property in the record, and add a new one for the full name.

## Available Methods
### Create a new collection
Create a new collection on a specified database.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases/:databaseName/collections</td></tr>
<tr><td><b>Method:</b></td> <td>POST</td></tr>
<tr><td><b>Inputs:</b></td> <td>
  <code>name</code>,
  <code>schema</code>,
  <code>transducers</code>,
  <code>presenters</code>,
</td></tr>
<tr><td><b>Outputs:</b></td> <td><code>name</code></td></tr>
</table>

```javascript
fetch('https://api.bitabase.net/v1/databases/test/collections', {
  method: 'post',
  body: {
    name: 'people',

    // Creating and updating items must conform to this schema
    schema: {
      firstName: ['required', 'string'],
      lastName: ['required', 'string'],
      password: ['required', 'string'],
      email: ['required', 'array']
    },

    // These will be run on each record before presenting back to the client
    // Each transducer must return an object, or call reject.
    transducers: [
      '{...body password: hash(body.password)}',
      'method === "delete" ? reject(401 "you are not allowed to delete people") : body',
    ],

    // These will be run on each record before presenting back to the client
    presenters: [
      '{...record fullname: concat(record.firstName " " record.lastName)}'
    ]
  },
  headers: {
    'X-Session-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'X-Session-Secret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
})
```

Example Response:
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "test",
}
```


### Update an existing collection
Change the configuration of an existing collection on a specified database.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases/:databaseName/collections/:collectionName</td></tr>
<tr><td><b>Method:</b></td> <td>PUT</td></tr>
<tr><td><b>Inputs:</b></td> <td>
  <code>name</code>,
  <code>schema</code>,
  <code>transducers</code>,
  <code>presenters</code>,
</td></tr>
<tr><td><b>Outputs:</b></td> <td><code>name</code></td></tr>
</table>

```javascript
fetch('https://api.bitabase.net/v1/databases/test/collections/people', {
  method: 'put',
  body: {
    // You can not change the collection name
    name: 'people',

    // Creating and updating items must conform to this schema
    schema: {
      firstName: ['required', 'string'],
      lastName: ['required', 'string'],
      password: ['required', 'string'],
      email: ['required', 'array']
    },

    // These will be run on each record before presenting back to the client
    // Each transducer must return an object, or call reject.
    transducers: [
      '{...body password: hash(body.password)}',
      'method === "delete" ? reject(401 "you are not allowed to delete people") : body',
    ],

    // These will be run on each record before presenting back to the client
    presenters: [
      '{...record fullname: concat(record.firstName " " record.lastName)}'
    ]
  },
  headers: {
    'X-Session-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'X-Session-Secret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
});
```

Example Response:
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "test",
  "schema": {
    "firstName": ["required", "string"],
    "lastName": ["required", "string"],
    "password": ["required", "string"],
    "email": ["required", "array"]
  },

  // These will be run on each record before presenting back to the client
  // Each transducer must return an object, or call reject.
  "transducers": [
    "{...body password: hash(body.password)}",
    "method === \"delete\" ? reject(401 \"you are not allowed to delete people\") : body",
  ],

  // These will be run on each record before presenting back to the client
  "presenters": [
    "{...record fullname: concat(record.firstName \" \" record.lastName)}"
  ],

  "statistics": {
    "total_reads": 0,
    "total_space": 0,
    "total_writes": 0
  }
}
```

