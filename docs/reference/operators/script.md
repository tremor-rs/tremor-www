# script

An embedded tremor script is created with a special syntax that deviates from the operator creation. For a full reference see the section on [tremor-query embedded-scripts](../../language/pipelines#embedded-script-definitions).

The tremor script runtime allows to modify events or their metadata. To learn more about Tremor Script please see the [related section](../../language/scripts).

The `script` operator allows to modify the events metadata (via `$`), and the script local `state` which persists across single events. `state` can be initialized with a `state` section in the scrtipt definition.

in addition to the `script` section, that is executed when an event arrives on the `in` port, the `script` operator allows to define multiple other sections with `script from <port>` that get executed when an event arrives on `<port>` all sections share the same `state` allowing to decuple control and dataflow.

**Inputs**:

- `in` - the main `script` section
- `script from <port>` is executed when data arrives at the port `<port>`

**Outputs**:

- `out` (default output used with `emit`)
- `error` - channel for runtime errors
- `<anything else>` used when `emit event => "<anything else>"`

**Examples**:

```tremor
# definition
define script rt
script
  emit
end;
```

```tremor
define script add
state
  0
script
  let state = state + event
  emit state
end;

create script add;

select event from in into add;
select event from add into out;
```