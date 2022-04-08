### Examples

#### Loading and Using a Built-in Function

```tremor
# Load the base64 utilities:
use std::base64;

# Base64 encode the current `event`:
base64::encode(event)
```

#### Loading and Using a Built-in Function with an Alias

```tremor
# Load the base64 utilities:
use std::base64 as snot;

# Base64 encode the current `event`:
snot::encode(event)
```

