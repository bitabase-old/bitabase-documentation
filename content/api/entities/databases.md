---
id: databases
title: Databases
path: API / Entities / Databases
---

## What are databases
A database is a folder of collections. A database has one or more owners (from the manager).

> Note: Multiple owners has not been implemented in the latest version

## Resource Definition
| Name              | Type    | Validation   | Description                         |
|-------------------|---------|--------------|-------------------------------------|
| name              | string  | Alphanumeric | The name to reference your database |
| total_reads       | integer |              | Sum of all collection read's spent  |
| total_writes      | integer |              | Sum of all collection write's spent |
| total_space       | integer |              | Sum of all collection's space used  |
| total_collections | integer |              | Count of all collections            |
| date_created      | integer |              | A timestamp of the date created     |

## Available Methods
### Create a new database
Create a new database and associate it with the sessions user.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases</td></tr>
<tr><td><b>Method:</b></td> <td>POST</td></tr>
<tr><td><b>Inputs:</b></td> <td>name</td></tr>
<tr><td><b>Outputs:</b></td> <td><code>id</code>, <code>name</code></td></tr>
</table>

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

Example Response:
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "test",
}
```


### List databases
List all databases associated with the sessions user.

<table>
<tr><td><b>URL:</b></td> <td>/v1/databases</td></tr>
<tr><td><b>Method:</b></td> <td>GET</td></tr>
<tr><td><b>Filtering:</b></td> <td>Unavailable</td></tr>
<tr><td><b>Pagination:</b></td> <td>Unavailable</td></tr>
<tr><td><b>Outputs:</b></td> <td><code>*</code></td></tr>
</table>

```javascript
fetch('https://api.bitabase.net/v1/databases', {
  method: 'get',
  headers: {
    'X-Session-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'X-Session-Secret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
})
```

Example Response:
```json
[
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "test",
    "total_reads": 0,
    "total_writes": 0,
    "total_space": 0,
    "total_collections": 0,
    "date_created": 1574159497684
  }
]
```
