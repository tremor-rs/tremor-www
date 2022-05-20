---
sidebar_position: 5
draft: true
---

# Benchmarking

This is a short synopsis of benchmarking in tremor

## Scope

How to run individual benchmarks comprising the benchmark suite in tremor.

### Run all benchmarks

```bash
tremor test bench ./tremor-cli/tests 
```

### Run individual benchmarks

In order to run individual benchmarks, issue a command of the form:

```bash
tremor test bench ./tremor-cli/tests -i <filters>
```

Where:

| variable          | value                                                                               |
|-------------------|-------------------------------------------------------------------------------------|
| filters | tags or name of the benchmark to run |


## Recommendations

To account for run-on-run variance ( difference in measured or recorded performance from one run to another ) we typically run benchmarks repeatedly on development machines with non-essential services such as docker or other services not engaged in the benchmark such as IDEs shut down during benchmarking.

Even then, development laptops are not lab quality environments so results should be taken as indicative and with a grain of salt.