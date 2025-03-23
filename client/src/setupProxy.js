const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8090/api',
     //target: '/api',  
     changeOrigin: true,
    })
  );
};