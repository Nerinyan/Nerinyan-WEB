module.exports = {
  async rewrites() {
    return [
      {
        source: '/main',
        destination: '/',
      },
    ]
  },
  images: {
    loader: 'custom',
    path: 'https://github.com/Nerinyan/Nerinyan-WEB/blob/main/assets/image/',
  },
}