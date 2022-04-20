### lines

Splits the input into lines, using character 10 `\n` as the line separator.

Buffers any line fragment that may be present (after the last line separator), till more data arrives. This makes it ideal for use with streaming onramps like [tcp](../tcp), to break down incoming data into distinct events.

Any empty lines present are forwarded as is -- if you want to remove them, please chain the [remove-empty](#remove-empty) preprocessor with this preprocessor. An example:

```yaml
preprocessors:
  - lines
  - remove-empty
```

Note: The proliferation of various lines preprocessors here will go away once preprocessors [support configuration](https://github.com/tremor-rs/tremor-rfcs/pull/31).

### lines-null

Variant of the [lines](#lines) preprocessor that uses null byte `\0` as the line separator.

### lines-pipe

Variant of the [lines](#lines) preprocessor that uses pipe character `|` as the line separator.

### lines-no-buffer

Variant of the [lines](#lines) preprocessor that does *not* buffer any data that may be present after the last line separator -- the fragment is forwarded as is (i.e. treated as a full event).

### lines-cr-no-buffer

Variant of the [lines-no-buffer](#lines-no-buffer) preprocessor that uses character 13 `\r` ([carriage return](https://en.wikipedia.org/wiki/Carriage_return#Computers)) as the line separator.

