<script>
export default {
  name: "ref",
  props: {
    msg: String,
  },
  render(h) {
    return h("tag", {}, ["123"]);
  },
};
</script>
