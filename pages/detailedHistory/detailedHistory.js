const app = getApp();

Page({
  data: {
    allData: [],
    commodityItems: [
    ],
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
    console.log("kkkkk" + options.code)
    this.requestHttp(options.code);
  },
  //头部历史记录的点击方法
  tapheader() {
    my.navigateTo({
      url: '../history/history',
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
  requestHttp(code) {
    var  code ="20181219154010479";
    if (code) {
      console.log("code" + code)
      var that = this;
      my.httpRequest({
        url: app.baseUrl+'getOrderInfo',
        method: 'POST',
        data: {
          QueryType: "getOrderInfo",
          Params:
            // '{"CODE":"20181219154010479"}'
            '{"CODE":"' + code + '"}'
        },
        dataType: 'json',
        success: function(res) {

          var lists = res.data.DATA;
          that.setData({
            allData: lists,
            commodityItems: res.data.DATA.GOODS
          });
          that.delaDiscount(res.data.DATA.OEDER);
        },
        fail: function(res) {
          my.alert({ content: JSON.stringify(res) });
        },
        complete: function(res) {
        }
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
