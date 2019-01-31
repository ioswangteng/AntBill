const app = getApp();

Page({
  data: {

    billcode: "",//接收传来的订单code
    authUserCode: "",//用户id
    allData: [],
    commodityItems: [],
    errorResult: "",
    ishidden: false,
    detailItems: [],
    cashier: {
      title: "收银机：105",
      subTitle: "收银员：7076"
    },

    foldItems: [{
      img: "../../image/pullImg.png",
      title: "查看付款明细",
      isFold: false,
    }],
  },
  onLoad(options) {
    // my.removeStorageSync({
    //           key: 'setuserid',
    //         });

    // my.openSetting({
    //   success: (res) => {

    //     my.removeStorageSync({
    //       key: 'setuserid',
    //     });
    //     /*
    //      * res.authSetting = {
    //      *   "scope.userInfo": true,
    //      *   "scope.location": true,
    //      *   ...
    //      * }
    //      */
    //   }
    // })
    this.judgeJumppage(options);

  },
  judgeJumppage(options) {
    var that = this;
    that.data.billcode = "";
    if (options && options.code) {
      that.data.billcode = options.code;
    }
    console.log("options：" + that.data.billcode);

    var code = app.qrCode;
    if (code === "") {
      code = that.data.billcode;
    }
    console.log("code" + code);
    let getgetuserid = my.getStorageSync({ key: 'setuserid' });
    console.log("一进来取出本地userid的值：" + JSON.stringify(getgetuserid));
    if (getgetuserid.APDataStorage == null && getgetuserid.data == null) {
      //没取到本地的userid需要去授权重新取
      this.getAuthCode();
    } else {
      var getuser = getgetuserid.APDataStorage;

      if (getuser) {
        console.log("getgetuserid.APDataStorage" + JSON.stringify(getgetuserid.APDataStorage));
      } else {
        getuser = getgetuserid.data;
        console.log("getuser" + JSON.stringify(getuser));
      }


      console.log("res.data" + JSON.stringify(getuser));
      that.setData({
        authUserCode: getuser,
      });
      if (code === "") {
        my.redirectTo({
          url: '../history/history?usrid=' + getuser, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        });
      } else {
        that.requestHttp(getuser, code);
      }
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
  //授权获取code码
  getAuthCode() {
    console.log("进来授权了");
    var that = this;
    my.getAuthCode({
      scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        console.log("authCode：" + res.authCode);
        if (res.authCode) {
          that.requestGetUserIdHttp(res.authCode);
        } else {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          if (res.error) {
            that.setData({
              errorResult: "未获取到用户权限，暂无访问权限！",
            });
          }
        }
      },
      fail: function (res) {
        my.hideLoading({
          page: that,  // 防止执行时已经切换到其它页面，page指向不准确
        });
        if (res.error) {
          that.setData({
            errorResult: "未获取到用户权限，暂无访问权限！",
          });
        }
      }
    });
  },
  //根据授权码获取userid
  requestGetUserIdHttp(usercode) {
    var that = this;
    if (usercode) {
      console.log("usercode：" + usercode)
      my.showLoading({
        content: '加载中..',
      });
      var jsonData = '{"USERCODE":"' + usercode + '"}';
      my.httpRequest({
        url: app.baseUrl,
        method: 'POST',
        data: {
          QueryType: "getUserId",
          Params:
            jsonData,
        },
        dataType: 'json',
        timeout: 3000,
        success: function (res) {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          if (res.data.DATA.CODE != "0000") {
            that.setData({
              errorResult: res.data.DATA.MSG,
            });
          }
          var userid = res.data.DATA.USERID;

          if (userid) {
            my.setStorageSync({
              key: 'setuserid',
              data: userid

            });
            let geteget = my.getStorageSync({ key: 'setuserid' });
            console.log("存上后立马取出的值：" + JSON.stringify(geteget));
            that.setData({
              authUserCode: userid,
            });
          } else {
            my.hideLoading({
              page: that,  // 防止执行时已经切换到其它页面，page指向不准确
            });
            that.setData({
              errorResult: "缺少用户id",
            });
            return;
          }
          console.log("userid" + userid);
          var code = app.qrCode;
          if (code === "") {
            code = that.data.billcode;
          }
          console.log("code" + code);
          if (code != "") {
            that.requestHttp(userid, code);
          } else {
            my.redirectTo({
              url: '../history/history?usrid=' + userid, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          }
        },
        fail: function (res) {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          if (res.error) {
            that.setData({
              errorResult: "异常错误码：" + JSON.stringify(res),//res.error
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

  //请求小票详情数据的中间层方法
  requestHttp(userid, code) {
    var that = this;
    console.log("userid" + userid)
    if (userid && code) {
      console.log("qrCode" + code)
      var jsonData = '{"QRCODE":"' + encodeURI(code) + '","USERID":"' + userid + '"}';
      my.httpRequest({
        url: app.baseUrl,
        method: 'POST',
        data: {
          QueryType: "getOrderInfo",
          Params:
            jsonData,
        },
        dataType: 'json',
        timeout: 3000,
        success: function (res) {
          my.hideLoading({
            page: that,  // 防止执行时已经切换到其它页面，page指向不准确
          });
          my.setNavigationBar({
            title: '购物小票',
          });
          if (res.data.DATA.CODE != "0000") {
            that.setData({
              errorResult: res.data.DATA.MSG,
            });
          }
          var lists = res.data.DATA.DATA;
          that.setData({
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
              errorResult: "异常错误码：" + JSON.stringify(res),//res.error
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
