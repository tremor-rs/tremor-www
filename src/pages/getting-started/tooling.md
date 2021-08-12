+++
title = "Good User Experience"
date = "2020-02-05T10:01:00+01:00"
draft = false
weight = 300
description = "Tooling"
bref= "Tooling is a first class concern for tremor"
toc= true
+++

### IDE Integration

![tremor-vim](/img/tremor/tremor-vim.png)

With the [tremor language server](https://github.com/tremor-rs/tremor-language-server) tremor comes with advanced support for editing [Tremor Script and Tremor Query](https://tremor.rs/getting-started/scripting) in both Visual Studio Code and VIM.

To install the `tremor-language-server`  you require [rust to be set up](https://rustup.rs) on your system and then can simply run `cargo install tremor-language-server`.

The VS Code extension is available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tremorproject.tremor-language-features).

The VIM plugin can be [installed from GitHub](https://github.com/tremor-rs/tremor-vim).

### Informative Errors

![tremor-error](/img/tremor/error.png)

Making errors human-friendly: recently, this realisation has gained popularity in the programming community with languages like rust tyring to provide helpful error messages beyond a line number and a generic error.

When developing tremor, those concerns of developer and operator friendliness were front and center from the beginning. Effort went into making errors and warning informative and not leaving users with stack traces, or cryptic output.
