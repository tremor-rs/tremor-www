---
sidebar_label: discord
sidebar_position: 1
---

# The `discord` Connector

The discord connector provides integration with the `discord` service and is
used for the [Tremor Community Bot](https://github.com/tremor-rs/tremor-bot) which is
implemented in tremor.

The connectors requires a bot application [token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token) and a set of [gateway intents](https://discordjs.guide/popular-topics/intents.html#privileged-intents).

As a quick start, the liberally licensed `tremor-bot` can be used as a starting point for
a custom bot based on tremor

## Configuration

```tremor
  define connector discord from discord
  with
    config = {
      # required - A discord API token
      "token" = "some-token",

      "intents" = [
      
    },
  end;

