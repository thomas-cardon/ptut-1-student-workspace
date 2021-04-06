module.exports = {
  future: {
    webpack5: true,
  },
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'fr'
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
