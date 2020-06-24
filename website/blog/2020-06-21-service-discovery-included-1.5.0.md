---
title: v1.5.0
author: Mark Wylde
authorURL: http://twitter.com/mark.is.wylde
---

This release combines the recent work on implementing service discovery into each other servers, managers and gateways.

The responsibilities of this project are now to bring up 1 instances of each rqlite, server, manager and gateway.

Using this release, you can start bitabase:

bitabase --secret some-secret
Joining two instances is possible too:

bitabase --secret some-secret --rqlite-join=http://somehost:4001
This is by no means a stable, production ready release, so just for testing right now!

[More Information at GitHub](https://github.com/bitabase/bitabase/releases/tag/v1.5.0)
