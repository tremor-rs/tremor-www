---
sidebar_label: gcs_streamer (Google Cloud storage)
sidebar_position: 1
---

# The Google Cloud Storage Connector

This connector provides the ability to write into Google Cloud Storage.

## Authentication
This connector will use credentials stored in a JSON file pointed to by the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.
Alternatively, if tremor is running inside Google Cloud, the authentication will automatically use the credentials of the machine it is running on.

## Streamer

For this connector, while the (name, bucket name) pair does not change, the consecutive events will be appended to the same file. Events will only be acknowledged once their upload is finished and guaranteed to be stored in GCS.

:::warn
This connector is not transactional - if one of the events fails to be processed, subsequent events will still be tried, which may result in some data missing from the file in case of a catastrophic failure.
:::

### Metadata
Two metadata fields are required for the connector to work - `name` (will be used as the object name) and `bucket` (the name of the bucket where the object will be placed).

### Configuration
All of the configuration options are optional.

| name            | description                                                                                      | default                                           |
|-----------------|--------------------------------------------------------------------------------------------------|---------------------------------------------------|
| url             | The HTTP(s) endpoint to which the requests will be made                                          | https://storage.googleapis.com/upload/storage/v1  |
| connect_timeout | The timeout for the connection (in nanoseconds)                                                  | 10 000 000 000 (10 seconds)                       |
| buffer_size     | The size of a single request body, in bytes (must be divisible by 256kiB, as required by Google) | 8388608 (8MiB, the minimum recommended by Google) |

### Example

```tremor title="config.troy"
define flow main
flow
    define connector metronome from metronome
    with
        config = {"interval": 10}
    end;

    define connector output from gcs_appender
    with
        config = {},
        codec = "json"
    end;

    define pipeline main
    pipeline
        define script add_meta
        script
            use std;
            use std::string;

            let file_id = event.id - (event.id % 4);

            let $gcs_appender.name = "my_file_#{"#{file_id}"}.txt";
            let $gcs_appender.bucket = "tremor-test-bucket";

            emit {"a": "B"}
        end;

        create script add_meta from add_meta;

        select event from in into add_meta;
        select event from add_meta into out;
        select event from add_meta/err into err;
    end;

    define connector console from stdio
    with
        codec = "json"
    end;

    create connector s1 from metronome;
    create connector s2 from output;
    create connector errors from console;

    create pipeline main;

    connect /connector/s1 to /pipeline/main;
    connect /pipeline/main to /connector/s2;
    connect /pipeline/main/err to /connector/errors;
end;

deploy flow main;
```