<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2022-01-15 12:19:54
 * @LastEditors: yucheng
 * @Description: 。。。
-->
<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!---devtools'
    };
  },
  mounted() {
    console.log(this, chrome, '------------');
  }
};
</script>

<style lang="stylus"></style>
