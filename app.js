App({
  baseUrl: "http://iselfbuy.yy365.cn/AppHandle?h=",
qrCode:"",
  onLaunch(options) {
    // 第一次打开
    // options.query == { number: 1 }
    // console.info('App onLaunch');


  //     //获取关联普通二维码的码值，放到全局变量qrCode中
  // if (options.query && options.query.qrCode) {
  //   console.info(options.query.qrCode);
  //     this.qrCode = options.query.qrCode;
  //   } 

//  my.scan({
//       type: 'qr',
//       success: (res) => {
//         my.alert({ title: res.code });
//       },
//     });

  
  },

  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
