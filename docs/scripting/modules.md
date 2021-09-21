---
sidebar_position: 100
---
# Modules

Tremor-script supports nested namespaces or modules.

Modules in tremor are the lowest unit of compilation available to developers
to modularise tremor logic across multiple logical namespaces. On the filesystem,
modules are rooted at a base path and are nested with folders.
png)

Modules can define `const` constants, `fn` functions, or nested `mod` sub-modules. In addition trickle modules can include `define` statements.

> ![module grammar](./grammar/diagram/ModuleExpr.png)

> ![module inner statement grammar](./grammar/diagram/ModuleStmtInner.png)


# Module Path

Modules can be defined physically on the file system. For example given the following modular hierarchy
on the file system, relative to a root module path: Nested modules can be defined as follows:

```text
  +-- foo
    +-- bar
      +-- snot.tremor
      +-- badger.trickle
    +-- baz
      +-- badger.tremor
      +-- panda.trickle
```

The same modular hierarchy can be defined as nested module declarations as follows:

```tremor
mod foo with
  mod bar with
    const snot = "beep";
  end;
  mod baz with
    const badger = "boop";
  end;
end;

let snot = foo::bar::snot;
let badger = foo::baz::badger;

"#{snot}-#{badger}";
```

or for trickle:

```trickle
mod foo with
  mod bar with
    define tumbling window second with
      interval = 1000
    end;
  end;
  mod baz with
    define tumbling window minute with
      interval = 60000
    end;
  end;
end;

select event
from in[snot::second, badger::minute] # use our imported window definitions
into out;
```


Assuming this module hierarchy is rooted at `/opt/my-project/lib` they can be registered with tremor
by prepending this folder to the `TREMOR_PATH` environment variable

```bash
export TREMOR_PATH="/opt/my-project/lib:$TREMOR_PATH"
```

## Defaults

The `TREMOR_PATH` uses ':' on linux/unix to separate multiple module paths.

The default places to look for your modules is `/usr/local/share/tremor` if `TREMOR_PATH` is not provided.

The default place for the _tremor standard library_ is `/usr/share/tremor/lib`, so the full `TREMOR_PATH` default is

- `/usr/local/share/tremor`
- `/usr/share/tremor/lib`

## Referencing Modules with `use`

The modules can be used using the `use` clause as follows:

```tremor
use foo::bar::snot; # snot is a ref to 'foo/bar/snot.{tremor,trickle}'
use foo::baz::badger; # badger is a ref to 'foo/bar/badger.{tremor,trickle}'

"#{snot::snot}#{badger::badger}"; # emits an interpolated string
```

Modules can be loaded via the `use` clause which in turn loads a module from the physical file system via the module path.

Inline and externalized modules can be used separately or together as appropriate.

Where there are existing references a module can be aliased to avoid clashes in the local scope:

```tremor
use foo::bar as fleek;

"Hello #{fleek::snot}"
```

It is to be noted that inclusion via use will prevent circular inclusion as in file `a.tremor` can use `b.tremor` but beyond that point `b.tremor` can no longer use `a.tremor` as this would create a dependency cycle. This is a restriction of the current implementation and may or may not be relaxed in the future.