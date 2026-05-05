import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://dummy-dsn@dummy.ingest.sentry.io/dummy",
  tracesSampleRate: 1,
  debug: false,
});
