---
id: sorting
title: Sorting
path: API / Global Logic / Sorting
---

When returning records from a collection you may want to query them in a certain order.

For this, every collection can be queried using the `?order=` query string parameter.

## Syntax
The query parameter is a comma delimited string of property keys wrapped in an `asc`
or `desc` function.

## Examples
If you have, for example, a collection where some or all records have a `firstName` and a
`lastName` property.

If you want to return the records in ascending order of `firstName` then you would
use the following query querystring.

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?order=asc(firstName)
```

Or in desencindg order:

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?order=desc(firstName)
```

Or multiple fields, first by descending `lastName` then by ascending `firstName`.

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?order=desc(lastName),asc(firstName)
```
