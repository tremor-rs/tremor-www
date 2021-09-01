---
title: Tooling
description: Good user experience- Tooling is a first class concern for Tremor.
hide_table_of_contents: false
---

### IDE Integration

![tremor-vim](/img/tremor/tremor-vim.png)

With the [Tremor language server](https://github.com/tremor-rs/tremor-language-server), Tremor comes with advanced support for editing [Tremor Script and Tremor Query](https://tremor.rs/getting-started/scripting) in both Visual Studio Code and VIM.

To install the `tremor-language-server`, you require [Rust to be set up](https://rustup.rs) on your system, and then you can simply run `cargo install tremor-language-server`.

The VS Code extension is available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tremorproject.tremor-language-features).

The VIM plugin can be [installed from GitHub](https://github.com/tremor-rs/tremor-vim).

### Informative Errors

![tremor-error](/img/tremor/error.png)

Making errors human-friendly: recently, this realisation has gained popularity in the programming community, with languages like Rust trying to provide helpful error messages beyond a line number and a generic error.

When developing Tremor, those concerns of developer and operator friendliness were front and center from the beginning. Effort went into making errors and warnings informative, and not leaving users with stack traces, or cryptic output.
