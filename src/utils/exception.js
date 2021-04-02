import * as Sentry from "@sentry/react";

export const LogException = (message, metadata) => {
    console.log(message, JSON.stringify(metadata));
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV == "production")
        Sentry.captureException(metadata);
}