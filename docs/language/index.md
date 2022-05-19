# Language

Tremor provides a scripting language for defining and deploying [Event Flows].
It is called [Troy] - The Tremor Deployment language.
With [Troy] you define [Flows] that represent [Event Flows]: [Connectors] providing connectivity to the outside world, [Pipelines] representing the actual stream processing and event handling and the Connections of those, forming a complete and self-contained Tremor Application.

[Troy] is used on every level of event processing, starting from the plumbing that provides connectivity to the outside world in the form of a [Flow], ranging over [Pipelines] and [Scripts] for expressing complex event routing, filtering, event introspection and transformation, towards the final step of deploying your application and bringing it to production via [Deploy].

## Modules

[Troy] is built to enable modularization. Instead of cramming all your applications code into a huge single file, you can extract your preconfigured [Connector] definitions or even a full-grown [Flow] (or anything you can define in Troy) into separate files and simply [`use`](../language/reference/deploy.md#rule-use) in your applications main [Troy] file.

### Example

In file `main.troy`:

```tremor
# importing the module `my_flows` from `my_flows.tremor`
# making its definitions available in this file
use my_flows;

# refer to a flow defined the `my_flows` module and deploy it
deploy flow cool_flow_01 from my_flows::cool_flow;
```

In file `my_flows.tremor`:

```tremor

define flow cool_flow
flow
    # make the `pipelines` module within the `troy` namespace available.
    use troy::pipelines;

    # make the `connectors` module within the `troy` namespace available.
    use troy::connectors;

    # refer to the definition of `console` inside the `connectors` module
    create connector my_console from connectors::console;
    # refer to the definition of `passthrough` inside the `pipelines` module
    create pipeline my_passthrough from pipelines::passthrough;

    connect /connector/my_console to /pipeline/my_passthrough;
    connect /pipeline/my_passthrough to /connector/my_console;
end;
```

In this example we put the actual [Flow] definition in a separate file `my_flows.tremor` and [`use`](../language/reference/deploy.md#rule-use)d it in our main [Troy] file.

Even more interestingly, within our `my_flows.tremor` file, we made good use of predefined [Connectors] and [Pipelines] within the [Standard Library] modules [`troy::pipelines`](../reference/stdlib/troy/pipelines.md) and [`troy::connectors`](../reference/stdlib/troy/connectors.md). All standard library modules are available for `use` by default.

It is also important to note that you can use `use` statements on all levels of your code. In the top level, in a [Flow] definition, a [Pipeline] definition or a [Script] operator definition. A `use` statement on an outer scope, say inside a [Flow] definition, like above, will not be available on an inner scope, say a [Pipeline] definition. `use` statements only make the definition of modules available in the current scope.

## TREMOR_PATH

Tremor modules you want to `use`, need to be available on a path listed in the environment variable `$TREMOR_PATH`.
It follows the same format as the well known `$PATH` variable. It should contain 0 or more directories, separated by a colon (`:`).

Getting back to the example above: If you want to `use` the `my_flows.tremor` file, its directory needs to be present in `$TREMOR_PATH` and provided to the `tremor` executable on startup.

An example command line to start tremor with the files above, assuming `my_flows.tremor` is in the current directory, would be:

```console
$ TREMOR_PATH="${TREMOR_PATH}:${PWD} tremor server run main.troy



[YAML]: https://yaml.org/
[Troy]: troy.md
[Deploy]: troy.md#deploy
[Event Flows]: ../getting-started/event_flow.md
[Connectors]: ../reference/connectors
[Connector]: ../reference/connectors
[Flows]: troy.md#flow
[Flow]: troy.md#flow
[Pipelines]: ../language/pipelines
[Pipeline]: ../language/pipelines
[Scripts]: ../language/scripts
[Script]: ../language/scripts
[Standard Library]: ../reference/stdlib