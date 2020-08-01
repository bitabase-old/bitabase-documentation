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
<tr><td><b>URL:</b></td> <td>https://YOUR-DATABASE.bitabase.net/:collectionName</td></tr>
<tr><td><b>Method:</b></td> <td>GET</td></tr>
<tr><td><b>Inputs:</b></td> <td><i>Not Applicable</i></td></tr>
<tr><td><b>Outputs:</b></td> <td>Array of records</td></tr>
<tr><td><b>Filtering:</b></td> <td>
  <code><a href="filtering">?query={}</a></code>
  <code>"?fields=["dateCreated"]</code>
</td></tr>
<tr><td><b>Pagination:</b></td> <td>
  <code><a href="pagination">?limit=10</a></code>
  <code><a href="pagination">?offset=0</a></code>
</td></tr>
</table>

```javascript
fetch('https://YOUR-DATABASE.bitabase.net/:collectionName', {
  method: 'get'
})
```

Example Response:
```json
{
  "count": 1,
  "items": [{
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "test",
  }]
}
```

