Component({
  mixins: [],
  data: {},
  props: {
    item: {
      CODE:"",
      PAYAMOUNT:"",
      SHOPNAME: "zzz",
      AMOUNT: "111",
      CREATEDATE: "444",
    },
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    onItemTap(e) {

      const { onItemTap } = this.props;
      const { code } = e.target.dataset;
      // console.log(code);
      if (onItemTap) {
        onItemTap({ code });
      }
    }
  },
});
