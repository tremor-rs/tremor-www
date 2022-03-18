# <a href='https://www.tremor.rs/'><img src='static/img/tremor-logo.svg' height='100' alt='Header Logo' aria-label='tremor.rs' /></a>

<a href= "#apache">![License](https://img.shields.io/github/license/tremor-rs/tremor-runtime)</a> 
![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/4356/badge)
[![Tremor channel on Discord](https://img.shields.io/badge/chat-on%20discord-%233653a7)](https://discord.com/invite/Wjqu5H9rhQ)
[![Tremor channel on Twitter](https://img.shields.io/badge/tremor--debs-twitter-%231da1f2)](https://twitter.com/TremorDEBS)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f5c25f86-4c18-468e-be20-4408c02ca846/deploy-status)](https://app.netlify.com/sites/tremor-www/deploys)

This project contains the source code for the official [Tremor](https://www.tremor.rs) website.

The main branch between releases can be viewed [here](https://tremor-rs.github.io/tremor-www).

## Installation

This is a step-by-step guideline for installing and running our [Docusaurus](https://docusaurus.io/) (built with React) website:

### Prerequisites/Dependencies

* [Node v16](https://nodejs.org/en/download/package-manager/)

```
npm install
```

* [Rust](https://www.rust-lang.org/tools/install)
* [CMake](https://cmake.org/install/)- an open-source, cross-platform family of tools designed to build, test and package software. CMake will help in the compilation process, and to generate native make.
* [libssl-dev](https://pkgs.org/download/libssl-dev).
* [libclang-dev](https://pkgs.org/download/libclang-dev)- Clang is a compiler front-end.

### Development

To generate a dynamic site and configuration:

Run `make clean` to get rid of object and executable files that had been created in the meantime so as to get a fresh start and make a clean build. Sometimes, the compiler may link or compile files incorrectly; you only need to recompile the files you changed and link the newly created object files with the pre-existing ones. 

```
make clean
```

Run `make` to generate the site files for Tremor stdlib and cli and also produce the default config file for Docusaurus (docusaurus.config.js) with the right navigation references to the generated stdlib files.

```
make
```

### Running the Website

To preview your changes as you edit the files, you can run a local development server that will serve your Tremor website and reflect the latest changes:

```
npm run start
```

By default, a browser window serving the website will open at http://localhost:3000.

## Syntax Highlighting

Docusaurus uses the [Prism](https://github.com/PrismJS/prism) syntax highlighting engine.

We maintain a [fork](https://github.com/tremor-rs/prism) for Tremor language definitions.

## <a id= "apache"> Licence </a>

This repository's content is licensed under the [Apache License 2.0](https://github.com/tremor-rs/tremor-www/blob/main/LICENSE).

Docusaurus is [MIT](https://github.com/facebook/docusaurus/blob/main/LICENSE) Licensed.
