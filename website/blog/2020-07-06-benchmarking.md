---
title: Benchmarking
author: Mark Wylde
authorURL: http://twitter.com/markiswylde
---

Since the let down of last week I've been trying to find out why things are going so slow.

It turns out that running lots of connections to node on my macOS laptop is just not really
possible. It ends up crashing and hanging after only a few hundred a second.

I moved onto a Linux VM, and was able to get a much higher throughput.

After playing around with Bitabase I found that the database does tend to lock when stress
testing, but in general it doesn't seem to take up too much CPU usage. So to begin with I've
removed the SQLite parts from the bitabase-server on my dev environment to see exactly how
many requests NodeJS can actually handle.

Using apachebench, I ran the following command:

```bash
ab -n 10000 -c 50 -k http://127.0.0.1:8100/
```

This tests against a simple NodeJS server:

```javascript
const http = require('http');

let requestNumber = 0;
function handler (request, response) {
  requestNumber = requestNumber + 1;
  if (Number.isInteger(requestNumber / 1000)) {
    console.log('INFO: Just passed', requestNumber, 'requests');
  }
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('hello');
}

http.createServer(handler).listen(8100);
```

The server does nothing but respond with the text `hello`.

On my Debian VM I was able to complete 10000 requests in just over 3 seconds.

Not as high as I would have hoped for, but in fairness this is a VM running on my mac, so
not really sure what to expect there. However, I'm hoping it sets the foundation benchmark
for adding more complexity to the stress server.

The second thing I tried to simple connecting to Postgres and inserting a record. To no surprise
this is great. Only a couple of extra seconds to perform 10000 inserts and it worked flawlessly:

The code was very simplier to the above, only using the `pg` library, it inserts a record and waits
before responding to the client.

```javascript
const http = require('http');
const { Pool } = require('pg')
const pool = new Pool()

let requestNumber = 0;
function handler (request, response) {
  requestNumber = requestNumber + 1;
  if (Number.isInteger(requestNumber / 1000)) {
    console.log('INFO: Just passed', requestNumber, 'requests');
  }

  pool.query(`INSERT INTO test (name) VALUES ('Hello')`, (err, res) => {
    if (err) {
      return console.log(err);
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('hello');
  })
}

http.createServer(handler).listen(8100);
```

Starting to think about what Bitabase is doing, I thought maybe rqlite is really
slow, and I'd like to test it's performance.

So to start with I ran a query to select one record from the test table. This was
able to process 10000 requests in just under 10 seconds. Very disappointing, considering
I choose to disable the consistency (`?level=none`) when querying rqlite.

Adding to the complexiy I tried inserting records. That increased the time to just over 11 seconds,
then reading with consistency was almost 12 seconds for 10000 requests.

Finally I tested Bitabase, giving me 10000 requests in 18055ms. This is over 3 times slower than postgres,
and not anywhere near my expectations of Bitabase's potential.

I will continue to look deeper into this, and there are two main areas I want to investigate:
1. Every transaction requires a query on the gateway to grab the database and collection schema
information, but is this actually nessisary? If it is, we could cache it locally or query the rqlite
sqlite database directly. But that's what I thought `?level=none` was going, so again quite disappointing
if this is the cause of the slowness.
2. The server looks for authentication data for every request. The current `user` functionalty isn't even
documented, but the early idea was to allow collections to authenticate automatically if a `users` table
exists. With the concept of `reducers` now well implemented, and the ability to CRUD records inside reducers
coming very soon, I think it's safe to completly remove this functionality for now.

Anyway, there is still a lot of investigating and trials left to go through to get this to an acceptable
level of throughput. I'm pleased that the issues I was having last weekend where to do with my mac, and
that running on a VM at least stopped the crashing and gave me a clear number to work towards.

You can find the results of the test below:
```text
nodejs plain
   10000 requests: 3196ms
postgres
   10000 requests: 5319ms
rqlite read (no consistency)
   10000 requests: 9610ms
rqlite insert
   10000 requests: 11336ms
rqlite read
   10000 requests: 11841ms
bitabase (no save)
   10000 requests: 18055ms
```

I'm still hopefull I can get Bitabase transactions down to 10000 requests in around 5000ms. If I can get
anywhere near there, I'll be happy Bitabase still has potential.

Until now, there are no code updates to Bitabase, although I've changed `bitabase-stressed` to ensure it
only pushed new jobs to the maximum allowed amount. Rather than accumulating a huge amount of requests when
receiving push back.
