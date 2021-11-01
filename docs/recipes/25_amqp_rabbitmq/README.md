# RabbitMQ

:::note
All the application code here is available from the docs [git repository](https://github.com/tremor-rs/tremor-www/tree/main/docs/recipes/25_amqp_rabbitmq).
:::

This example shows how to configure the tremor AMQP connector with upstream and
downstream RabbitMQ based systems.

The scenario isn't all-encompassing but looks at the following specific use-case:

1. A RabbitMQ source
2. A tremor intermediary
3. A RabbitMQ destination

We can start the example using `docker-compose up`.

# Components

There are two tremor instances in the docker setup - one publisher that publishes to RabbitMQ, and one conwsumer that
receives events from RabbitMQ. RabbitMQ was setup with its own virtual host, exchange and queue for the demo and this
configuration is injected into RabbitMQ when docker-compose is run.
