<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-09-18 10:14:45
 * @LastEditors: yucheng
 * @Description: ...
-->
<template>
  <div ref="popup" class="popup">
    <h1>{{ msg }}</h1>
    <button @click="openBackground">打开popup页面</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome!--popup'
    }
  },
  methods: {
    openBackground () {
      // alert(chrome.extension.getURL('background.html'), 'extension');
      window.open(chrome.extension.getURL('options.html'))
    }
  }
}
</script>

<style lang="scss"></style>
