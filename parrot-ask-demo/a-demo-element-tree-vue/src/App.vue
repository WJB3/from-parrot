<template>
  <el-tree
    ref="tree"
    :data="data"
    :props="defaultProps"
    show-checkbox
    node-key="key"
    @check="checkTree"
  ></el-tree>
</template>

<script>
import { convertDataToEntities } from "./utils";
export default {
  data() {
    return {
      keyEntities: {},
      mutexData: [],
    };
  },
  computed: {
    data() {
      return this.$store.state.treeData;
    },
    defaultProps() {
      return this.$store.state.defaultProps;
    },
    selectData() {
      return this.$store.state.selectData;
    },
    mutexConfig() {
      return this.$store.state.mutexConfig;
    },
    initConfig() {
      return this.$store.state.initConfig;
    },
  },
  components: {},
  mounted: function () {
    let keys = Object.keys(this.mutexConfig);
    let values = Object.values(this.mutexConfig);

    let mutexData = [[keys[this.initConfig]], [values[this.initConfig]]];
    this.mutexData = mutexData;

    let { keyEntities } = convertDataToEntities(this.$store.state.treeData);
    this.keyEntities = keyEntities;
  },
  methods: {
    checkTree: function (...args) {
      const self = this;
      //当前选中的对象
      let currentCheckObj = args[0];
      let checkedKeys = args[1].checkedKeys;
      let topParent = this.getTopParent(currentCheckObj);
      let isShow = this.isShowOrHidden(args[0], args[1]);

      const isRoot = this.isRoot(currentCheckObj);

      console.log("---isRoot---", isRoot);

      let firstIndex = this.mutexData[0].indexOf(topParent);
      let secordIndex = this.mutexData[1].indexOf(topParent);

      if (isShow) {
        //显示时将互斥的数据隐藏
        if (firstIndex > -1) {
          self.mutexData[1][0].forEach((key) => {
            self.process(key, (keyA) => {
              let index = checkedKeys.indexOf(keyA);
              if (index > -1) {
                checkedKeys.splice(index, 1);
              }
            });
          });
        } else {
          self.mutexData[0].forEach((key) => {
            self.process(key, (keyA) => {
              let index = checkedKeys.indexOf(keyA);
              if (index > -1) {
                checkedKeys.splice(index, 1);
              }
            });
          });
        }
      } else {
      }

      if (!isShow) {
        //如果是隐藏则隐藏这一整个节点
        [topParent].forEach((key) => {
          self.process(key, (keyA) => {
            let index = checkedKeys.indexOf(keyA);
            if (index > -1) {
              checkedKeys.splice(index, 1);
            }
          });
        });
      }

      if (isShow) {
        //如果显示查询当前有多个子节点
        let entity = self.keyEntities[currentCheckObj.key];
        //当前兄弟个数
        let length = 0;
        if (entity && entity.parent && entity.parent.children) {
          length = entity.parent.children.length - 1;
        }

        if (!isRoot) {
          //勾选兄弟节点
          if (length > 0) {
            entity.parent.children.forEach((item) => {
            
              if (checkedKeys.indexOf(item.key) === -1) {
                checkedKeys.push(item.key);
              }
            });
          }
        }
      }

      this.$store.commit("setSelectedData", checkedKeys);
    },
    process(key, callback) {
      const self = this;
      if (self.keyEntities[key]) {
        if (callback) {
          callback(key);
        }
        self.keyEntities[key].children &&
          self.keyEntities[key].children.forEach((item) => {
            self.process(item.key, callback);
          });
      }
    },
    isRoot(currentObj) {
      return this.keyEntities[currentObj.key].parent === undefined;
    },
    isShowOrHidden(currentObj, { checkedKeys }) {
      return checkedKeys.indexOf(currentObj.key) > -1;
    },
    //获取最顶层title
    getTopParent: function (currentCheckObj) {
      let topParent = this.keyEntities[currentCheckObj.key].parent;
      let topObj = this.keyEntities[currentCheckObj.key];

      while (topParent) {
        topObj = topParent;
        topParent = topParent.parent;
      }
      return topObj.node.title;
    },
  },
  watch: {
    selectData: {
      handler(value) {
        this.$refs.tree.setCheckedKeys(value);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
