/*
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2022-01-01 12:10:26
 * @LastEditors: yucheng
 * @Description: ...
 */
// popup通信
// const popup = chrome.extension.getViews({ type: "popup" })[0]
// popup.GetMessageFromBackground("给我的兄弟popup点东西~")
// ​
// function GetMessageFromPopup(data){
//     console.log("popup给我的东西~",data)
// }

// 拦截请求
// 其类型是 chrome.webRequest.WebRequestDetails
// return { redirectUrl: newurl}，转发请求
// return { cancel: true }，abort 请求

// https://wenku.baidu.com/xpage/form/getform?id=wenku_search_mode_2019
const blockUrlList = {
  juejin: {
    adList: ['query_adverts'],
    num: 0,
  },
  'wenku.baidu': {
    adList: ['xpage/form/getform', 'wk_vip_suggesstion', 'ext_platform=pc'],
    num: 0,
  },
}
// 查找过滤参数的数组
let sliceArr = []
// 过滤参数的索引
let kIndex, linkObj = {}

function handlerRequest(details) {
  // console.log(details, 'details')
  // 如果找到了一个要拦截的参数，记录位置，下次从找到的位置接着找
  for (const k in blockUrlList) {
    kIndex = k
    if (details.initiator && details.initiator.includes(k)) {
      const len = blockUrlList[k].adList
      let num = blockUrlList[k].num
      if (num >= len - 1) {
        // 结束
        sliceArr = blockUrlList[k].adList
        kIndex = 0
        return (blockUrlList[k].num = 0)
      }
      sliceArr = blockUrlList[k].adList.slice(num)
      const index = sliceArr.findIndex(it => details.url.includes(it))
      // console.log(sliceArr, index, 'index')
      if (index !== -1) {
        num = index
        return {
          cancel: true
        }
      } else {
        // 结束或者没找到的时候重置索引
        sliceArr = blockUrlList[k].adList
        kIndex = 0
        blockUrlList[k].num = 0
      }
    }
  }
  // 注意 proxy 和 block 需要你自己定义
  /**
   * 代理转发
   */
  // if (proxy) {
  //   return {
  //     redirectUrl: details.url.replace(proxy.origin, proxy.target),
  //   }
  // }
  /**
   * 请求拦截
   * */
  // if (block) {
  // return { cancel: true }
  // }
}

chrome.webRequest.onBeforeRequest.addListener(
  handlerRequest, {
    urls: ['<all_urls>'],
  },
  // 定义获取哪些权限
  ['blocking', 'requestBody', 'extraHeaders']
)
// 拦截请求

chrome.contextMenus.create({
  title: '使用谷歌搜索：%s', // %s表示选中的文字
  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
  onclick: function (params) {
    console.log(params, 'params')
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({
      url: 'https://www.google.com/search?q=' + encodeURI(params.selectionText),
    })
  },
})

console.log(chrome, 'chrome')

// 旧链接拿到新链接，没有返回 ''
function hrefChange(href) {
  let newHref = ''
  if (otherSiteHref(href)) {
    newHref = href.slice(href.lastIndexOf('http'))
  }
  return decodeURIComponent(newHref)
}

// 判断网址是否需要跳转
function otherSiteHref(href) {
  return href.indexOf('http') !== href.lastIndexOf('http')
}

chrome.runtime.onMessage.addListener(function notify(
  message,
  sender,
  sendResponse
) {
  linkObj = {
    ...linkObj,
    ...message.linkObj
  }
  // 这种只分类一次
  const newLinkObj = {}
  for (const k in linkObj) {
    if (!k) continue
    const {
      origin
    } = new URL(k)
    if (newLinkObj[origin]) {
      newLinkObj[origin][k] = linkObj[k]
    } else {
      newLinkObj[origin] = {}
    }
  }
  console.log(newLinkObj, linkObj);
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    const tabId = tabs.length ? tabs[0].id : null
    const message = {
      name: 'chengyu'
    }
    chrome.tabs.sendMessage(tabId, message, function (response) {
      console.log(response, 'background')
      return true
    })
  })
})
