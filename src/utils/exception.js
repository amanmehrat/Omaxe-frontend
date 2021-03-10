import * as Sentry from "@sentry/react";

export const LogException = (message, metadata) => {
    console.log(message, JSON.stringify(metadata));
    Sentry.captureException(metadata);
}