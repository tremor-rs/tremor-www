---
title: Quick Start
description: Quick start guide to installing, running and testing Tremor.
sidebar_position: 1
---

# Quick Start

This page explains how to get Tremor running on a local system for development or testing. There are 2 ways of installing Tremor:

## Install Rust

Tremor can be run on any platform without using Docker by installing the Rust ecosystem. To install the Rust ecosystem, you can use [rustup](https://www.rust-lang.org/tools/install), which is a toolchain installer.

`rustup` will install all the necessary tools required for Rust, which includes `rustc` (the compiler) and `Cargo` (package manager).

Tremor is built using the latest stable toolchain, so when asked to select the toolchain during installation, select `stable`.

### macOS/Linux

Run the following command and follow the on-screen instructions:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Now, activate it by adding `source $HOME/.cargo/env` to your `.rc file`, and open a new console.

For building Tremor on macOS, you also need to install xcode and the commandline tools.

### Windows

For Windows, please use WSL and follow the Linux distribution installation steps

## Additional Libraries

### macOS

```bash
brew install cmake
```

### Ubuntu

```bash
sudo apt install libssl-dev libclang-dev cmake pkg-config
```

## Running Tremor

After installing Rust and cloning the repository, you can start the Tremor server by running the following from the root (`tremor-runtime`) directory:

```bash
cargo run -p tremor-cli -- server run
```

## Reunning tests

And to run the test suite, you can run:

```bash
cargo test --all
```

This will run all the tests in the suite, except those which are feature-gated and not needed to quickly test Tremor.


### Integration Tests

Tremor contains integration tests that test it from a user's perspective. To run the integration tests you can run:

```bash
cargo run -p tremor-cli -- test integration tremor-cli/tests
```

## Helpful tools

### Rustfmt

`Rustfmt` is a tool for formatting Rust code according to style guidelines. It maintains consistency in the style in the entire project.

To install `rustfmt` run:

```bash
rustup component add rustfmt
```

To run `rustfmt` on the project, run the following command:

```bash
cargo fmt --all
```

### Clippy

`Clippy` is a linting tool that catches common mistakes and improves the rust code. It is available as a toolchain component and can be installed by running:

```bash
rustup component add clippy
```

To run `clippy`, run the following command:

```bash
cargo clippy --all
```

### Flamegraph

`Flamegraph` is a profiling tool that visualises where time is spent in a program. It generates a SVG image based on the current location of the code and the function that were called to get there.

To install it:

```bash
cargo install cargo-flamegraph
```

To run it:

```bash
cargo flamegraph
```