
### Examples of Identifiers

```tremor
let snot = { "snot": "badger" };
```

### Keyword Escaping

Surrounding an identifier with a backtick (`) allows keywords in Tremor's DSLs to be
escaped.

```tremor
let `let` = 1234.5;
```

### Emoji

:::tip

You can even use emoji as identifiers via the escaping mechanism.

:::

```tremor
let `🚀` = "rocket";
```

But we cannot think of any good reason to do so!

