---
sidebar_position: 0
---

# Install Tremor

Lets get Tremor installed on your machine!

## Linux

### Debian based distributions

Tremor `.deb` packages are part of every release. 

Go to our [github release page](https://github.com/tremor-rs/tremor-runtime/releases) and chose a version to download:

```console
$ wget https://github.com/tremor-rs/tremor-runtime/releases/download/v0.12.4/tremor_0.12.4_amd64.deb
```

Install required dependencies:

```console
$ sudo apt install libatomic1 pkg-config libssl-dev
```

Install Tremor with `dpkg`:

```
$ sudo dpkg -i tremor_0.12.4_amd64.deb
```

Start tremor via systemd:

```
$ sudo systemctl enable tremor --now
```

Check the logs:

```
$ sudo journalctl -u tremor
...
Mai 06 11:55:41 hostname tremor[1051339]: tremor version: 0.12.4
Mai 06 11:55:41 hostname tremor[1051339]: tremor instance: tremor
Mai 06 11:55:41 hostname tremor[1051339]: rd_kafka version: 0x000002ff, 1.8.2
Mai 06 11:55:41 hostname tremor[1051339]: allocator: snmalloc
Mai 06 11:55:41 hostname tremor[1051339]: Listening at: http://0.0.0.0:9898
```

Reward yourself with a cake! You successfully installed Tremor!

#### Tested on

* Ubuntu 20.04 (and derivatives)
* Ubuntu 22.04 (and derivatives)
* Debian 11 (and derivatives)

### RPM based distributions

Tremor `.rpm` packages are part of every release.

Go to our [github release page](https://github.com/tremor-rs/tremor-runtime/releases) and chose a version to download:

```console
$ wget https://github.com/tremor-rs/tremor-runtime/releases/download/v0.12.4/tremor-0.12.4-1.x86_64.rpm
```

Install the package (e.g. with `dnf` on Fedora):

```console
$ sudo dnf install tremor-0.12.4-1.x86_64.rpm
```

`dnf` should resolve all required dependencies. If you don't have a tool at hand to do that for you,
please install the only required dependency manually:

 - `libatomic` 

Start Tremor via systemd:

```
$ sudo systemctl enable tremor --now
```

Check the logs:

```
$ sudo journalctl -u tremor
...
Mai 06 11:59:12 hostname tremor[1051339]: tremor version: 0.12.4
Mai 06 11:59:12 hostname tremor[1051339]: tremor instance: tremor
Mai 06 11:59:12 hostname tremor[1051339]: rd_kafka version: 0x000002ff, 1.8.2
Mai 06 11:59:12 hostname tremor[1051339]: allocator: snmalloc
Mai 06 11:59:12 hostname tremor[1051339]: Listening at: http://0.0.0.0:9898
```

Reward yourself with a cake (or whatever you like, really), because you successfully installed Tremor!

#### Tested on

* Fedora 35 (and derivatives)

### Nix

Install Tremor via [nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/tools/misc/tremor-rs/default.nix)

```console
$ nix-env -iA nixos.tremor-rs
```

:::warning

Be aware that the version on nixpkgs might not always be the latest one, due to the version of rustc being available in nixpkgs.
:::

### Windows

For Windows, please use WSL and follow the appropriate installation instructions described above for your specific Linux distribution.

### Pre-compiled Binary

For `x86_64` architectures we do release a raw `tremor` binary package as `.tar.gz` that is also part of every Release.

Go to our [github release page](https://github.com/tremor-rs/tremor-runtime/releases) and chose a version to download:

```console
$ wget https://github.com/tremor-rs/tremor-runtime/releases/download/v0.12.4/tremor-0.12.4-x86_64-unknown-linux-gnu.tar.gz
```

Extract the package to wherever you want (and your access rights allow):

```console
$ tar xzf tremor-0.12.4-x86_64-unknown-linux-gnu.tar.gz
```

Start tremor from your extracted package:

```console
$ tremor-0.12.4-x86_64-unknown-linux-gnu/bin/tremor server run
tremor version: 0.12.4
tremor instance: tremor
rd_kafka version: 0x000002ff, 1.8.2
allocator: snmalloc
Listening at: http://0.0.0.0:9898
```

Reward yourself with a cake, because you just installed Tremor on your machine! Badass!

## Docker

We publish our Releases both to [Docker Hub](https://hub.docker.com/r/tremorproject/tremor) and [Github Container Registry](https://github.com/tremor-rs/tremor-runtime/pkgs/container/tremor-runtime%2Ftremor)

| Container registry | Image name                        |
|--------------------|-----------------------------------|
| docker.io          | `tremorproject/tremor`            |
| ghcr.io            | `tremor-rs/tremor-runtime/tremor` |

### Docker Hub

Pull our image from [Docker Hub](https://hub.docker.com/r/tremorproject/tremor):

```console
$ docker pull tremorproject/tremor:0.12.4
...
Digest: sha256:54bae6b1f64c030086bbc1b083daedc8c5d1725093e76b1571744e1fa26505be
Status: Downloaded newer image for tremorproject/tremor:0.12.4
docker.io/tremorproject/tremor:0.12.4
```

### Github Packages

Pull our image from the [Github Packages Container Registry](https://ghcr.io):

```console
$ docker pull ghcr.io/tremor-rs/tremor-runtime/tremor:0.12.4
...
Digest: sha256:54bae6b1f64c030086bbc1b083daedc8c5d1725093e76b1571744e1fa26505be
Status: Downloaded newer image for ghcr.io/tremor-rs/tremor-runtime/tremor:0.12.4
ghcr.io/tremor-rs/tremor-runtime/tremor:0.12.4
```

## Build From Source

:::warning

When building Tremor from source, you are pretty much on your own. Good luck!

:::

### Requirements

* Rust toolchain 1.60.0 - Install via [Rustup](https://rustup.rs/) or any other way you prefer
* CMake (Minimum supported version 3.2)
* libclang (E.g. via ubuntu package: `libclang-dev`)
* The tremor sources obtained from our [Repository](https://github.com/tremor-rs/tremor-runtime)

### Build via cargo

To build a production-ready, optimized and stripped executable:

```console
$ cd tremor-runtime
$ cargo build --all --release
...
$ strip target/release/tremor
$ target/release/tremor --version
0.12.0
```

The `tremor` binary now can be found at `target/release/tremor`.

Make sure to distribute the standard library from `tremor-script/lib` together with the `tremor` binary and adapt the `TREMOR_PATH` environment variable
to point at the standard library directory and any directories you want ot import your Tremor deployment language modules from.