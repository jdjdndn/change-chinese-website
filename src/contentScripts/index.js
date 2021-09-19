/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import './index.scss'
// 'use strict';
// const VERSION = "1.2.9";
let performance_now = performance.now()
const { location } = window
const { href, host, pathname } = location
const vueAroundList = ['router', 'vuex', 'cli']
// 开始记录时间
let start
function logInfo(msg, debug = true) {
  if (debug)
    console.log(`%c${msg}`, 'background-color: yellow; font-size: 16px;')
}
let win = ''
if (window.top) {
  win = window.top
} else {
  win = window
}

logInfo('Content script working...')

let rmad
function rmCommonAd() {
  const ad_key = [
    'ad',
    'Ad',
    'AD',
    'ads',
    'ADV',
    'ggad',
    'topad',
    'aswift',
    'abox',
    'sponsor',
    'spread',
  ]
  ad_key.forEach(key => {
    if (key === 'ad') {
      Array.from($$(`[class*=${key}]`))
        .filter(el => {
          if (typeof el.className !== 'string') return false
          if (el.className.match(/[a-z]?ad[a-z]?/)[0] !== 'ad') return false
          return true
        })
        .forEach(el => (el.style.display = 'none'))
    } else if (key === 'Ad') {
      Array.from($$(`[id*=${key}]`))
        .filter(el => {
          if (['G_IMG'].includes(el.tagName)) return false
          if (el.id.match(/Ad[a-z]?/)[0] !== 'Ad') return false
          return true
        })
        .forEach(el => (el.style.display = 'none'))
      Array.from($$(`[class*=${key}]`))
        .filter(el => {
          if (['G_IMG'].includes(el.tagName)) return false
          if (typeof el.className !== 'string') return false
          if (el.className.match(/Ad[a-z]?/)[0] !== 'Ad') return false
          return true
        })
        .forEach(el => (el.style.display = 'none'))
    } else {
      $$(`[id*=${key}]`).forEach(el => (el.style.display = 'none'))
      $$(`[class*=${key}]`).forEach(el => (el.style.display = 'none'))
    }
  })
  Array.from($$('*'))
    .filter(el =>
      Boolean(
        [...el.attributes].find(attr => {
          let m = attr.name.match(/[a-z]?ad[a-z]?/)
          if (m && m[0] === 'ad') return true
          m = attr.name.match(/[a-z]?ads[a-z]?/)
          if (m && m[0] === 'ad') return true
          return false
        })
      )
    )
    .forEach(el => (el.style.display = 'none'))
  Array.from($$(`iframe`))
    .filter(el => {
      if (typeof el.src !== 'string') return false
      let m = el.src.match(/[a-zA-Z0-9]?ad[a-zA-Z0-9]?/)
      if (m && m[0] === 'ad') return true
      m = el.src.match(/[a-zA-Z0-9]?ads[a-zA-Z0-9]?/)
      if (m && m[0] === 'ads') return true
      const keys = ['googleads']
      for (const key of keys) if (el.src.includes(key)) return true
      return false
    })
    .forEach(el => (el.style.display = 'none'))
  // inform('AD Block has removed common ads.', true)
}
rmCommonAd()

function $(domStr, dom = document) {
  return dom.querySelector(domStr)
}

function $$(domStr, dom = document) {
  return dom.querySelectorAll(domStr)
}
// 移除所有
function removeAllFunc(domList) {
  const domArr = $$(domList)
  if (domArr) {
    domArr.forEach(item => item.remove())
  }
}
// 移除单个 类名或者id 元素
function removeFunc(dom) {
  const domArr = $(dom)
  if (domArr) {
    domArr.remove()
  }
}
// 遍历数组移除单个 类名或者id 元素
function removeArrList(classList, badge) {
  classList.forEach(item => {
    const itemStr = badge + item
    const dom = $(itemStr)
    if (dom) {
      dom.remove()
    }
  })
}
// 设置样式
function setStyle(str, css) {
  const strObj = document.querySelector(str)
  if (strObj) {
    strObj.style.cssText = css
  }
}
// 节流
function throttle(fun, delay) {
  let last
  let deferTimer
  return function(...args) {
    const that = this
    const now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function() {
        last = now
        fun.apply(that, args)
      }, delay)
    } else {
      last = now
      fun.apply(that, args)
    }
  }
}

// 跳转方法
function gotoLink(href) {
  // 判断是否为网址，是网址可以直接跳转
  const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
  const hrefStr = decodeURIComponent(href)
  if (hrefStr && reg.test(hrefStr)) {
    const a = document.createElement('a')
    a.target = '_blank'
    a.rel = 'noopener noreferrer nofollow'
    a.href = hrefStr
    a.click()
    a.remove()
  }
}

const params = { href, win, pathname }
const list = {
  'www.baidu.com': {
    callback: baidu,
  },
  'wenku.baidu.com': {
    callback: wenku,
  },
  'www.jb51.net': {
    callback: jiaobenzhijia,
  },
  'jingyan.baidu.com': {
    callback: baidujingyan,
  },
  bilibili: {
    callback: bilibili,
  },
  it1352: {
    callback: it1352,
  },
  '.alexa.cn': {
    callback: alexacn,
  },
  'www.imomoe.la': {
    callback: yinghuadongman,
  },
  'www.xbiquge.la': {
    callback: biquge,
  },
  '4hu.tv': {
    callback: hu4tv,
  },
  'csdn.net': {
    callback: csdn,
  },
  youtube: {
    callback: youtube,
  },
  'developer.mozilla.org': {
    callback: mdn,
  },
  github: {
    callback: github,
  },
  zhihu: {
    callback: zhihu,
  },
  juejin: {
    callback: juejin,
  },
  'lodash.com': {
    callback: lodash,
  },
  'webpack.js.org': {
    callback: webpack,
  },
  'vuejs.org': {
    callback: vue,
    moreCase: () =>
      !href.includes('cn.') && !vueAroundList.some(it => href.includes(it)),
  },
  'vitejs.dev': {
    callback: vite,
    moreCase: () =>
      !href.includes('cn.') && !vueAroundList.some(it => href.includes(it)),
  },
}

for (const k in list) {
  if (
    (href.includes(k) && list[k].moreCase && list[k].moreCase()) ||
    (href.includes(k) && !list[k].moreCase)
  ) {
    requestAnimationFrame(params => {
      list[k].callback(params)
    })
    break
  }
}

// 百度
function baidu({ href, win }) {
  let results = [...$$('[id]')].filter(el => el.id.match(/^\d+$/))
  results.filter(el => $('[data-tuiguang]', el)).forEach(el => el.remove())
  results = results
    .filter(el => document.contains(el))
    .filter(el => $('[class*=tuiguang]', el))
    .forEach(el => el.remove())
  const content_right = document.getElementById('content_right')
  if (content_right)
    Array.from(content_right.children)
      .filter(el => el.tagName !== 'TABLE')
      .forEach(el => el.remove())
}
// 百度文库
function wenku({ href, win }) {
  if ($('.read-all')) {
    $('.read-all').click()
    removeAllFunc('[class*=hx]')
    removeAllFunc('[class*=vip]')
  }
  removeFunc('.fwk_gH')
  removeFunc('.fengchaoad')
}
// 脚本之家
function jiaobenzhijia({ href, win }) {
  removeAllFunc('[class*=logo]')
  removeAllFunc('[class*=blank]')
  removeAllFunc('[class*=dxy]')
  removeAllFunc('[class*=lbd]')
  removeFunc('#aswift_1')
  $$('#article>.clearfix')[0]
  removeFunc('#article>.clearfix>div')
  removeAllFunc('#txtlink, .mainlr, .main-right, .topimg')
}
// 百度经验
function baidujingyan({ href, win }) {
  removeAllFunc(
    '#aside, #wgt-like, #fresh-share-exp-e, #wgt-exp-share, .task-panel-entrance'
  )
}
// 哔哩哔哩
function bilibili({ href, win }) {
  removeAllFunc('.banner-card')
  removeAllFunc('[id*=Ad], [class*=activity]')
  removeAllFunc(
    '[id*=ad-], [id*=ad-], [class*=-ad], [class*=ad-], [id*=Ad], [id*=recommand]'
  )
}
// it屋
function it1352({ href, win }) {
  removeAllFunc('.row.hidden-sm')
}
// 未知
function alexacn({ href, win }) {
  removeAllFunc('[class*=important]')
}
// 樱花动漫
function yinghuadongman({ href, win }) {
  removeAllFunc('[id*=HM], #fix_bottom_dom')
  removeArrList(['HMRichBox', 'fix_bottom_dom'], '#')
}
// 笔趣阁
function biquge({ href, win }) {
  removeAllFunc('[id*=cs_]')
  removeAllFunc('.dahengfu')
  removeAllFunc('.box_con>table')
  removeAllFunc('.box_con>p')
  removeAllFunc('#content>p:last-child')
}
// 4hu
function hu4tv({ href, win }) {}
// csdn
function csdn({ href, win }) {}
// youtube
function youtube({ href, win }) {
  const searchAdList = $$(
    '#primary>.ytd-two-column-search-results-renderer>#contents>ytd-item-section-renderer.ytd-section-list-renderer'
  )
  if (searchAdList) {
    searchAdList.forEach((item, i) => {
      if (i > 2) return
      item.remove()
    })
  }
  removeAllFunc('[class*=ytp-ad-]')
}
function mdn({ href, win }) {
  const window = win
  const us = 'en-US'
  const zh = 'zh-CN'
  const mdn = `${location.protocol}//${location.host}/`
  // 上一次的 lastUrlStr
  let perUrlStr = ''
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
  const urlStr = href.split(mdn)[1]
  const index = urlStr.indexOf('/')
  // const needReplaceStr = urlStr.slice(0, index)
  const lastUrlStr = urlStr.slice(index)
  const noChinese = document.querySelector('.page-content-container>h1')
  if (noChinese && noChinese.innerText.includes('Page not found')) {
    if (href.includes(us)) {
      window.history.back()
      return
    }
    if (perUrlStr === lastUrlStr) {
      return
    }
    location.href = mdn + us + lastUrlStr
  } else {
    const noChangeLanguageBtn = document.querySelector('.show-desktop')
    const selectDom = document.getElementById('language-selector')
    if (selectDom) {
      const options = selectDom.querySelectorAll('option')
      const flag = Array.from(options).some(item => item.value === zh)
      if (!flag) return
    }
    if (!noChangeLanguageBtn || !noChangeLanguageBtn.innerText) {
      return
    }
    if (href.includes(zh)) return
    perUrlStr = lastUrlStr
    location.href = mdn + zh + lastUrlStr
  }
}
function zhihu({ href, win }) {
  const adClassList = [
    'Post-SideActions',
    'Card.TopstoryItem.TopstoryItem--old.TopstoryItem--advertCard.TopstoryItem-isRecommend',
    'Pc-card.Card>a',
    'Sticky>a',
  ]
  removeArrList(adClassList, '.')
  const throlleRemove = throttle(removeArrList, 300)
  win.addEventListener('scroll', function scroll() {
    throlleRemove(adClassList, '.')
  })
}
function juejin({ href, win }) {}
function lodash({ href, win }) {
  const s = href.replace('lodash.com', 'www.lodashjs.com')
  location.href = s
}
function webpack({ href, win }) {
  const zhName = 'docschina'
  // https://webpack.docschina.org/
  const str = new URL(href)
  location.href = 'https://webpack.' + zhName + '.org' + str.pathname
}
function vue({ href, win }) {
  location.href = location.protocol + '//cn.' + location.host
}
function vite({ href, win }) {
  location.href = 'https://cn.vitejs.dev' + location.pathname
}
function github({ href, win }) {}

// 所有跳转方法
function tiaozhuan() {
  // zhihu
  window.addEventListener('click', function(e) {
    // e.preventDefault()
    let href = ''
    if (e.target.href) {
      href = e.target.href.split('target=')[1]
    } else if (e.target.parentNode.href) {
      href = e.target.parentNode.href.split('target=')[1]
    }
    if (href) {
      gotoLink(href)
    }
  })
  // juejin
  window.addEventListener('click', function(e) {
    // e.preventDefault()
    if (e.target.href) {
      let href = e.target.href.split('target=')[1]
      gotoLink(href)
    }
  })
}

requestAnimationFrame(() => {
  const vueFlag = vueAroundList.some(it => href.includes(it))
  if (vueFlag && !href.includes('/zh/')) {
    let s = location.origin + '/zh/' + location.pathname
    location.href = s
  }
})

// if (location.host === 'tieba.baidu.com') {
//   const content = $('#container>.content')
//   if (content) {
//     rmad = () =>
//       $$('#j_p_postlist>.j_l_post[ad-dom-img]').forEach(el => el.remove())
//     content.addEventListener('DOMSubtreeModified', rmad)
//     rmad()
//   }
//   const pgpt = document.getElementById('pagelet_frs-list/pagelet/thread')
//   if (pgpt) {
//     rmad = () => {
//       $$('.fengchao-wrap-feed').forEach(el => el.remove())
//       Array.from(thread_list.children)
//         .filter(
//           el =>
//             el.tagName === 'LI' &&
//             typeof el.className === 'string' &&
//             el.className.indexOf('j_thread_list') < 0
//         )
//         .forEach(el => el.remove())
//     }
//     pgpt.addEventListener('DOMSubtreeModified', () => {
//       const thread_list = $('#thread_list')
//       if (thread_list) {
//         thread_list.addEventListener('DOMSubtreeModified', rmad)
//         rmad()
//       }
//     })
//     rmad()
//   }
// } else if (location.host === 'paste.ubuntu.com') {
//   if (document.getElementById('id_syntax')) {
//     const select_el = document.getElementById('id_syntax')
//     const main_values = [
//       'c',
//       'cpp',
//       'csharp',
//       'css',
//       'delphi',
//       'fortran',
//       'go',
//       'groovy',
//       'html',
//       'java',
//       'js',
//       'json',
//       'kotlin',
//       'matlab',
//       'objective-c',
//       'objective-c++',
//       'php',
//       'python',
//       'rb',
//       'sql',
//       'swift',
//       'text',
//       'vb.net',
//     ]
//     const less_options = [...select_el.children].filter(
//       option => !main_values.includes(option.value)
//     )
//     less_options.forEach(e => (e.style.display = 'none'))
//     const insert_p = document.createElement('p')
//     insert_p.style =
//       'display: flex; align-items: center; margin-left: 10px; min-width: max-content;'
//     const checkbox = document.createElement('input')
//     checkbox.name = 'concise'
//     checkbox.type = 'checkbox'
//     checkbox.checked = true
//     const label = document.createElement('label')
//     label.setAttribute('for', 'concise')
//     label.innerText = 'show only mainstream programming languages'
//     label.addEventListener('click', () => {
//       console.warn('called')
//       checkbox.checked = !checkbox.checked
//       less_options.forEach(
//         e => (e.style.display = checkbox.checked ? 'none' : '')
//       )
//     })
//     insert_p.appendChild(checkbox)
//     insert_p.appendChild(label)
//     const table_el = $('#pasteform :first-child')
//     table_el.parentElement.insertBefore(insert_p, table_el)
//   }
// }
// 去除copy之后的尾巴
document.addEventListener('copy', function(e) {
  e.preventDefault()
  const selection = window.getSelection().toString()
  e.clipboardData.setData('text/plain', selection)
})

// let video = null
// function videoPlay(timestamp) {
//   if (start === undefined) start = timestamp
//   const elapsed = timestamp - start
//   // 视频加速
//   video =
//     $('bwp-video') ||
//     $('.dplayer-video.dplayer-video-current') ||
//     $('.video-stream.html5-main-video')
//   if (video) {
//     if (video.paused) {
//       video.play()
//     }
//     // 音频设置播放速率，如正常速度播放
//     video.playbackRate = 1.5
//     return
//   }
//   if (elapsed < 2000) {
//     // 在两秒后停止动画
//     win.requestAnimationFrame(videoPlay)
//   }
// }
// win.requestAnimationFrame(videoPlay)

// 谷歌翻译
// 不翻译的列表
const noFanYiList = ['bilibili', 'juejin', 'zhihu', 'csdn']
const fanyiFlag = noFanYiList.every(item => !href.includes(item))
function addNewElement(innerhtml, node, src) {
  const element = document.createElement(node)
  if (src) {
    element.src = innerhtml
  } else {
    element.innerHTML = innerhtml
  }
  document.getElementsByTagName('head')[0].appendChild(element)
}
if (fanyiFlag) {
  // 隐藏顶部栏
  const { head } = document
  const style = document.createElement('style')
  const text = [
    // 翻译按钮样式设置
    '#google_translate_element {',
    '  position: fixed;',
    '  width: 80px;', // 按钮宽度(仅PC端生效)
    '  left: 0px;', // 左侧边距离设置；如果要靠右设置，left改成right即可
    '  bottom: 25px;', // 距离底部高度
    '  height: 22px;', // 按钮高度
    '  border: 2px solid #0000;', // 边框线设置
    '  border-radius: 5px;', // 边界半径设置
    '  z-index: 10000000;',
    '  overflow: hidden;',
    '  box-shadow: 1px 1px 3px 0 #0000;', // 外边框阴影设置
    '  opacity: 0.4;', // 初始透明度设置
    '  transform: translateX(-75%);', // 按钮隐藏百分比设置(仅PC端生效)
    '  transition: all 0.3s;',
    '}',
    '#google_translate_element:hover {',
    '  opacity: 1;', // 透明度设置
    '  transform: translateX(0);',
    '}',
    '#google_translate_element .goog-te-gadget-simple {',
    '  width: 100%;',
    '}',
    '.goog-te-banner-frame.skiptranslate {',
    '  display: none',
    '}',
    'html,body{',
    '  top: 0!important',
    '}',
    // 原文按钮样式设置
    '.recoverPage {',
    '  width: 45px;', // 按钮宽度(仅PC端生效)
    '  background-color: #F0F8FF;', // 背景色设置
    '  position: fixed;',
    '  left: -5px;', // 左侧边距离设置；如果要靠右设置，left改成right即可
    '  z-index: 10000000;',
    '  bottom: 50px;', // 距离底部高度
    '  user-select: none;',
    '  text-align: center;',
    '  border: 1px solid #a8a8a8;', // 边框线设置
    '  font-size: small;',
    '  line-height: 25px;', // 按钮高度设置(仅PC端生效)
    '  border-radius: 15px;', // 边界半径设置
    '  box-shadow: 1px 1px 3px 0 #C0C0C0;', // 外边框阴影设置
    '  opacity: 0.4;', // 初始透明度设置
    '  transform: translateX(-70%);', // 按钮隐藏百分比设置(仅PC端生效)
    '  transition: all 0.3s;',
    '  }',
    '.recoverPage:hover {',
    '  opacity: 1;', // 透明度设置
    '  transform: translateX(0);',
    '  }',
    '.recoverPage:active {',
    '  box-shadow: 1px 1px 3px 0 #888 inset;',
    '  }',

    /* ----移动端UI适配设置（PC端不生效）-----------------------------------------*/
    ' @media handheld, only screen and (max-width: 768px) {',
    // 翻译按钮样式设置
    ' #google_translate_element {',
    '  width: 104px;', // 按钮宽度
    '  }',
    '  #google_translate_element .goog-te-combo {',
    '  margin: 0;',
    '  padding-top: 2px;',
    '  border: none;',
    '  }',
    // 原文按钮样式设置
    ' .recoverPage {',
    '  width: 34px;', // 按钮宽度
    '  line-height: 24px;', // 按钮高度设置
    '  transform: translateX(-40%);', // 按钮隐藏百分比设置
    '  transform: translateX(1);', // 隐藏功能开关，0为关闭；1为打开
    '  }',
    '  }',
  ].join('\n')
  const style_text = document.createTextNode(text)
  style.appendChild(style_text)
  head.appendChild(style)

  // 恢复原网页按钮设置
  const initScript = document.createElement('script')
  const initText = document.createTextNode(
    [
      // 清除图片的请求，加快访问速度
      "  img = [].slice.call(document.querySelectorAll('#goog-gt-tt img,#google_translate_element img'));",
      '  img.forEach(function(v, i){',
      "   v.src = '';",
      '  });',

      "  const recoverPage = document.createElement('div')",
      "  recoverPage.setAttribute('class', 'notranslate recoverPage')",
      "  recoverPage.innerText = '原文'",
      '  document.body.appendChild(recoverPage)',
      '  recoverPage.onclick = (() => {',
      "  const phoneRecoverIframe = document.getElementById(':1.container')",
      "  const PCRecoverIframe = document.getElementById(':2.container')",
      '    if (phoneRecoverIframe) {',
      '      const recoverDocument = phoneRecoverIframe.contentWindow.document',
      "      recoverDocument.getElementById(':1.restore').click()",
      ' } else if (PCRecoverIframe) {',
      '      const recoverDocument = PCRecoverIframe.contentWindow.document',
      "      recoverDocument.getElementById(':2.restore').click()",
      '    }',
      '  })',
    ].join('\n')
  )
  initScript.appendChild(initText)
  head.appendChild(initScript)

  // 翻译按钮设置
  const google_translate_element = document.createElement('div')
  google_translate_element.id = 'google_translate_element'
  document.documentElement.appendChild(google_translate_element)

  const gtehtml =
    'function googleTranslateElementInit() {' +
    'new google.translate.TranslateElement({' +
    'autoDisplay: true,' +
    'layout: google.translate.TranslateElement.InlineLayout.SIMPLE,' +
    'multilanguagePage: true,' +
    "pageLanguage: 'auto'," +
    "includedLanguages: 'zh-CN,zh-TW,en,ja,ru'" +
    "}, 'google_translate_element');}"

  addNewElement(gtehtml, 'script', false)
  addNewElement(
    'https://cdn.jsdelivr.net/gh/zs6/gugefanyijs@1.9/element.js',
    'script',
    true
  )

  //   google翻译的网址  //translate.google.com/translate_a/element.js?cb=googleTranslateElementInit
  addNewElement(
    'https://cdn.jsdelivr.net/gh/zs6/gugefanyijs@1.9/element.js',
    'script',
    true
  )

  // 翻译按钮
  ;(function ziDongFanYi() {
    const d = $('#google_translate_element')
    if (d) {
      // 选择语言的弹出盒子
      const iframe = $('.goog-te-menu-frame.skiptranslate')
      if (!iframe) return
      if (d.innerText.includes('中文')) return
      const zhBtn = iframe.contentWindow.document
        .getElementById(':1.menuBody')
        .querySelectorAll('a')
      Array.from(zhBtn).forEach(item => {
        if (item.innerHTML.includes('简体')) {
          item.click()
        }
      })
    }
  })()
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message, sender, sendResponse, 'message,sender,sendResponse')
  sendResponse({ text: message + ' world' })
})

setTimeout(function() {
  let performance_end = performance.now()
  const time = performance_end - performance_now
  logInfo('加载时间' + '===>' + time)
}, 0)
