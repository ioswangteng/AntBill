const app = getApp();
const historyItems = []

Page({
  data: {
    historyItems,
    historycounts: 0,
  },
  onLoad() {
    my.showLoading();
    this.getAuthCode();
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
  getAuthCode() {
    var that = this;
    my.getAuthCode({
      scopes: 'auth_user', // 主动授权：auth_user，静默授权：auth_base。或者其它scope
      success: (res) => {
        console.log("authCode：" + res.authCode);
        if (res.authCode) {
          that.requestHttp(res.authCode);
        }
      },
    });
  },
  requestHttp(authCode) {
    console.log('{"authCode":"' + authCode + '"}');
    var that = this;
    my.httpRequest({
      url: app.baseUrl + 'getAliOrderList',
      method: 'POST',
      data: {
        QueryType: "getAliOrderList",
        Params:
          '{"CODE":"' + authCode + '"}'
      },
      dataType: 'json',
      success: function (res) {
        my.hideLoading({
          page: that,  // 防止执行时已经切换到其它页面，page指向不准确
        });
        var allData = res.data.DATA;
        console.log('allData:' + JSON.stringify(allData));
        // console.log('successUSER_ID:' + allData.USER_ID);
        var list = allData.DATA;

        if (allData) {

          that.setData({
            historycounts: list.length,
            historyItems: list,
          });
        } else {
          // that.setData({
          //   historycounts: historyItems.length,
          //   historyItems: historyItems,
          // });
        }
      },
      fail: function (res) {

        console.log('fail：' + res.data);
        my.alert({ content: JSON.stringify(res) });
      },
      complete: function (res) {
        // my.alert({title: 'complete'});
      }
    });
  },


});
