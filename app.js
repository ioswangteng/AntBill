App({

  baseUrl:"http://iselfbuy.yy365.cn/AppHandle?h=",


  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
  
    // this.getAuthCode();
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },

});
