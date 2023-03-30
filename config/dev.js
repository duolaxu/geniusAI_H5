module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  compiler: {
    type: "webpack5",
    prebundle: {
      enable: false,
      force: true,
    },
  },
  defineConstants: {
  },
  mini: {},
  h5: {

  }
}
