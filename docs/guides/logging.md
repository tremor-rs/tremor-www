---
sidebar_position: 2
---
# Logging
We can use system logging to collect logs from other systems. In this guide, we'll see how to use tremor for this.

:::note
   This example expects that you have some knowledge of tremor or went through the [`basics guide`](basics.md) and [`logging connector`](../reference/connectors/logging.md). We won't explain the concepts covered there again here.
:::

## Connector

In this tutorial, we will use the connector [`file connector`](../reference/connectors/file.md) from the `tremor::connectors` module.

```tremor
define flow logging_flow
flow
	use tremor::connectors;

define connector read_file from file
args
	file = "in"
with
	codec = "json-sorted",
	preprocessors = ["separate"],
	config = {
			"path": args.file,
			"mode": "read"
	},
end;

define connector write_file from file
args
	file = "out"
with
	codec = "json-sorted",
	postprocessors = ["separate"],
	config = {
			"path": args.file,
			"mode": "truncate"
	},
end;
```

## Pipeline

To redirect logs between systems, Tremor defines its [`own functions`](../reference/stdlib/tremor/logging.md):
* `logging::info`
* `logging::trace`
* `logging::debug`
* `logging::warn`
* `logging::error`  

```tremor
use tremor::pipelines;
define pipeline logging_pipeline
into
	out, err, exit
pipeline
	use tremor::logging;
	use std::string;
	select match event of
		case ~re|^[A-Za-z0-9 ]{1,32}+$| => event
			# If string is alphanumeric+spaces with a length between 1 and 32 chars => keep the line
		case ~re|^[A-Za-z0-9 ]{33,}$| => [string::substr(event, 0, 32+1), logging::info("String is longer than 32 characters and will be truncated")][0]
			# If string is alphanumeric+spaces but has a length superior to 32 characters => info + truncate string
		case ~re|^.*$| => logging::warn("[Malformed or empty string: \"{}\"]", event).`args` # Will output the warn message
			# If string is anything else => warning + warning message
		default => ["", logging::error("Not even a string")][0]
			# If data is not a string => error
	end
	from in into out;
end;
```

These functions accept var-args and use two kind of formatting **positional formatting** and **named formatting**.  

### Formatting examples

| module + func  | message            | 2nd arg                      | 3rd arg | ...) => formatted string            |
|----------------|--------------------|------------------------------|---------|-------------------------------------|
| logging::info( | "hello {id}{pct}", | {"pct": "!", "id": "world"}  |         |    ) => "hello world!"              |
| logging::info( | "hello {}{}",      | ["world", "!"]               |         |    ) => "hello world!"              |
| logging::info( | "hello {}",        | "world"                      |         |    ) => "hello world"               |
| logging::info( | "hello {}{}",      | "world",                     | "!"     |    ) => "hello world!"              |
| logging::info( | "hello {}{}",      | "world"                      |         |    ) => error: too few args given   |
| logging::info( | "hello {id}{pct}", | "world",                     | "!"     |    ) => error: named + positional are ambiguous when used simultaneously |
| logging::info( | "hello {}{}",      | {"pct": "!", "id": "world"}  |         |    ) => error: named + positional are ambiguous when used simultaneously |
| logging::info( | "hello {}",        | {"pct": "!", "id": "world"}, | ""      |    ) => "hello {pct: !, id: world}" |
| logging::info( | "hello {}",        | ["world"],                   | ""      |    ) => "hello [world]"             |

### Formatting priority rules

1. The first argument is mandatory, and is of type **string**
2. Number of arguments
	* **1 arg** (including **string** message):  
	No formatting: it must not need any formatting argument

	* **2 args** (including **string** message), then second's type defines the behavior:
	  - **Dictionnary** | **Hashmap** | **Tremor Object**:  
	Named formatting: keys of hashmap being used if necessary* (see last point) to map the named spots to format the values, in the **string** message
	  - **Array** | **List** | **Tremor List**:  
	Positional formatting: arguments listed within the array are using in the same order to map the unamed spots to format in the **string** message.
	  - **Anything other** (e.g. **string**, **numbers**, etc.):  
	Positional formatting: with at most one argument required to be plugged in the **string** message

	* **3+ args** (including **string** message) a.k.a var-args:  
	Positional formatting

3. Edge-case rules  
	In case of unmatching number of argument needed and provided:
	- Ignored trailing args if too many args provided, either via var-args or not (#args provided > #args needed)
	- Error if not enough args provided (#args provided < #args needed)

4. Forbidden cases

	* **Positional formatting** and **named formatting** are ambiguous when used together, so is will not be allowed as so:
		- If format spots are named, then **positional formatting** is not allowed (either from var-args or containers: array/list)
		- If format spots are not named, then **named formatting** is not allowed (from a container: dictionnary/hashmap/object)


## Filter

```tremor
define pipeline filter_logs
into
	out, err, exit
pipeline
	select match event of
		case %{origin == "Tremor"} => event # Filtering out system logs
	end
	from in into flat_line;
	select event
	from flat_line into out;
end;
```

## Logging connector & Wiring
So with all our connectors and pipelines configured, we have to wire up the connector to the metrics pipeline.

```tremor
# Create logging connectors
define connector logging from logs;
create connector logging;

# Create read/write file connectors
create connector reader from read_file;
create connector writer from write_file;

# Create exit connectors
create connector exit from connectors::exit;

# Create pipelines
create pipeline logging_pipeline;
create pipeline filter_logs;

# Connections
connect /connector/reader to /pipeline/logging_pipeline;
connect /pipeline/logging_pipeline to /connector/exit;

connect /connector/logging to /pipeline/filter_logs;
connect /pipeline/filter_logs to /connector/writer;
end;
```
## Integration

### OpenTelemetry

The logging connector can also be used with the [`otel connector`](../reference/connectors/otel.md)

```tremor
#
define flow logging_flow
flow
  use integration;
  use tremor::{connectors, pipelines};

	define connector write_file from file
		args
			file = "in.json"
		with
			codec = "json-sorted",
			postprocessors = ["separate"],
			config = {
					"path": args.file,
					"mode": "truncate"
			},
	end;

	define pipeline logging_pipeline
		into
			out, err, exit
		pipeline
			use tremor::logging;
			select match event of
						case %{level == "TRACE" } => {"logs":[{"resource":{"attributes":{},"dropped_attributes_count":8},"schema_url":"schema_url","instrumentation_library_logs":[{"instrumentation_library":{"name":"name","version":"v0.1.2"},"schema_url":"schema_url","logs":[{"severity_number":4,"flags":128,"span_id":"6161616161616161","trace_id":"61616161616161616161616161616161","dropped_attributes_count":100,"time_unix_nano":0,"severity_text":event.level,"name":"test","attributes":{},"body":event.`args`}]}]}]}
						case %{level == "DEBUG" } => {"logs":[{"resource":{"attributes":{},"dropped_attributes_count":8},"schema_url":"schema_url","instrumentation_library_logs":[{"instrumentation_library":{"name":"name","version":"v0.1.2"},"schema_url":"schema_url","logs":[{"severity_number":8,"flags":128,"span_id":"6161616161616161","trace_id":"61616161616161616161616161616161","dropped_attributes_count":100,"time_unix_nano":0,"severity_text":event.level,"name":"test","attributes":{},"body":event.`args`}]}]}]}
						case %{level == "INFO"  } => {"logs":[{"resource":{"attributes":{},"dropped_attributes_count":8},"schema_url":"schema_url","instrumentation_library_logs":[{"instrumentation_library":{"name":"name","version":"v0.1.2"},"schema_url":"schema_url","logs":[{"severity_number":12,"flags":128,"span_id":"6161616161616161","trace_id":"61616161616161616161616161616161","dropped_attributes_count":100,"time_unix_nano":0,"severity_text":event.level,"name":"test","attributes":{},"body":event.`args`}]}]}]}
						case %{level == "WARN"  } => {"logs":[{"resource":{"attributes":{},"dropped_attributes_count":8},"schema_url":"schema_url","instrumentation_library_logs":[{"instrumentation_library":{"name":"name","version":"v0.1.2"},"schema_url":"schema_url","logs":[{"severity_number":16,"flags":128,"span_id":"6161616161616161","trace_id":"61616161616161616161616161616161","dropped_attributes_count":100,"time_unix_nano":0,"severity_text":event.level,"name":"test","attributes":{},"body":event.`args`}]}]}]}
						case %{level == "ERROR" } => {"logs":[{"resource":{"attributes":{},"dropped_attributes_count":8},"schema_url":"schema_url","instrumentation_library_logs":[{"instrumentation_library":{"name":"name","version":"v0.1.2"},"schema_url":"schema_url","logs":[{"severity_number":20,"flags":128,"span_id":"6161616161616161","trace_id":"61616161616161616161616161616161","dropped_attributes_count":100,"time_unix_nano":0,"severity_text":event.level,"name":"test","attributes":{},"body":event.`args`}]}]}]}
						case _ => "exit"
					end
			from in into out;
			select event
			from in into exit;
		end;

	# Instances of connectors to run for this flow
	create connector writer from write_file;
	create connector exit from connectors::exit;
	define connector logging from logs;
	create connector logging;

	# Instance of pipeline logging to run for this flow
	create pipeline logging_pipeline;

	#Connections
	connect /connector/logging to /pipeline/logging_pipeline;
	connect /pipeline/logging_pipeline to /connector/writer;

end;

define flow server
flow
	use integration;
	use tremor::{connectors, pipelines};

	define connector otel_server from otel_server
	with
	config = {
		"url": "127.0.0.1:4317",
	}
	end;
  
	# Instances of connectors to run for this flow
	create connector data_out from integration::write_file;
	create connector otels from otel_server;
	create connector exit from integration::exit;
	create connector stdio from connectors::console;

	# create pipeline passthrough;
	create pipeline passthrough from pipelines::passthrough;

	# Connections
	connect /connector/otels to /pipeline/passthrough;
	connect /pipeline/passthrough to /connector/stdio;
	connect /pipeline/passthrough to /connector/data_out;
	connect /pipeline/passthrough to /connector/exit;
end;

define flow client
flow
	use integration;
	use tremor::{connectors, pipelines};

	define connector otel_client from otel_client
	with
	config = {
		"url": "127.0.0.1:4317",
	},
	reconnect = {
		"retry": {
		"interval_ms": 100,
		"growth_rate": 2,
		"max_retries": 3,
		}
	}
	end;

	# Instances of connectors to run for this flow
	create connector data_in from integration::read_file;
	create connector otelc from otel_client;
	create pipeline replay from pipelines::passthrough;

	# Replay recorded events over otel client to server
	connect /connector/data_in to /pipeline/replay;
	connect /pipeline/replay to /connector/otelc;
end;

deploy flow logging_flow;
deploy flow server;
deploy flow client;

```

### ElasticSearch

The logging connector can also be used with the [`elastic connector`](../reference/connectors/elastic.md)

```tremor 
#
define flow main
flow
	use std::time::nanos;
	use integration;
	use tremor::{connectors, pipelines};

	define pipeline main
	pipeline
	define script process_batch_item
	script
		# setting required metadata for elastic
		let $elastic = {
		"_index": "1",
		"action": event.action
		};
		let $correlation = event.snot;
		match event of
		case %{present doc_id} => let $elastic["_id"] = event.doc_id
		case _ => null
		end;
		event
	end;
	create script process_batch_item;

	define operator batch from generic::batch with
		count = 6
	end;
	create operator batch;


	select event from in into process_batch_item;
	select event from process_batch_item into batch;
	select event from batch into out;

	select event from process_batch_item/err into err;
	end;

	define pipeline logging_pipeline
		into
			out, err, exit
		pipeline
			use tremor::logging;
			select match event of
						case %{level == "TRACE" } => {"snot": "badger", "action": "update", "doc_id": "badger"}
						case %{level == "DEBUG" } => {"snot": "badger", "action": "null", "doc_id": "badger"}
						case %{level == "INFO"  } => {"snot": "badger", "action": "update", "doc_id": "badger"}
						case %{level == "WARN"  } => {"snot": "badger", "action": "null", "doc_id": "badger"}
						case %{level == "ERROR" } => {"snot": "badger", "action": "delete", "doc_id": "badger"}
						case _ => "exit"
					end
			from in into out;
			select event
			from in into exit;
		end;

	define pipeline response_handling
	pipeline
	select {
		"action": $elastic.action,
		"success": $elastic.success,
		"payload": event.payload,
		"index": $elastic["_index"],
		"correlation": $correlation
	}
	from in where $elastic.success into out;

	select {
		"action": $elastic.action,
		"payload": event.payload,
		"success": $elastic.success,
		"index": $elastic["_index"],
		"correlation": $correlation
	}
	from in where not $elastic.success into err;  
	end;

	define connector elastic from elastic
	with
	config = {
		"nodes": ["http://127.0.0.1:9200/"],
		"include_payload_in_response": true
	}
	end;

	define connector input from cb
	with
	config =  {
		"paths": ["in1.json", "in2.json"],
		"timeout": nanos::from_seconds(5),
		"expect_batched": true,

	}
	end;

	# Instances of connectors to run for this flow
	create connector errfile from integration::write_file
	with
	file = "err.log"
	end;
	create connector okfile from integration::write_file
	with
	file = "ok.log"
	end;
	create connector exit from integration::exit;
	create connector stdio from connectors::console;
	create connector elastic;
	define connector logging from logs;
	create connector logging;

	# Instance of pipeline to run for this flow
	create pipeline main;
	create pipeline response_handling;
	create pipeline logging_pipeline;

	# Connections
	connect /connector/logging to /pipeline/logging_pipeline;
	connect /pipeline/logging_pipeline to /pipeline/main/in;
	connect /pipeline/main/out to /connector/elastic/in;
	connect /connector/elastic/out to /pipeline/response_handling/in;
	connect /pipeline/response_handling/out to /connector/okfile/in;
	connect /pipeline/response_handling/out to /connector/stdio/in;
	connect /pipeline/response_handling/exit to /connector/exit/in;
	connect /connector/elastic/err to /pipeline/response_handling/in;
	connect /pipeline/response_handling/err to /connector/errfile/in;
	connect /pipeline/response_handling/err to /connector/stdio/in;
end;

deploy flow main;

```
