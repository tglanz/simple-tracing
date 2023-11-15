// This is an attempt at manual initialization.
// Context propagation still don't work.
//
// To run using this setup, change the .env files such that
//     NODE_OPTIONS=--import ./manual-otel.js

import * as api from '@opentelemetry/api';
import core from '@opentelemetry/core';
import sdkTraceNode from '@opentelemetry/sdk-trace-node';
import exporterTraceOtlpGrpc from "@opentelemetry/exporter-trace-otlp-grpc";
import autoInstrumentationsNode from '@opentelemetry/auto-instrumentations-node';
import resources from '@opentelemetry/resources';
import semconv from '@opentelemetry/semantic-conventions';
import instrumentation from '@opentelemetry/instrumentation';

if (process.env.ENABLE_DIAG === "true") {
  api.diag.setLogger(new api.DiagConsoleLogger(), { logLevel: api.DiagLogLevel.INFO });
}

const exporter = new exporterTraceOtlpGrpc.OTLPTraceExporter();
const provider = new sdkTraceNode.NodeTracerProvider({
  resource: new resources.Resource({
    [semconv.SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "unknown",
  }),
});

provider.addSpanProcessor(new sdkTraceNode.SimpleSpanProcessor(exporter));

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

instrumentation.registerInstrumentations({
  instrumentations: [
    autoInstrumentationsNode.getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      }
    }),
  ],
});
