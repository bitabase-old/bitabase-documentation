---
id: records
title: Records
sidebar_label: Records
---

## What are records
Every collection holds onto records which are managed through the configuration you set when
creating it originally.

## Available Methods
### Search through records
List all the records in a collection

<table>
<tr><td><b>URL:</b></td> <td>https://DATABASE_NAME.bitabase.net/:collectionName</td></tr>
<tr><td><b>Method:</b></td> <td>GET</td></tr>
<tr><td><b>Inputs:</b></td> <td>Not Applicable</td></tr>
<tr><td><b>Outputs:</b></td> <td>Array of records</td></tr>
<tr><td><b>Filtering:</b></td> <td>
  <code><a href="filtering">?query={}</a></code>
</td></tr>
<tr><td><b>Pagination:</b></td> <td>
  <code><a href="pagination">?limit=10</a></code>
  <code><a href="pagination">?offset=10</a></code>
</td></tr>
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

