# Getting Started

Welcome to Tremor!

Allow us to guide you towards a working Tremor installation that should allow you to try tremor on your own and to dive deeper more involved topics.

At first we need to get tremor installed somehow.

## Install Tremor

Lets install Tremor via [Docker](https://www.docker.com). If you are looking for other ways to install Tremor, visit our detailed [Installation Docs](install).

All you need is a working [Docker](https://www.docker.com) installation.

Pull the image from the docker hub:

```bash
docker pull tremorproject/tremor:latest
```

Done, now lets configure Tremor to do what we want:

### Configuration

Tremor needs to be told where to get events from, how to handle them and where to send them to.
This is done by passing it a [Troy](../reference/troy) configuration file that describes our event processing logic we wish to deploy to our tremor instance.

```troy
define flow main
flow
  use troy::pipelines;
  use troy::connectors;

  create connector console from connectors::console;
  create pipeline passthrough from pipelines::passthrough;

  connect /connector/console to /pipeline/passthrough;
  connect /pipeline/passthrough to /connector/console;
end;
deploy flow main;
```

There is a lot going on in that file. Don't worry if not everything makes sense yet.
We are going over that in a bit. For now all you need to know is that it will tell tremor to echo back each line you type into its stdin.

For now copy and paste the [Troy](../reference/troy) above into a file `getting_started.troy` in the current directory.

### Running Tremor

Lets get real:

```bash
docker run --rm -i -v $PWD:/etc/tremor/config tremorproject/tremor:latest
```

The docker image is wired up to pick up any [Troy](../reference/troy) files in `/etc/tremor/config`,
so all we need to do is to mount our config at that directory.

We are going to see a lot of logs in our terminal and when we type something, Tremor will actually echo it back at us:

```
...
2022-04-29T14:55:03.448253547+00:00 INFO tremor_runtime::connectors - [Connector::console] Connected.
2022-04-29T14:55:03.448275442+00:00 INFO tremor_runtime::system::flow - [Flow::main] Started.
Hello world
Hello world
```

Congratulations! You just successfully deployed your first Tremor event processing pipeline!

Now it is time to actually find out, what you just did and what else can be done with Tremor.

### Where to go from here

* [The Basics Guide](../guides/basics) - to learn how to handle your Events in Tremor.
* [The Connectors Reference](../reference/connectors) - to see how to get events into and out of Tremor.
* [Our assorted Recipes](../recipes/overview) - to find out how to achieve specific tasks with Tremor we though are common enough to cover. E.g.:
  * [Store Apache httpd logs in Elasticsearch](../recipes/logstash/index.md).
  * [Send pre-aggregated metrics into InfluxDB](../recipes/influx/index.md).
* [Design and Architecture](../about/design) - to see how Tremor works.

