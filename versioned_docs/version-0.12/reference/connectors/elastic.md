---
sidebar_label: elastic (Elastic Search)
sidebar_position: 1
---

# The `elastic` Connector

The `elastic` connector integrates ElasticSearch and compatible systems with tremor.

Tested with ElasticSearch `v6` and `v7` and OpenSearch `v1.3.1`

Events will be sent to the connected ElasticSearch compatible cluster via the [ES Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)
using the `index` action by default.  It is recommended to batch events sent to this sink using the [`generic::batch` operator](../operators/batch.md) to reduce the overhead introduced by the [ES Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html).

:::note

The configuration options `codec` and `postprocessors` are not used, as elastic will always serialize event payloads as JSON.

:::

If the number of parallel requests surpass `concurrency`, the connector will trigger the [circuit breaker](../../concepts/runtime_capabilities.md#the-circuit-breaker-mechanism) in order to stop events from flowing in. It will restore it again when it regains capacity.

The following metadata variables can be specified on a per event basis:

- `$elastic["_index"]` - The index to write to (required).
- `$elastic["_type"]` - The document type for elastic (optional), deprecated in ES 7.
- `$elastic["_id"]`   - The document id for elastic (optional).
- `$elastic.pipeline` - The ElasticSearch pipeline to use (optional).
- `$elastic.action` - The [bulk action](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) to perform, one of `delete`, `create`, `update` or `index`. If no `action` is provided it defaults to `index`. `delete` and `update` require `$elastic._id` to be set or elastic search will have error.
- `$elastic.raw_paylod` - By default, if the `update` action is used, the event payload is considered as the partial document for update, by wrapping it inside the `doc` field. Setting this field to `true` will take the event payload as is. This allows to specify [`script`](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html#update-api-example), [`doc_as_upsert`](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html#doc_as_upsert) and more fields.


## Configuration

| Option                      | Description                                                                                                                   | Type                                                       | Required | Default value                       |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|----------|-------------------------------------|
| nodes                       | List of URLs to elasticsearch cluster nodes                                                                                   | array of strings                                           | yes      |                                     |
| index                       | Elasticsearch index to operate on. Can be overwritten by event metadata `$elastic["_index"]`                                  | string                                                     | no       |                                     |
| concurrency                 | The maximum number of in-flight requests                                                                                      | unsigned integer                                           | no       | 4                                   |
| include_payload_in_response | Whether or not to include the whole event payload in ES success and error responses emitted via `out` and `err` ports         | boolean                                                    | no       | false                               |
| headers                     | HTTP headers to add to each request to elasticsearch                                                                          | record with string values                                  | no       |                                     |
| auth                        | Authorization method to use for each HTTP request. See [`auth` config](./common_configuration.md#auth).                       | See [`auth` config](./common_configuration.md#auth).       | no       |                                     |
| tls                         | Enable TLS encrypted traffic to elasticsearch. Specify a custom CA certificate chain or make use of client-side certificates. | See[`tls` client config](./common_configuration.md#client) | no       |                                     |
| timeout                     | HTTP request timeout in nanoseconds                                                                                           | unsigned integer                                           | no       | By default no timeout is specified. |


### Example

```tremor title="config.troy"
  define connector elastic from elastic
  with
    config = {
      "nodes": ["http://127.0.0.1:9200/"],
      "concurrency": 10,
      # When true, attaches request payload to response event
      "include_payload_in_response": true
      index = "my_index",
      # authenticate using an elasticsearch api key
      auth = {
        "elastic_api_key": {
          "id": "ZSHpKIEBc6SDIeISiRsT",
          "api_key": "1lqrzNhRSUWmzuQqy333yw"
        }
      }
    }
  end;
```

## A batch upload service to elasticsearch

```tremor
define flow main
flow
  use std::time::nanos;
  use integration;
  use tremor::pipelines;
  use tremor::connectors;

  define pipeline main
  pipeline
  define
    script process_batch_item
    script
      # setting required metadata for elastic
      let $elastic = {
        "_index": "my_little_index",
        "action": event.action,
      };
      let $correlation = event.snot;
      match event of
        case %{present doc_id} => let $elastic["_id"] = event.doc_id
        default => null
      end;
      event
    end;
    create script process_batch_item;

    define operator batch from generic::batch with
      count = 6
    end;
    create operator batch;

    define script process_whole_batch
    script
      let $elastic = {
        "_type": "my_little_doc"
      };
      event
    end;
    create script process_whole_batch;

    select event from in into process_batch_item;
    select event from process_batch_item into batch;
    select event from batch into process_whole_batch;
    select event from process_whole_batch into out;
    select event from process_batch_item/err into err;
    select event from process_whole_batch/err into err;
  end;

  define pipeline response_handling
  into out, exit, err
  pipeline
    select {
      "action": $elastic.action,
      "success": $elastic.success,
      "payload": event.payload,
      "index": $elastic["_index"],
      "doc": $elastic["_type"],
      "correlation": $correlation
    }
    from in where $elastic.success == true into out;

    select {
      "action": $elastic.action,
      "payload": event.payload,
      "success": $elastic.success,
      "index": $elastic["_index"],
      "doc": $elastic["_type"],
      "correlation": $correlation
    }
    from in where $elastic.success == false into err;

    select "exit" from in where match event.payload of case %{ present exit } => true default => false end into exit;
  end;

  define connector elastic from elastic
  with
    config = {
      "nodes": ["http://127.0.0.1:9200/"],
      "concurrency": 10,
      "include_payload_in_response": true
    }
  end;

  create connector input from integration::read_file;
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

  create pipeline main;
  create pipeline response_handling;


  connect /connector/input/out to /pipeline/main/in;
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
