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
| schema            | object  | required |              | See schema section below              |
| transforms        | array   |          |              | See transforms section below          |
| presenters        | integer |          |              | See presenters section below          |
| rules             | integer |          |              | See rules section below               |
| date_created      | integer |          |              | A timestamp of the date created       |

### schema
The `schema` property must be an object where the key is the name of the field, and the value is
an array of validations.

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

### transforms
If you want to change the request body data before it is `mutated` into the database, then
you can set `transforms`.

As this is the value that was actually be inserted or updated in the database, it's results
must pass the validation schema.

An example of a transforms is:

```json
"transforms": [
  "{...body firstName: body.firstName.toUpperCase()}"
]
```

### presenters
If you want to change the response data after it has come from the database or been mutated, then
you can set `presenters`.

As this is only the presenting object and does not effect the database, you do not have to conform
to the schema validation rules set in the collection configuration.

An example of a presenter is:

```json
"transforms": [
  "{...body fullName: concat(body.firstName body.lastName)}"
]
```

### rules
Sometimes you will only want to allow clients access to a method in certain situations. For this
you can create `rules` that will run before anything is executed on your database.

If a rule returns anything other than an empty string the request will fail.

An example of a rule on a `post` that will only success if a header is set is:

```json
"rules": {
  "POST": [
    "headers['X-Example-Token'] === '12345' ? '' : 'Token was invalid'"
  ]
}
```

## Available Methods
### Create a new collection
Create a new collection on a specified database.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases/:databaseId/collections</td></tr>
<tr><td><b>Method:</b></td> <td>POST</td></tr>
<tr><td><b>Inputs:</b></td> <td>
  <code>name</code>,
  <code>schema</code>,
  <code>transforms</code>,
  <code>presenters</code>,
  <code>rules</code>
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
    transforms: [
      '{...body password: hash(body.password)}'
    ],

    // These will be run on each record before presenting back to the client
    presenters: [
      '{...record fullname: concat(record.firstName " " record.lastName)}'
    ],

    // You can also set rules for each method
    rules: {
      AUTH: [
        'verifyHash(body.password record.password) ? "" : "Login Failed"'
      ],

      DELETE: [
        '"can not delete people"'
      ]
    }
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

