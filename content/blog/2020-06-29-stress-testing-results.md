---
title: Stress Testing Results
author: Mark Wylde
authorURL: http://twitter.com/markiswylde
---

Over this weekend I've been playing with a new project called [bitabase-stressed](https://github.com/bitabase/bitabase-stressed).

![stressed screenshot](/img/blog-assets/stressed.png "stressed screenshot")

This is a tool that will run a series of integration tests at a rate you specify to see how far you can push the database.

Unfortunatly the results this weekend have not been impressive, although I haven't looked into the reason why this is slow yet.

I expect the rqlite stuff to be a bit slow, since it's a replicated database that is strongly consistent for metadata. This means there is always going to be a somewhat upper limit of how many databases and collections you can create. I was able to create around 250 databases a second on my machine, which I'm happyish about. In the future I would want to test this can vertically scale by increasing the machine size.

However I would expect that writing records should be a lot better than 100 per second. This is unacceptably slow.

Again, I haven't been able to research why it's going so slow, but some thoughts:

1. SQLite is normally not very good (although better than this) at inserting records one at a time. An option may be to batch all writes received within a small timeframe (100ms) then insert them at the same time.
2. This is running in docker on the same machine I'm running the stress tests.
3. I haven't scaled horiontally. This was only on a "cluster" with one server node.
4. This sucks. I was really hoping for a few thousand writes per second per node.

We're down but not out. Now we have the stress testing tool in place, I can leave that running and tweak settings and debug the services to try and find out what the bottleneck is.

On top of the stress testing, some bugs have been fixed. The gateway and manager were crashing when no servers had been discovered yet. Now it returns a 500 to the client, and logs an error to the console.

That's it for now!
