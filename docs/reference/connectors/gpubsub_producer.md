---
sidebar_label: gpubsub_producer (Google Pub/Sub)
sidebar_position: 1
---

# The `gpubsub_consumer` Connector

This connector allows producing to a Google PubSub queue.

## Configuration

The credentials must be provided in a JSON file. The path to the JSON file should be set as an environment variable called `GOOGLE_APPLICATION_CREDENTIALS`

```tremor title="config.troy"
define flow gbqtest
flow
    define pipeline passthrough
    pipeline
        select event from in into out;
    end;

    define connector metro from metronome
    with
        config = {"interval": 1000}
    end;

    define connector gpub from gpubsub_producer
    with
        codec = "json",
        config = {
            "topic": "projects/xxx/topics/test-topic-a", # required - the identifier of the topic
            "connect_timeout": 100000000, # optional - connection timeout (nanoseconds) - defaults to 10s
            "request_timeout": 100000000, # optional - timeout for each request (nanoseconds) - defaults to 1s 
            "endpoint":  "https://us-east1-pubsub.googleapis.com" # optional - the endpoint for the PubSub API, defaults to https://pubsub.googleapis.com
        }
    end;

    create connector gpub;
    create connector metro;

    create pipeline passthrough;

    connect /connector/metro/out to /pipeline/passthrough;
    connect /pipeline/passthrough to /connector/gpub/in;
end;

deploy flow gbqtest;
```

## Metadata
The connector will use the `$pubsub_publisher` metadata variable, which can be used to set the `ordering_key`.

| field        | type                      | description                                                                                 |
|--------------|---------------------------|---------------------------------------------------------------------------------------------|
| ordering_key | string                    | The ordering key of the message                                                             |

## Payload structure
The raw payload will be passed as is to the codec