const withPWA = require('next-pwa')

module.exports = withPWA({
  poweredByHeader: false,
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true
      }
    ];
  },
  pwa: {
    dest: 'public'/*,
    disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/app',
    sw: 'service-worker.js',*/
  }
})
