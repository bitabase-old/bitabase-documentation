---
id: filtering
title: Filtering
sidebar_label: Filtering
---

When returning records from a collection you may want to query those records and only
return relevant records to the task you are trying to do.

For this, every collection can be queried using the `?query={}` query string parameter.

## Syntax
Bitabase uses a similar concept to MongoDB to filter records, in the form of a JSON object.

| Name               | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| <code>$eq</code>   | Matches values that are equal to a specified value.                 |
| <code>$gt</code>   | Matches values that are greater than a specified value.             |
| <code>$gte</code>  | Matches values that are greater than or equal to a specified value. |       
| <code>$in</code>   | Matches any of the values specified in an array.                    |
| <code>$lt</code>   | Matches values that are less than a specified value.                |
| <code>$lte</code>  | Matches values that are less than or equal to a specified value.    |    
| <code>$ne</code>   | Matches all values that are not equal to a specified value.         |
| <code>$nin</code>  | Matches none of the values specified in an array.                   |


| Name               | Description                                                                                             |
|--------------------|---------------------------------------------------------------------------------------------------------|
| $and               | Joins query clauses with a logical AND returns all documents that match the conditions of both clauses. |
| $not               | Inverts the effect of a query expression and returns documents that do not match the query expression.  |
| $nor               | Joins query clauses with a logical NOR returns all documents that fail to match both clauses.           |
| $or                | Joins query clauses with a logical OR returns all documents that match the conditions of either clause. |

## Examples
If you have, for example, a collection where some or all records have a `firstName` and a
`lastName` property.

If you want to return only records where the `firstName` is equal to `Bob` then you would
use the following url as `$eq` is the default operator:

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?query={"firstName":"Bob"}
```

You could be more explicit and specifiy the operator:

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?query={"firstName":{"$eq":"Bob"}}
```

Or what if we want to return all records except for "Bob":

```text
https://YOUR-DATABASE.bitabase.net/:collectionName?query={"firstName":{"$ne":"Bob"}}
```
