---
sidebar_position: 5
---

# IDE Integration and tooling

Tremor is configured using its own configuration language called [Troy](../language), which actually enables us to give you valueable feedback while writing your code with our [Tremor language server](https://github.com/tremor-rs/tremor-language-server).

![tremor-vim](/img/tremor/tremor-vim.png)

## Tremor Language Server

With the [Tremor language server](https://github.com/tremor-rs/tremor-language-server), Tremor comes with advanced support for editing [Tremor configuration files](../language) in both Visual Studio Code and VIM and every other editor or IDE that has LSP support.

### Installation

To install the [Tremor language server](https:://github.com/tremor-rs/tremor-language-server) all you need is [Rust](https://www.rust-lang.org/) to be set up on your system. Please use [Rustup.rs](https://rustup.rs) or any other way you prefer.

```console
cargo install tremor-language-server
```

This will download and compile the `tremor-language-server` binary and put it on your path. It will usually be put into `$HOME/.cargo/bin/tremor-language-server`.

## IDE / Editor Integration

The VS Code extension is available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tremorproject.tremor-language-features).

The VIM plugin can be [installed from GitHub](https://github.com/tremor-rs/tremor-vim).

## Local testing

The tremor binary contains testing tools for testing your Tremor flows and pipelines before they actually go to production. Check out the capabilities of our [cli](../reference/cli.md#testing-facilities) for testing your Troy code.