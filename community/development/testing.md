# Testing

This is a short canned synopsis of testing in the tremor project.

## Running Internal Tests

```bash
cargo test --all
```

## Running Integration Tests

```bash
cargo run -p tremor-cli -- test all tremor-cli/tests
```

:::note
Be sure to set a `TREMOR_PATH` before running the commands posted above, without it, some packages will not resolve, and tests may not run. If starting from the root of the tremor-runtime project, use `export TREMOR_PATH="./tremor-script/lib"` in the same terminal before running commands above..
:::


## EQC

EQC or 'QuickCheck' is a specification-based testing tool for Erlang supporting a test methodology called property-based testing. Programs are tested by writing properties - preconditions, postconditions and invariants. QuickCheck uses random generation to create constructive ( should pass ) and destructive ( should fail ) tests given the specified properties. This allows suitably defined specifications to cover a far greater set of use cases than would ordinarily be possible to write manually.

Further to this, QuickCheck can reduce a set of failing test cases to the minimal test case that forces any failing test to fail its specification. This drastically reduces the amount of QA and developer time required to verify or prove a piece of code works given a suitably defined specification.

### Start tremor

You need to start the tremor to run the tests:

```bash
cargo run -p tremor -- server run
```

### Running EQC

In `tremor-runtime/tremor-erl` run:

```bash
rebar3 as eqc eqc
```
