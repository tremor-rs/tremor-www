### Modules

1. Modules can be scripts. Scripts can store function and constant definitions.

    - Scripts are stored in `.tremor` files.

2. Modules can be queries. Queries can store window, pipeline, script and operator definitions.

    - Scripts are stored in `.trickle` files.

3. Modules can be deployments. Deployments can store connector, pipeline and flow definitions.

    - Deployments are stored in `.troy` files.

#### Conditioning

Modules in Tremor are resolved via the `TREMOR_PATH` environment variable. The variable can
refer to multiple directory paths, each separated by a `:`. The relative directory
structure and base file name of the source file form the relative module path.

### Constraints

:::caution

We do not recommend:

+ Having overlapping or shared directories across the set of paths
provided in the Tremor path.

+ Having multiple definitions mapping to the same identifier.

:::
