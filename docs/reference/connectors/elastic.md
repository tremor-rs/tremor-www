---
sidebar_label: elastic
---

# The `elastic` Connector

The `elastic` connector integrates ElasticSearch and compatible endpoints with tremor.

Tested with ElasticSearch `v6` and `v7` and OpenSearch `v1.3.1`

Events will be sent to the connected ElasticSearch compatible cluster via the [ES Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)
using the `index` action.  It is recommended to batch events sent to this sink using the [generic::batch operator](../../language/queries/operators#genericbatch) to reduce the overhead introduced by the [ES Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html).

NOTE: The configuration options `codec` and `postprocessors` are not used, as elastic will always serialize event payloads as JSON.

If the number of parallel requests surpass `concurrency`, an error event will be emitted to the `err` port, which can be used for appropriate error handling.

The following metadata variables can be specified on a per event basis:

- `$elastic["_index"]` - The index to write to (required).
- `$elastic["_type"]` - The document type for elastic (optional), deprecated in ES 7.
- `$elastic["_id"]`   - The document id for elastic (optional).
- `$elastic.pipeline` - The ElasticSearch pipeline to use (optional).
- `$elastic.action` - The [bulk action](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) to perform, one of `delete`, `create`, `update` or `index`. If no `action` is provided it defaults to `index`. `delete` and `update` require `$elastic._id` to be set or elastic search will have error.


## Configuration

```troy
  # File: config.troy
  define connector elastic from elastic
  with
    config = {
      # Configure one or many downstream nodes
      "nodes": ["http://127.0.0.1:9200/"],

      # Number of in flight events to elastic
      "concurrency": 10,

      # When true, attaches request payload to response event
      "include_payload_in_response": true

      # Optional index to write events to, can be overridden in metadata
      # via `$elastic["_index"] ( default: not set )
      # index = "snot"
    }
  end;
```

## A batch upload service to elasticsearch

```troy
define flow main
flow
  use std::time::nanos;
  use integration;
  use troy::pipelines;
  use troy::connectors;

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

## Notes

For use with [`OpenSearch`](https://opensearch.org/) currently authentication with
basic authentication and credentials is not supported.

