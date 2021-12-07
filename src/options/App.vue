<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-12-07 20:11:05
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
// this指向window
export default {
  data() {
    return {};
  },
  mounted() {
    // ctrl + space 实现点击鼠标所在位置
    const body = document.querySelector('body');
    let linkObjBacket = {};
    let point = {},
      timer = null, // mutationObsever配置
      config = {
        childList: true,
        subtree: true
      };
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
    return;
    function debounce(fn, delay = 300) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, delay);
    }

    //获取页面上所有的dom节点
    function getNodeList(body, nodeList = [], index = 0) {
      const childrenList = [...body.children];
      if (childrenList.length <= 0) {
        return nodeList;
      }
      index++;
      childrenList.forEach((item) => {
        const filterNodeNameList = ['SCRIPT', 'STYLE', 'IFRAME'];
        if (filterNodeNameList.includes(item.nodeName)) return;
        const point = item.getBoundingClientRect();
        nodeList.push({
          node: item,
          point,
          index
        });
        getNodeList(item, nodeList, index);
      });
    }
    // 从子孙往上找，直到找到可以点击的dom
    function findParentClick(item) {
      console.log(item, 'findParentClicK可点击的对象');
      if ('click' in item) {
        item.click();
        return false;
      }
      const parent = item.parentNode;
      findParentClick(parent);
    }
    window.addEventListener('mousemove', function (e) {
      debounce(() => {
        point = {
          x: e.clientX,
          y: e.clientY
        };
      });
    });

    // 获取所有元素
    let nodeList = [];

    function getNodeListCallback() {
      nodeList = [];
      getNodeList(body, nodeList);
    }
    const observer = new MutationObserver(getNodeListCallback);
    observer.observe(document, config);

    window.addEventListener('keydown', function (e) {
      const code = e.keyCode;
      if (e.ctrlKey && code === 32) {
        debounce(() => {
          const chooseList = nodeList.filter((item) => inDom(item, point));
          console.log(chooseList, nodeList, '-----chooseList-----');
          const len = chooseList.length;
          if (len === 0) return;
          let index = 0;
          chooseList.forEach((item, i) => {
            if (index < item.index) {
              index = item.index;
            }
          });
          const item = chooseList.find((item) => item.index === index);
          findParentClick(item.node);
        });
      }
    });

    function inDom(node, point) {
      const nodePoint = node.point;
      if (node.node.classList.contains('account-list')) {
        console.log(node, nodePoint, point, 'node');
      }
      if (
        point.x >= nodePoint.x &&
        point.x <= nodePoint.right &&
        point.y >= nodePoint.y &&
        point.y <= nodePoint.bottom
      ) {
        return true;
      }
      return false;
    }
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
  padding: 0 200px;
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
