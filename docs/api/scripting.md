---
id: scripting
title: Scripting
sidebar_label: Scripting
---

## What are scripts
While creating your API you will probably want some custom logic that has not be
pre built into Bitabase Server.

For this reason Bitabase Server allows scripts to be placed in several places.

The scripts use the `presh` expression language.

More information about [presh](https://github.com/korynunn/presh) are on the github repository.


## Globally Exposed Utilities
Looking at the [bitabase-server evaluate.js code](https://github.com/bitabase/bitabase-server/blob/master/modules/evaluate.js)
we can see several globally exposed functions to help you while you're scripting.

### user
If a collection's API has been called with a valid username and password then the
record from the `users` table will be exposed in all scripts.

### value
May be provided if a script is being called on a value, such as validation on a collection property.

### body
If a mutation is happening to the API, ie a `post`, `put`, `patch` then the body provided by the client
will be provided.

### record
This is the record that is being read. If you are doing a `get` or `put` then you will have access
to the original `record`.

### concat
Join the arguments together.

```javascript
concat('hello' 'there') // === 'hello there'
```

### length
Get the length of a property

```javascript
length('hello') // === 5
length(['a' 'b' 'c']) // === 3
```

### getType
Get the type of a variable

```javascript
getType('hello') // === 'string'
length(['a' 'b' 'c']) // === 'Array'
```

### includes
Returns a boolean if an item apears inside a variable

```javascript
includes({name: "Joe"} 'name' 'Joe') // === true
includes({} 'name' 'Joe') // === false
```

### hashText
Irreversably hash a string. Useful for passwords.

```javascript
hashText('secretpassword') // === 'xxxxxxxxxxxxxxxxxxxx'
```

### verifyHash
Verify is a hashed string is equal to an unhashed string

```javascript
verifyHash('secretpassword', 'xxxxxxxxxxxxxxxxxxxx') // === true
```
