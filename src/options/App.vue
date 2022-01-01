<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2022-01-01 17:12:44
 * @LastEditors: yucheng
 * @Description: 。。。
-->
<template>
  <div>
    <ul />
    <!-- <ol></ol> -->
  </div>
</template>

<script>
import { mouseClick } from '../common';
// this指向window
export default {
  data() {
    return {};
  },
  mounted() {
    mouseClick();
    let linkObjBacket = {};
    const ul = document.querySelector('ul');
    // const ol = document.querySelector('ol');
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      console.log(
        sender.tab
          ? 'from a content script:' + sender.tab.url
          : 'from the extension'
      );
      console.log(request.linkObj, 'request', ul);
      // ul.innerHTML = request.liListStr;
      linkObjBacket = { ...linkObjBacket, ...request.linkObj };
      let olListStr = '';
      for (const k in linkObjBacket) {
        const href = k;
        const text = linkObjBacket[k];
        olListStr += `<li title='${text}'><a href='${href}' rel="noopener noreferrer" target="_blank">${text}</a></li>`;
      }
      ul.innerHTML = olListStr;
    });
  }
};
</script>

<style lang="scss">
/* 滚动槽 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
div,
ul,
li {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
ul {
  display: flex;
  flex-wrap: wrap;
  padding: 50px 200px;
  li {
    width: 33.3%;
    padding: 5px 10px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    box-sizing: border-box;
    a {
      width: 100%;
      height: 100%;
      color: #262626;
      &:link {
        color: #262626;
      }
    }
  }
}
</style>
