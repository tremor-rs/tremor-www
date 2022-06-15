---
sidebar_label: gpubsub_consumer (Google Pub/Sub)
sidebar_position: 1
---

# The `gpubsub_consumer` Connector

This connector allows consuming a Google PubSub queue.

## Configuration

The credentials must be provided in a JSON file. The path to the JSON file should be set as an environment variable called `GOOGLE_APPLICATION_CREDENTIALS`

```tremor title="config.troy"
define connector gsub from gpubsub_consumer
with
    codec = "string",
    config = {
        "connect_timeout": 100000000, # optional - Connection timeout in nanoseconds, defaults to 1 second 
        "ack_deadline": 100000000, # optional - ACK deadline in nanoseconds, defaults to 10 seconds. PubSub will resend the message if it's not ACKed within this time
        "subscription_id": "projects/my_project/subscriptions/test-subscription-a", # required - ID of the subscription to use
        "endpoint": "https://us-east1-pubsub.googleapis.com" # optional - the endpoint for the PubSub API, defaults to https://pubsub.googleapis.com
    }
end;
```

## Metadata
The connector will set the `$pubsub_connector` metadata variable, which is a dictionary of the messages metadata.

| field        | type                      | description                                                                                 |
|--------------|---------------------------|---------------------------------------------------------------------------------------------|
| message_id   | string                    | The ID of the message, as provided by PubSub                                                |
| ordering_key | string                    | The ordering key of the message                                                             |
| publish_time | integer                   | The time when the message was published (as nanoseconds since 1st January 1970 00:00:00 UTC |
| attributes   | record with string values | The attributes attached to the message                                                      |

## Payload structure
The raw payload will be passed as is to the codec