---
title: Connectors for Streaming to AWS S3
author: Daksh
author_title: Tremor 2021 Fall Mentee
author_url: https://www.linkedin.com/in/dak-x
tags: ["connectors", "s3", "mentorship", "cncf"]
draft: false
description: "Daksh's Mentorship summary report"
---

### Introduction
Hi folks, I'm Daksh, a senior year CS student at Indian Institute of Technology, Jammu. This blog talks about my project and experience contributing to [Tremor](https://www.tremor.rs) as part of LFX Mentorship Program Fall 2021.

### Learning about Tremor
I came across [rust](https://www.rust-lang.org/) in early 2020, and I absolutely loved its design,  the syntax and how approachable it was to a beginner. I discovered Tremor while looking for open source projects written in rust. Tremor is an event processing system (think kafka) for unstructured data with rich support for structural pattern-matching, filtering and transformation. Over the summers, I did a few minor PR's. Going through the examples and the [docs](https://www.tremor.rs/docs/index/) I could set up Tremor and start hacking on!!

### My Project

It is very common in event processing to stream data to a persistent storage engine for later processing or archival purposes. My job was to add connectors to stream data to AWS S3. You may find more information in the github [issue](https://github.com/tremor-rs/tremor-runtime/issues/1176).
 
So what is a connector?
A connector is the component of an Event Processing System that provides the functionality of communicating with the outside world. This would enable current, and future users of Tremor to now connect and stream events to any endpoint which supports the S3 API.

#### AWS S3 Connectors
I would explain the sink via an example. To connect to S3, one would require the s3 credentials. Due to lack of support from the sdk only public-secret key credentials are supported _(to be extended once the sdk supports other means for credentials)_.
Tremor would read the key names specified in the config from the environment.

###### s3demo.troy
``` 
define flow s3demo
flow
    define connector s3conn from s3 with
    codec="json",
    config={
        "aws_access_token": "AWS_ACCESS_KEY_ID",
        "aws_secret_access_key": "AWS_SECRET_ACCESS_KEY",
        "aws_region": "AWS_REGION",
        "bucket": "tremordemo",
        "min_part_size": 5242880,
    }
    end;

    define connector files3 from file with
    code="json",
    config={
        "mode": "read",
        "path": "sample.json",
    },
    preprocessors=["lines"]
    end;

    define pipeline s3pipe
    pipeline
        define script s3Event
            script
            let e = event;
            let $s3 = {
                "key": e.key
                };
            let payload = e.payload;
            payload
            end;

        create script s3Event;

        select event from in into s3Event;
        select event from s3Event into out;

    end;

    create connector s3conn;
    create connector files3;
    create pipeline s3pipe;

    connect /connector/files3 to /pipeline/s3pipe;
    connect /pipeline/s3pipe to /connector/s3conn;

end;

deploy flow s3demo;
```
###### sample.json
```json
{"key": "key1", "payload": {"event1": "hello1", "key2":[1,2,3,4,5]} }
{"key": "key2", "payload": {"event3": {"nested Obj": ["vec1", "vec2", "vec3"]}} }
{"key": "key3", "payload": {"event3": null}}
```
This configuration reads the file `sample.json` _delimited by lines_ for events. The `s3pipe` pipeline destructures the line contents to set the `data` for the object to upload and its `key` as meta-data. The s3-sink would then upload the data to AWS S3 with key set to $key inside the bucket `tremordemo` _or anything that is given in the config_

![Sample Working](/img/blog-images/LFX-blog-daksh/s3diagram.png)

The sink also has the `min_part_size` configuration parameter. S3 support uploading larger objects in multiple parts. One can send multiple events with the same __key__ consecutively, and Tremor would append the content of all those events, and whenever the content size gets larger than the __min_part_size__, a part is uploaded to s3. Whenever the key changes or Tremor stops, the upload for the previous key is completed.

#### Ending Thoughts

I had a very productive and fun time with the Tremor Community. The Tremor principle of "never __worry__ about it" has helped me to deal with clueless moments during this mentorship. I would like to express my regards and gratitude to Matthias, Heinz, and Darach for giving me this wonderful opportunity and helping me develop as an open-source contributor and as a joyful person. A special thanks to Matthias for being there to clarify my doubts and fix my mistakes and for being really helpful. 
I would continue to be a part of the Tremor Community and hope to engage with more newcomers to open-source. I would wish to be part of future CNCF events. You may see me around at the Tremor [Discord](https://chat.tremor.rs).
