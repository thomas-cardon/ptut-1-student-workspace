module.exports = {
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
  }
}
