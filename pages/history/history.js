const app = getApp();
const historyItems = []

Page({
  data: {
   
    historyItems,
    historycounts: 0,
    errorResult: "",
  },
  onLoad(option) {
    console.log("123123|@", JSON.stringify(option));
    var usercode = option.usrid;//"2088502717233006";
    my.showLoading({
      content: '加载中...',
    });
    this.requestHttp(usercode);
  },
  onReady() {
    if (my.canIUse('hideBackHome')) {
      my.hideBackHome();
    }
  },
  onPullDownRefresh() {
    my.stopPullDownRefresh()
  },
  //每个cell的点击方法
  onItemTap(e) {
    console.log(e);
    my.navigateTo({
      url: '../detailedHistory/detailedHistory?code=' + e.code,
    });
  },

  requestHttp(userid) {
    console.log('{"userid":"' + userid + '"}');
    var that = this;
    my.httpRequest({
      url: app.baseUrl,
      method: 'POST',
      data: {
        QueryType: "getAliOrderList",
        Params:
          '{"USERID":"' + userid + '"}'
      },
      dataType: 'json',
      timeout: 3000,
      success: function (res) {
        my.hideLoading({
          page: that,  // 防止执行时已经切换到其它页面，page指向不准确
        });
        var allData = res.data.DATA;
        console.log('allData:' + JSON.stringify(allData));
        var list = allData.DATA;

        if (list.length != 0) {
          that.setData({
            historycounts: list.length,
            historyItems: list,
          });
        } else {
          that.setData({
            errorResult: "暂无历史记录",
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
        // my.alert({title: 'complete'});
      }
    });
  },
});
