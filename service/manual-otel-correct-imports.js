// This is an attempt at manual initialization.
// Context propagation still don't work.
//
// To run using this setup, change the .env files such that
//     NODE_OPTIONS=--import ./manual-otel.js

import * as api from '@opentelemetry/api';
import * as core from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

if (process.env.ENABLE_DIAG === "true") {
  api.diag.setLogger(new api.DiagConsoleLogger(), { logLevel: api.DiagLogLevel.INFO });
}

const exporter = new OTLPTraceExporter();
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "unknown",
  }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

const propagator = new core.CompositePropagator({
  propagators: [
    new core.W3CBaggagePropagator(),
    new core.W3CTraceContextPropagator(),
    new core.W3CBaggagePropagator(),
  ]
});

api.propagation.setGlobalPropagator(propagator);

provider.register({
  propagator,
});

registerInstrumentations({
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      }
    }),
  ],
});
