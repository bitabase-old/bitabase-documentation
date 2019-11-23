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
| mutations         | array   |          |              | See mutations section below           |
| presenters        | integer |          |              | See presenters section below          |
| rules             | integer |          |              | See rules section below               |
| date_created      | integer |          |              | A timestamp of the date created       |

### schema
The `schema` property must be an object where the key is the name of the field, and the value is
an array of validations.

Validations can be custom scripts, or picked from the prebuilt validations below:
- string
- required
- array

An example of an advanced validation schema is:

```json
"schema": {
  "personaName": [
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

### mutations
### presenters
### rules
### date_created

## Available Methods
### Create a new collection
Create a new collection on a specified database.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases/:databaseId/collections</td></tr>
<tr><td><b>Method:</b></td> <td>POST</td></tr>
<tr><td><b>Inputs:</b></td> <td>
  <code>name</code>,
  <code>schema</code>,
  <code>mutations</code>,
  <code>presenters</code>,
  <code>rules</code>
</td></tr>
<tr><td><b>Outputs:</b></td> <td><code>name</code></td></tr>
</table>

```javascript
fetch('https://api.bitabase.net/v1/databases/test/collections', {
  method: 'post',
  body: {
    id: 'people',

    // Creating and updating items must conform to this schema
    schema: {
      firstName: ['required', 'string'],
      lastName: ['required', 'string'],
      password: ['required', 'string'],
      email: ['required', 'array']
    },

    // These will be run on each record before presenting back to the client
    mutations: [
      '{...body password: hash(body.password)}'
    ],

    // These will be run on each record before presenting back to the client
    presenters: [
      '{...record fullname: concat(record.firstName " " record.lastName)}'
    ],

    // You can also set rules for each method
    rules: {
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

