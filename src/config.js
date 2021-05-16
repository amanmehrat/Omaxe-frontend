const dev = {
    ///restApiBase: 'https://api.techencode.in',
    restApiBase: 'http://localhost:3000',
    graphQLApi: 'https://graph.techencode.in/v1/graphql',
    sentryLogs: 'https://fe07833aa39a4b59a908529720162e72@o547107.ingest.sentry.io/5669337'
};

const staging = {
    restApiBase: 'https://api.techencode.in',
    graphQLApi: 'https://graph.techencode.in/v1/graphql',
    sentryLogs: 'https://fe07833aa39a4b59a908529720162e72@o547107.ingest.sentry.io/5669337'
};

const prod = {
    restApiBase: 'https://api.techencode.in',
    graphQLApi: 'https://graph.techencode.in/v1/graphql',
    sentryLogs: 'https://fe07833aa39a4b59a908529720162e72@o547107.ingest.sentry.io/5669337'
};

//const buildEnv = process.env.REACT_APP_BUILD_ENV;
const buildEnv = process.env.NODE_ENV;

export default buildEnv === 'development' ? dev : buildEnv === 'staging' ? staging : prod;
