# Dead Code Detection in PHP

## Happened Before

* [Traffic Shaping with Tremor - our origin story](./traffic-shaping).
* [Data Distribution with Tremor - event processing origins.](./data-distribution)
* [Data Flows with Tremor - the rise of query processing.](./data-flow)
* [Kubernetes and Sidecars - it all went cloud native.](./kubernetes-sidecars)
* [Modularity - the rise of reusability.](./modularity)
* [Transaction Orchestration](./search)
* [Unified Observability Platform](./uop)

## Identified Need
We have a humongous PHP application - around 20 million lines of code. It’s believed that there are certain parts of the codebase that are no longer used, but it’s hard to reliably find out which ones. Due to the dynamic nature of PHP, attempts at static analysis have failed. We decided that dynamic analysis was needed, and created a PHP extension that logs all the calls to all functions and methods. That’s a lot of data, and we used tremor to aggregate it.

## Required Outcome
We need to be able to aggregate a lot of data (the extension sends one message for each HTTP request, which can be at the order of hundreds per second for some servers), counting the number of calls to each function or method in the codebase and send it to our service which does further aggregation and presents the data.
![High Level Architecture](./media/dead_code_detection_diagram.png)

## Characteristics
We used Unix Sockets (which were added as a source to tremor during this project) and then a simple script that aggregates the data. We’re hoping to use custom aggregate functions in the future (there’s an open RFC, waiting for the official voting) to further simplify the pipeline.

## Conclusion
We are currently testing the solution with smaller applications, seeing minimal performance impact and no impact on stability. We were able to delete unused code from those applications without affecting their operation.
