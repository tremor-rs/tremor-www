# Getting Started

Welcome to Tremor!

Allow us to guide you towards a working Tremor installation that should allow you to try tremor on your own and to dive deeper into more involved topics.

At first we need to get tremor installed somehow.

## Install Tremor

To install tremor grab a the latest package from [our releases](https://github.com/tremor-rs/tremor-runtime/releases), you can find an `rpm`, `deb` as well as a `tar`-ball there.

Install the right package for your operating system. For more detailed information you can look at the [installation](install) section.

### Configuration

Tremor needs to be told where to get events from, how to handle them and where to send them to.
This is done by passing it a [Troy] configuration file that describes our event processing logic we wish to deploy to our tremor instance.

The easiest way to get started is running `tremor new <project>`, for the sake of this we'll call our project `getstarted`

```bash
❯ tremor new getstarted
Creating new tremor project: `getstarted`......done.

To run:
 TREMOR_PATH="${TREMOR_PATH}:${PWD}/getstarted" tremor run getstarted/main.troy
```

Tremor will create the `getstarted` folder a `main.troy` in there and a `lib` folder for modular defintions.

You can look at the files to see what's going on but for now we'll just run it.

### Running Tremor

`tremor new` already gave us a hint how to run our project so lets do it: 

```bash
❯ TREMOR_PATH="${TREMOR_PATH}:${PWD}/getstarted" tremor run getstarted/main.troy
```

This will load the `main` troy and also tell tremor where to look for libraries to include. Remember there is a `getstarted/lib` folder.

:::info
[`TREMOR_PATH`] is an environment variable that tells tremor where to look for libraries, if you installed tremor via a package the standard library will automatically be put in a place where Tremor looks, if not you might have to define [`TREMOR_PATH`] yourself.
:::

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

The next best place to go from here is to our [guides](../guides/index.md), especially [The Basics Guide](../guides/basics), this will teach you how to build applications with tremor and teach you the various concepts.


[The Connectors Reference](../reference/connectors), along with the other reference material will help you see some of the build in functionality.


[Troy]: ../language
[`TREMOR_PATH`]: ../language/index.md#tremorpath
