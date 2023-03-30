export default defineAppConfig({
  pages: [
    'pages/roomAI/index',
  ],
  enableShareAppMessage: true,
  window: {
    visualEffectInBackground: "hidden",
    pullRefresh: false,
    allowsBounceVertical: "YES",
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black'
  },
  plugins: {
    "WechatSI": {
      "version": "0.3.5",
      "provider": "wx069ba97219f66d99"
    }
  }
  // "plugins": {
  // "WechatSI": {
  //   "version": "0.3.5",
  //   "provider": "wx069ba97219f66d99"
  // }
  // },
})
