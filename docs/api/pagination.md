---
id: pagination
title: Pagination
sidebar_label: Pagination
---

When returning records from a collection you probably don't want to return a large
amount of data, as that can be quite hard to a client to consume.

Instead you can control the maximum number of records that will be returned, and
where to start the query.

## Limit
- **Default**: `10`
- **Syntax**: `?limit=10`

The limit is the maximum number of records you want to return. If you have 100 records
in your collection and want to return only the first 5, you would set the limit to 5.

## Offset
- **Default**: `0`
- **Syntax**: `?offset=0`

The offset is the record number to start returning form. If you have 100 records in
your collection and want to return records 10 to 20 you would set the offset to 10.

## Examples
```text
https://YOUR-DATABASE.bitabase.net/:collectionName?limit=10&offset=25
```