import * as api from '@opentelemetry/api';
import core from '@opentelemetry/core';
import sdkTraceNode from '@opentelemetry/sdk-trace-node';
import exporterTraceOtlpGrpc from "@opentelemetry/exporter-trace-otlp-grpc";
import autoInstrumentationsNode from '@opentelemetry/auto-instrumentations-node';
import resources from '@opentelemetry/resources';
import semconv from '@opentelemetry/semantic-conventions';
import instrumentation from '@opentelemetry/instrumentation';

// Try making fetch work
// import opentelemetryInstrumentationFetchNode from 'opentelemetry-instrumentation-fetch-node';
// import opentelemetryInstrumentationUndici from 'opentelemetry-instrumentation-undici';

const exporter = new exporterTraceOtlpGrpc.OTLPTraceExporter();
const provider = new sdkTraceNode.NodeTracerProvider({
  resource: new resources.Resource({
    [semconv.SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "unknown",
  }),
});

provider.addSpanProcessor(new sdkTraceNode.BatchSpanProcessor(exporter));

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
    // new opentelemetryInstrumentationFetchNode.FetchInstrumentation({
    // }),
    // new opentelemetryInstrumentationUndici.UndiciInstrumentation({
    // }),
  ],
});
