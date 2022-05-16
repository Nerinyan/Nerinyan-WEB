module.exports = {
  async rewrites() {
    return [
      {
        source: '/main',
        destination: '/',
      },
    ]
  },
}