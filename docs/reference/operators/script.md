# script

An embedded tremor script is created with a special syntax that deviates from the operator creation. For a full reference see the section on [tremor-query embedded-scripts](../../language/pipelines#embedded-script-definitions).

The tremor script runtime allows to modify events or their metadata. To learn more about Tremor Script please see the [related section](../../language/scripts).

The `script` operator allows to modify the events metadata (via `$`), and the script local `state` which persists across single events.

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
script
  emit + 1
end;

create script add;

select event from in into add;
select event from add into out;
```