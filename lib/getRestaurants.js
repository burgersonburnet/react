import ApolloClient from 'apollo-client';

// By default, this client will send queries to the
//  `/graphql` endpoint on the same host
const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:4000' }),
});
