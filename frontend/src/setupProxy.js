const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/*',
    createProxyMiddleware({
      target: 'http://backend:8080',
      headers: {
        "Connection": "keep-alive"
      },
      changeOrigin: true,
      secure: false
    })
  );
  app.use(
    '/test-bucket',
    createProxyMiddleware({
      'target': 'http://localstack:4566',
      headers: {
        "Connection": "keep-alive"
      },
      changeOrigin: true,
      secure: false
    })
  );
};