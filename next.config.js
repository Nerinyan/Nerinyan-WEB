module.exports = {
  async rewrites() {
    return [
      {
        source: '/main',
        destination: '/',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/post/:comment',
        destination: '/post/:comment',
        permanent: true,
      },
    ]
  },
}