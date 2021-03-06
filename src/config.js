const dev = {
    restApiBase: 'https://api.techencode.in',
    graphQLApi: 'https://graph.techencode.in/v1/graphql'
};

const staging = {
    restApiBase: 'https://api.techencode.in',
    graphQLApi: 'https://graph.techencode.in/v1/graphql'
};

const prod = {
    restApiBase: 'https://api.techencode.in',
    graphQLApi: 'https://graph.techencode.in/v1/graphql'
};

const buildEnv = process.env.REACT_APP_BUILD_ENV;

export default buildEnv === 'dev' ? dev : buildEnv === 'staging' ? staging : prod;
