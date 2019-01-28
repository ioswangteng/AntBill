const app = getApp();

Page({
  data: {
    authUserCode: "",
    allData: [],
    commodityItems: [],
    errorResult: "",
    ishidden: false,
    detailItems: [],
    cashier: {
      title: "收银机：105",
      subTitle: "收银员：7076"
    },
    footerItems: [
      {
        title: "地址：青岛市市南区软件园"
      },
      {
        title: "电话：0532-88888888"
      },
    ],
    foldItems: [{
      img: "../../image/pullImg.png",
      title: "查看付款明细",
      isFold: false,
    }],
  },
  onLoad(options) {
    my.showLoading({
      content: '加载中...',
    });
    var qrCode = app.qrCode;
    console.log("this.qrCode：" + qrCode);
    if (qrCode) {
      this.getAuthCode(qrCode);
    } else {
      // my.navigateTo({
      //   url: '../history/history?usrid=' + this.data.authUserCode,
      // });
    }
 
  },
  onPullDownRefresh() {
    my.stopPullDownRefresh()
  },
  //头部历史记录的点击方法
  tapheader() {

    my.navigateTo({
      url: '../history/history?usrid=' + this.data.authUserCode,
    });
  },
  //折叠点击方法
  foldChange(e) {
    const ff = e.target.dataset;
    if (ff.isfold == false) {
      this.setData({
        foldItems: [
          {
            img: "../../image/packup.png",
            title: "收起",
            isFold: true,
          }
        ],
      });
    } else {
      this.setData({
        foldItems: [
          {
            img: "../../image/pullImg.png",
            title: "查看付款明细",
            isFold: false,
          }
        ],
      });
    }
  },
  hiddenImage(e) {
    if (!this.data.ishidden) {
      this.setData({
        ishidden: true,
      })
    }
  },
  getAuthCode(code) {
    var that = this;
    my.getAuthCode({
      scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        console.log("authCode：" + res.authCode);
        if (res.authCode) {
          that.requestHttp(res.authCode, code);
        }
      },
    });
  },
  requestHttp(usercode, code) {
    var that = this;
    if (usercode && code) {
      // console.log("qrCode" + code)
      var jsonData='{"QRCODE":"' + encodeURI(code) + '","USERCODE":"' + usercode + '"}';
      my.httpRequest({
        url: app.baseUrl + 'getOrderInfo',
        method: 'POST',
        data: {
          QueryType: "getOrderInfo",
          Params:
            // '{"CODE":"20181219154010479"}'
           jsonData,
        },
        dataType: 'json',
        timeout: 3000,
        success: function (res) {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          if (res.data.DATA.CODE != "0000") {
            // my.alert({ content: res.data.DATA.MSG });
            that.setData({
              errorResult: res.data.DATA.MSG,
            });
          }
          //  var userid = "2088502717233006";
          var lists = res.data.DATA.DATA;
          console.log("KKKKKKKK" + res.data.DATA.MSG)
          that.setData({
            authUserCode: res.data.DATA.USERID,
            allData: lists,
            commodityItems: res.data.DATA.DATA.GOODS
          });
          that.delaDiscount(res.data.DATA.DATA.OEDER);
        },
        fail: function (res) {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          if (res.error) {
            that.setData({
              errorResult: "异常错误码：" + res.error,
            });
          }
        },
        complete: function (res) {

        }
      });
    } else {
      var that = this;
      my.hideLoading({
        page: that,  // 防止执行时已经切换到其它页面，page指向不准确
      });
      that.setData({
        errorResult: "缺少参数",
      });
    }
  },

  delaDiscount(e) {
    var that = this;
    var arr = [];

    if (e.AMOUNT) {
      var dic = {};
      dic["title"] = "应付款";
      dic["subTitle"] = e.AMOUNT;
      arr.push(dic);
    }
    if (e.PAYAMOUNT) {
      var dic = {};
      dic["title"] = "实付款";
      dic["subTitle"] = e.PAYAMOUNT;
      dic["payment"] = "支付宝";
      arr.push(dic);
    }
    if (e.DISCOUNT) {
      var dic = {};
      dic["title"] = "折扣";
      dic["subTitle"] = e.DISCOUNT;
      arr.push(dic);
    }
    that.setData({
      detailItems: arr
    });
  }
});
