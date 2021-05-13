<template>
  <!-- 渲染出口 -->
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
//设置全局css
  body{
    font-family: "微软雅黑";
    font-size:16px;
  }
</style>
<script>
export default {
  name: 'App'
}
</script>
