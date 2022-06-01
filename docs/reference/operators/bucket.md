# grouper::bucket

Bucket will perform a sliding window rate limiting based on event metadata. Limits are applied for every `$class`. In a `$class` each `$dimensions` is allowed to pass `$rate` messages per second.

This operator does not support configuration.

This operator preserves event metadata.

**Metadata Variables**:

- `$class` - The class of an event. (String)
- `$rate` - Allowed events per second per class/dimension (Number)
- (Optional) `$dimensions` - The dimensions of the event. (Any)
- (Optional)`$cardinality` - the maximum number of dimensions kept track of at the same time (Number, default: `1000`)

**Outputs**:

- `out`
- `error` - Unprocessable events for example if `$class` or `$rate` are not set.
- `overflow` - Events that exceed the rate defined for them

**Example**:

```tremor
define operator group from grouper::bucket;
```

**Metrics**:

The bucket operator generates additional metrics. For each class the following two statistics are generated (as an example):

```json
{"measurement":"bucketing",
 "tags":{
   "action":"pass",
   "class":"test",
   "direction":"output",
   "node":"bucketing",
   "pipeline":"main",
   "port":"out"
 },
 "fields":{"count":93},
 "timestamp":1553012903452340000
}
{"measurement":"bucketing",
 "tags":{
   "action":"overflow",
   "class":"test",
   "direction":"output",
   "node":"bucketing",
   "pipeline":"main",
   "port":"out"
 },
 "fields":{"count":127},
 "timestamp":1553012903452340000
}
```

This tells us the following, up until this measurement was published in the class `test`:

- (`pass`) Passed 93 events
- (`overflow`) Marked 127 events as overflow due to not fitting in the limit