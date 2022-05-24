---
sidebar_label: stdio (Standard IO)
sidebar_position: 1
---
# The `stdio` Connector

The stdio connector integrates with standard input, output and error
streams on the host operating system. These facilities are useful for
integrating with UNIX pipelines or processing with command line tools
such as `jq` during development.

The connector redirects `stdin`, `stdout` and `stderr` from the host operating
system through the connected pipelines in tremor flow definitions accordingly

## Configuration

```tremor
define connector console from stdio;

create connector console from console;

# Wire up stadard input to `stdin` pipeline
connect /connector/console to /pipeline/stdin;

# Wire up `stdout` pipeline to `stdout` on operating system terminal/console
connect /pipeline/stdout to /connector/console;

# Wire up `stderr` pipeline to `stderr` on operating system terminal/console
connect /pipeline/stderr to /connector/console/err;
```

## NOTE

When using the `tremor` command line interface stdard input and output are
often connected with line delimited JSON codecs as a convenience for rapid
applicaiton development.

:::note
These defaults can be overridden in most of the builtin cli tools.

Consult the builtin help via the `--help` or `-h` flags for each
sub command to find out more
:::

