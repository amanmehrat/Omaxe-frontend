import * as Sentry from "@sentry/react";

export const LogException = (message, metadata) => {
    if (process.env.NODE_ENV == "production")
        Sentry.captureException(metadata);
}