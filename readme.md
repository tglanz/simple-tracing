# Simple Tracing

Example application to check why context propagation doesn't work.

Backlinks:
- https://github.com/open-telemetry/opentelemetry-js/issues/4247

## Architecture

The Web App calls the Die Roller Service which calls the Randomizer Service.

We only send traces from the backend.

We expect to see context propagation from the Die Roller Service to the Randomizer Service.

## Running

You can use the `compose.yaml` file to run the application with a Collector and Jaeger configured. Just run

    docker compose up

The web application will be served at [http://localhost:5173]() and Jaeger will be hosted at [http://localhost:16686]()
