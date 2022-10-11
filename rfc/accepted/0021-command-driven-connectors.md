# Command driven connectors

- Feature Name: `command_driven_connectors`
- Start Date: 2021-10-07
- Tremor Issue: [tremor-rs/tremor-runtime#0000](https://github.com/tremor-rs/tremor-runtime/issues/0000)
- RFC PR: [tremor-rs/tremor-rfcs#0000](https://github.com/tremor-rs/tremor-rfcs/pull/0000)

## Summary
[summary]: #summary

This RFC introduces a control plane for connectors to allow controlling their behavior and actions via events.

## Motivation
[motivation]: #motivation

There are many connectors, where, especially on the read side, there's no obvious "default" way to read data. For example object stores usually do not provide an API to stream changes (and if they did, the users might still want to read files in a different fashion). With command driven connectors, users will be able to read data that they need based on the commands they send to the connector.

## Guide-level Explanation
[guide-level-explanation]: #guide-level-explanation

Command-driven connectors define at least two ports - one for data and one for commands.
As an example, let's look at a connector that reads files:

```tremor
define flow main
flow
  define connector file_connector from file
    with 
      codec="string",
      config = {"command_driven": true}
  end;
  
  define connector file_list from file
    with 
    codec = "json",
    config = {
      "path": "in.json",
      "mode": "read", 
    },
  end;
  
  create pipeline main
  pipeline
    select { "command": "read", "path": event.path } from in into out;
  end;
  
  create connector file_connector from file_connector;
  create connector file_list from file_list;
  
  connect /connector/file_list/out to /pipeline/main/in;
  
  # This is the magic - we send the commands here, note the "control" port
  connect /pipeline/main/out to /connector/file_connector/control;
  
  connect /connector/file_connector/data to /pipeline/main/out;
end;
```

## Reference-level Explanation
[reference-level-explanation]: #reference-level-explanation

Each command driven connector implements at least two ports - `data` and `control`.
`control` is an input port, through which the commands are sent.
Currently only reads are supported, so `data` is an output port.
Each message in the `data` port is a single event, with metadata containing the original command.
The commands are standardised as far as it is practical, so the connectors can be swapped without adjusting the rest of the system.

## Drawbacks
[drawbacks]: #drawbacks

This raises the complexity of Tremor.

## Rationale and Alternatives
[rationale-and-alternatives]: #rationale-and-alternatives

There are no known alternatives that provide the same benefits.
Currently, for example the S3 reader connector, will read all files in the bucket, once, which has limited use.

## Prior Art
[prior-art]: #prior-art

Discuss prior art, both the good and the bad, in relation to this proposal.
A few examples of what this can include are:

- For language, library, tools, and clustering proposals: Does this feature exist in other programming languages, and what experience have their community had?
- For community proposals: Is this done by some other community and what were their experiences with it?
- For other teams: What lessons can we learn from what other communities have done here?
- Papers: Are there any published papers or great posts that discuss this? If you have some relevant papers to refer to, this can serve as a more detailed theoretical background.

This section is intended to encourage you as an author to think about the lessons from other projects, provide readers of your RFC with a fuller picture.
If there is no prior art, that is fine- your ideas are interesting to us whether they are brand new or if it is an adaptation from other projects.

Note that while precedent set by other projects is some motivation, it does not, on its own, motivate an RFC.
Please also take into consideration that Tremor sometimes intentionally diverges from similar projects.

## Unresolved Questions
[unresolved-questions]: #unresolved-questions

- How do we enforce uniformity of commands across connectors?
- How would writes work?
- Are multiple events per command allowed in the output?

## Future Possibilities
[future-possibilities]: #future-possibilities

Think about what the natural extension and evolution of your proposal would be and how it would affect Tremor as a whole in a holistic way. Try to use this section as a tool to more fully consider all possible interactions with the project in your proposal. Also, consider how this all fits into the roadmap for the project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may state that you cannot think of anything.

Note that having something written down in the future-possibilities section is not a reason to accept the current or a future RFC; such notes should be in the section on motivation or rationale in this or subsequent RFCs.
The section merely provides additional information.


## notes
- separate channels - one for commands, one for data
- traits (not necessarily rust traits) for the behaviours that a connector can implement
  - e.g. KV store - "read key", "stream read key", filesystem - "create directory", "delete directory"