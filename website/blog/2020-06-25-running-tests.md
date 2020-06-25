---
title: Running Tests
author: Mark Wylde
authorURL: http://twitter.com/markiswylde
---

With the latest commit to the main [bitabase repo](https://github.com/bitabase/bitabase), you can now bring
up an environment and run all the integration tests. This works even on a scaled cluster.

Then change directory into the main bitabase folder:

```bash
cd bitabase
```

Put your docker instance into swarm mode.

```bash
docker swarm init
```

Then you can start the cluster using docker-compose. A helper script has been provided.

```bash
docker stack deploy -c docker-compose.yml up
```

This will bring up 1 gateway, 1 manager and 1 server along with an rqlite server to connect them.

> Alternatively you could download the [latest release](https://github.com/bitabase/bitabase/releases) and just run the executable, but scaling will be a bit more involved as you must setup separate servers for each node.

Next we can run the integration tests.

```bash
npm install
node test
```

All being well, this should run and pass every test.

Now we can scale some services up.

```bash
docker service scale bitabase_server=3
docker service scale bitabase_manager=3
docker service scale bitabase_gateway=3
```

Once again, we can run the tests to confirm everything is working.

```bash
node test
```

And just like that we have a scalable, sharded database cluster. Add new swarm nodes on different VM's and
see how far you can scale.
