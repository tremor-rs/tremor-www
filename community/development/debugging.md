---
sidebar_position: 3
---

# Debugging Tremor

This is a short canned synopsis of debugging tremor.

## rust-lldb

We use rust-lldb, to drive breakpoint debugging in tremor.

Alternately, rust integration with IntelliJ CLION also offers interactive breakpoint debugging in an IDE environment.

### Setup on Mac OS X

rust-lldb ships with rust so no added tooling is required.

### Run and use the Debugger

Preparing tremor for debugging:

```bash
$ rust-lldb target/debug/tremor
(lldb) command script import "/.../.rustup/toolchains/stable-x86_64-apple-darwin/lib/rustlib/etc/lldb_rust_formatters.py"
(lldb) type summary add --no-value --python-function lldb_rust_formatters.print_val -x ".*" --category Rust
(lldb) type category enable Rust
(lldb) target create "target/debug/tremor"
Current executable set to 'target/debug/tremor' (x86_64).
(lldb) run
...
```

You can:

- Run tremor under the debugger:
    ```bash
    (lldb) run
    ```

- Run to breakpoint for malloc related issues:
    ```bash
    (lldb) br set -n malloc_error_break
    (lldb) run
    ```

- Take a backtrace ( stacktrace ) upon hitting a breakpoint:
    ```bash
    (lldb) bt
    ```

- List breakpoints:
    ```bash
    (lldb) br l
    ```

- Quit lldb
    ```bash
    (lldb) quit
    ```

For a more detailed synopsis check out lldb project documentation or the [lldb cheatsheet](https://www.nesono.com/sites/default/files/lldb%20cheat%20sheet.pdf).
