export const oktaConfig = {
    clientId: '0oagvpeqi9u1TBZcN5d7',
    issuer: 'https://dev-91463283.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpCheck: true
}