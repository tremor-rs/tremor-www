---
title: Google Cloud Storage and Pub/Sub Connectors
author: Jigyasa Khaneja
author_title: Tremor 2021 Spring Mentee
tags:  [connectors, mentorship, cncf, gpc]
draft: false
hide_table_of_contents: false
description: Jigyasa's LFX spring Mentorship experience report.
--- 

### Introduction

<!--alex ignore gals-men gals-men -->
Hello folks! I'm Jigyasa, a final-year computer science engineering student at Indira Gandhi Delhi Technical University for Women pursuing my bachelor's in Technology. This blog is about my experience contributing to [Tremor](https://www.tremor.rs/) as part of the LFX Mentorship program.
i
### Learning about Tremor

Tremor is an event processing system for unstructured data with rich support for structural pattern matching, filtering, and transformation. It is built for users that have a high message volume to deal with and want to build pipelines to process, route, or limit this event stream. It has a scripting language called tremor-script and a query language as well called tremor-query or trickle.

I had never worked on an event processing system before this internship. In fact, my first major contribution to open-source was through this mentorship program. To get started with it, my mentor [Darach Ennis](https://www.linkedin.com/in/darach-ennis-789866?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BnRZIYeLfRAWJpWsDNlzweA%3D%3D), suggested me some documents that helped me learn more about it:

[/docs/overview/ (deprecated)](https://github.com/tremor-rs/tremor-www-docs/blob/main/docs/overview.md)

[/docs/course (deprecated)](https://github.com/tremor-rs/tremor-www-docs/tree/main/course)

Apart from that, learning more about the tremor-query, tremor-script, and going through the workshops in the docs can be really helpful.

The codebase of Tremor is in Rust, and since I had no prior experience with Rust, I started learning the language.

<!--truncate-->

### Learning Rust

Getting started with Rust was very intimidating. It involved working with things like memory management, borrow checker, lifetimes, and the expressive types which was very new to me and hence, confusing

While getting started with a new language, I try to follow along some interactive tutorials/videos. These are some resources that I found helpful: 

[https://serokell.io/blog/learn-rust](https://serokell.io/blog/learn-rust)

[https://fasterthanli.me/articles/a-half-hour-to-learn-rust](https://fasterthanli.me/articles/a-half-hour-to-learn-rust)

[https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)

However, while coding I used to run into a lot of errors. My mentor suggested me a good practice which is to document those errors and always make good notes of anything and everything I learn. So the next time I come across something similar, I can refer to my notes instead of searching that up on the internet. I used to document the little things like a new `vi` or `git` command that I learned and found helpful. It's also very important to keep those notes organized so that it's faster and easier to find what you're looking for. Compiling notes of all the new things learned in a day can be very helpful.

At times when I used to get stuck with some Rust errors, I used to reach out to my mentor or anyone from the Tremor community and they would help me. Apart from that, these discord servers can be of great help too:

[Rust programming language community server](https://discord.gg/rust-lang-community)

[Firepit](https://discord.gg/4BUXJEB2)

### My Project

My task during the internship was to add support for the Google Cloud connectors in Tremor. I worked on adding the Google Cloud Storage and Google Cloud Pub/Sub connectors. A detailed description of it can be found here:

[https://github.com/tremor-rs/tremor-runtime/issues/724](https://github.com/tremor-rs/tremor-runtime/issues/724)

Before explaining more about it, here's what a connector involves:

**Sources:** Ingest data from the outside world and deserialise to events ( onramps )

**Sinks:** Send serialised events to the outside world ( offramps )

Connectors serve the purpose of sending events to and receiving events from the outside world. A connector can be an event `source` (a.k.a. `onramp`) or an event `sink` (a.k.a. `offramp`) or both.

![Connector](/img/blog-images/LFX-blog-jigyasa/connector.png)

#### Google Cloud Storage connector:

I wrote a GCS sink that can issue the basic GCS Operations such as list buckets and objects, create, insert and delete objects from the Google Cloud Platform cloud storage service. The docs can be found here: [GCS offramp docs](/docs/0.11/artefacts/offramps#gcs)

#### Google Cloud Pub/Sub connector:

The gpub sink can issue the operation of sending a message to a Google Cloud Pub/Sub topic. It also allows creating a subscription to a topic to receive messages in it, with the option to enable/disable message ordering. The gsub source allows receiving messages via a subscription in batches as well as one after another. The docs can be found here:
[gpub offramp](/docs/0.11/artefacts/offramps#gpub) and [gsub onramp](/docs/0.11/artefacts/onramps#gsub)

## Walk-Through Guide

To get started, you need a service account on GCP and you will need a GCP pem file for certificates authentication and a service token json file.

The command used to get the service token `json` file:
```bash
gcloud iam service-accounts keys create key-file.json -iam-account=<iam-account-name>@<project-id>.iam.gserviceaccount.com
```
or 
```bash
gcloud iam service-accounts keys create key-file.json -iam-account=<mail-id-of-service-account>
```

Go to GCP dashboard → IAM & Admin → Service Accounts and get the email-id mentioned which is the `<mail-id-of-service-account>`

### Google Cloud Storage

The following is a usage example of the gcs connector. The following files are required:

**outbound.trickle**

```trickle
select event from in into out
```

**inbound.trickle**

```trickle
select event from in into out
```
**test.yaml**

```yaml
offramp:
  - id: stdout
    type: stdout
    codec: json
    config:
  - id: gcs
    type: gcs
    codec: json
    postprocessors:
      - gzip   
    preprocessors:
      - gzip 
    linked: true
    config:
      pem: <path-to-pem-file>
onramp:
  - id: stdin
    type: file
    codec: json
    config:
      source: /dev/stdin   
binding:
  - id: example
    links:
      '/onramp/stdin/{instance}/out':
        - '/pipeline/outbound/{instance}/in'
      '/pipeline/outbound/{instance}/out':
        - '/offramp/stdout/{instance}/in'
        - '/offramp/gcs/{instance}/in'
      '/offramp/gcs/{instance}/out':
        - '/pipeline/inbound/{instance}/in'
      '/pipeline/inbound/{instance}/out':
        - '/offramp/stdout/{instance}/in'
mapping:
  "/binding/example/passthrough":
    instance: "passthrough"
```
The above config receives `json` on stdin, sends it to Google Cloud Storage service (and stdout) and writes the response received from GCS (since `linked: true`) to stdout.

The instance variable (in the binding) is replaced by the value passthrough in the mapping upon deployment, so it is possible to define multiple bindings (deployments) for a single mapping (template).
Supported preprocessors, that can be configured in yaml file can be found here: [preprocessors](/docs/0.11/artefacts/preprocessors). Supported postprocessors and more about it: [postprocessors](/docs/0.11/artefacts/postprocessors).
Supported codecs, that can be configured in yaml file can be found here: [codecs](/docs/0.11/artefacts/codecs)

- Set the env variable

```bash
export GOOGLE_APPLICATION_CREDENTIALS="<path-to-service-token-json-file>"
```

- Command used to run tremor:

```bash
tremor server run -f outbound.trickle inbound.trickle test.yaml | jq .
```
For a detailed guide on the Operations that can be performed, refer the [docs](/docs/0.11/artefacts/offramps#gcs).

### Google Cloud Pub/sub

Google Cloud Pub/Sub guarantees delivery of all messages, whether low throughput or high throughput, so there should be no concern about messages being lost.

Pub/Sub guarantees at-least-once message delivery, which means that occasional duplicates are to be expected since we acknowledge the messages once they are received.

The following is a usage example of the pub/sub connector. These are the files required:

**outbound trickle:** 

```trickle
select event from in into out
```

**inbound.trickle:**

```trickle
select {"data": event, "meta": $} from in into out;
```

**test.yaml:**

```yaml
offramp:
  - id: stdout
    type: stdout
    codec: json
    config:
  - id: gpub
    type: gpub
    codec: json
    postprocessors:
      - gzip    
    linked: true 
    config:
      pem: <path-to-pem-file>
onramp:
  - id: stdin
    type: file
    codec: json
    config:
      source: /dev/stdin  
  - id: gsub
    type: gsub
    codec: json  
    preprocessors:
      - gzip
    config:
      pem: <path-to-pem-file>
      subscription: '<name-of-subscription>'
binding:
  - id: example
    links:
      '/onramp/stdin/{instance}/out':
        - '/pipeline/outbound/{instance}/in'
      '/pipeline/outbound/{instance}/out':
        - '/offramp/stdout/{instance}/in'
        - '/offramp/gpub/{instance}/in'
      '/offramp/gpub/{instance}/out':
        - '/pipeline/inbound/{instance}/in'
      '/pipeline/inbound/{instance}/out':
        - '/offramp/stdout/{instance}/in'
      '/onramp/gsub/{instance}/out':
        - '/pipeline/inbound/{instance}/in'
mapping:
  "/binding/example/passthrough":
    instance: "passthrough"
```
The above config receives `json` on stdin, sends it to Google Pub/sub service (and stdout) and writes the response received from Google Pub/sub (since `linked` is set to true) to stdout. At the same time, it also receives the messages for the configured subscription from Google pub/sub and writes those messages to stdout.

Supported preprocessors, that can be configured in yaml file can be found here: [preprocessors](/docs/0.11/artefacts/preprocessors).
Supported postprocessors and more about it: [postprocessors](/docs/0.11/artefacts/postprocessors). 
Supported codecs, that can be configured in yaml file can be found here: [codecs](/docs/0.11/artefacts/codecs)

![Tremor Dot Diagram](/img/blog-images/LFX-blog-jigyasa/dot-diagram.png)

- Create a topic using the following `gcloud` command:

```bash
gcloud pubsub topics create <topic-name>
```

- Set the env variable

```bash
export GOOGLE_APPLICATION_CREDENTIALS="<path-to-service-token-json-file>"
```

- Command used to run tremor:

```bash
tremor server run -f outbound.trickle inbound.trickle test.yaml | jq .
```

Refer to the [gpub](/docs/0.11/artefacts/offramps#gpub) and [gsub](/docs/0.11/artefacts/onramps#gsub) docs to perform opertaions.
<!-- docs on the website are not updated rn! -->
<!-- REMOVING IT BECAUSE IT'S IN THE DOCS
- After running tremor, create a subscription:

```bash
{"command": "create_subscription", "project": "<project-id>", "topic": "<topic-name>", "subscription": "<name-of-subscription>", "message_ordering": <`message-ordering`>}
```

*where:*

***<`message-ordering`>** - can be set to `true` or `false` . To receive the messages in order, set the message ordering property on the subscription you receive messages from. Receiving messages in order might increase latency.*

***<`project-id`>** - id of the GCP project*

***<`topic-name`>** - Name of the Pub/Sub topic*

- To send a message:

```bash
{"command": "send_message", "project":"<project-id>", "topic":"<topic-name>", "data": <`data`>, "ordering_key": "<ordering-key>"}
```

*where:*

***<`data`>** - `json` message to be sent to the topic*

***<`ordering-key`>** - If non-empty, identifies related messages for which publish order should be respected. If a Subscription has enable_message_ordering set to true, messages published with the same non-empty ordering_key value will be delivered to subscribers in the order in which they are received by the pub/sub system. All PubsubMessages published in a given PublishRequest must specify the same ordering_key value.* -->

## Testing for gsub onramp (Pub/sub)

Google Cloud Pub/Sub guarantees delivery of all messages and also preserves the order of messages if the subscription has `message-ordering` set.

However, we wish to test the property of guranteed delivery and message-ordering for gsub in events like poor network connectivity. In order to test, before sending the message to pub/sub, we add a field `count` in the event (json) that increments every time we send a message. This would be done in the outbound trickle file. To validate that all the messages are received in order, we have a validation logic in the inbound trickle file that checks if the difference between the `count` value of the current message and the previous message is one, the order is maintained.

For this purpose, we also use a write-ahead log or `wal` that builds on circuit breaker and acknowledgement mechanisms to provide guaranteed delivery. The write-ahead log is useful in situations where sources/onramps do not offer guaranteed delivery themselves, but the data being distributed downstream can benefit from protection against loss and duplication.

We have 3 different configurations for the outbound trickle file - using a [transient wal](https://github.com/tremor-rs/tremor-www/docs/0.11/recipes/transient_gd), [persistent wal](https://github.com/tremor-rs/tremor-www/docs/0.11/recipes/persistent_gd) and no wal. The cofigurations are as follows:

**No wal**

```trickle
define script counter
script
  let count = match state==null of
    case true =>
      0
    default =>
      state.count + 1
  end;

  let state = {"count": count};
  {"command": "send_message", "project":"<project-id>", "topic":"<topic-name>", "data": merge event of {"count": state.count} end, "ordering_key": "<ordering-key>"}
end;

create script counter;

select event from in into counter;
select event from counter into out;
```

**Transient-wal**

```trickle
define qos::wal operator in_memory_wal
with
  read_count = 20,
  max_elements = 1000, # Capacity limit of 1000 stored events
  max_bytes = 10485760 # Capacity limit of 1MB of events
end;

create operator in_memory_wal;

define script counter
script
  let count = match state==null of
    case true =>
      0
    default =>
      state.count + 1
  end;

  let state = {"count": count};
  {"command": "send_message", "project":"<project-id>", "topic":"<topic-name>", "data": merge event of {"count": state.count} end, "ordering_key": "<ordering-key>"}
end;

create script counter;

select event from in into counter;
select event from counter into in_memory_wal;
select event from in_memory_wal into out;
```

**Persistent-wal**

```trickle
define qos::wal operator on_disk_wal
with
  read_count = 20,
  max_elements = 1000, # Capacity limit of 1000 stored events
  max_bytes = 10485760 # Capacity limit of 1MB of events
end;
create operator on_disk_wal;

define script counter
script
  let count = match state==null of
    case true =>
      0
    default =>
      state.count + 1
  end;

  let state = {"count": count};
  {"command": "send_message", "project":"<project-id>", "topic":"<topic-name>", "data": merge event of {"count": state.count} end, "ordering_key": "<ordering-key>"}
end;

create script counter;

select event from in into counter;
select event from counter into on_disk_wal;
select event from on_disk_wal into out;
```

In the **inbound** trickle, we have the validation logic as follows:

```trickle
define script validate
script
  match state == null of
    case true =>
      let valid = match event.data.count == 0 of 
        case true =>
          true      
        default =>
          false
      end,
      let state = {"prev": event.data.count},
      {"response": event, "valid": valid} 
      
    default =>
      let valid = match state.prev + 1 == event.data.count of 
        case true =>
          true
        default =>
          false
      end,
      let state = {"prev": event.data.count},
      
      {"response":event, "valid": valid}
  end;
end;

create script validate;

select {"data": event, "meta": $} from in into validate;
select event from validate into out;
```

For the testing, we run the sink (a.k.a offramp) to send messages and source (a.k.a onramp) to receive messages separately.

![Testing gsub](/img/blog-images/LFX-blog-jigyasa/validation-testing-image.png)


---
***Note:***
*On stopping the server and resarting right afterwards, we see that we lost 1 message (id 7) which was acknwledged inside tremor but not yet fully delivered to the console by gsub.*

---

In all the 3 cases, we obtain similar results. We observe that on restarting tremor, we may lose in flight messages (events) that were already acknowledged at the time the server went down and thus not fully delivered by the downstream system. We may also observe duplicate messages (messages being received more than once). However, the order of messages is preserved. 
Hence, for the `gsub` onramp, a `wal` can assist with partial recovery of downstream system but it is not guarenteed to be lossless.


## Network Failure Recovery

![Network Failure Recovery testing](/img/blog-images/LFX-blog-jigyasa/network-failure-testing.png)

While testing in poor connectivity, the pivot point (where it works) was observed when downlink and uplink packets dropped varies between 47%-50%. 

## Use of Connectors

- Bulk batch rolling event/log storage to GCS
- Distribution of openTelemetry logs/trace/metrics over GCP pub/sub

## The Tremor community

The Tremor community is absolutely great. As I was contributing to it as a part of my internship, I was lucky to have direct access to the Tremor developers working at Wayfair whenever I had any questions. We used to have a lot of meetings in the General Voice channel on discord with the Tremor developers and anyone could join in and ask questions, discuss ideas and share what they are working on. This used to be super helpful.

Apart from that, on the first Tuesday of every month we used to have office hours where everyone joins in and there used to be discussions on topics like: "Why did tremor go open source", "Good practices for contributing to open-source", and Q/As. They used to be a lot of fun.

I am so grateful to my mentors: Darach, Heinz and Matthias for being super kind and always encouraging me to ask questions and clarifying all my doubts. Also, thanks to Ana for always being so nice and helping with my Rust errors. They all are amazing and I thank them for their time and help.

## Final Thoughts

It was an overall great journey contributing to Tremor. I learned so much in these 3 months' time with the support of my mentors. I'm very grateful to CNCF for organizing this mentorship program as it gave me an opportunity to learn about event processing, distributed systems, Rust, Cloud-Native technologies, etc. I wouldn't have learned so much in these 3 months' time had I not been a part of this mentorship program. It was definitely a fun learning experience.
