/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import './index.scss'
// 'use strict';
// const VERSION = "1.2.9";
let performance_now = performance.now()
const {
  location
} = window
const {
  href,
  host,
  pathname,
  origin,
  search
} = location
const {
  log,
  error,
  dir
} = console
const vueAroundList = ['router.vuejs.org', 'vuex.vuejs.org', 'cli.vuejs.org']
let timer = null,
  tiaozhuanFlag = true // 跳转变量

function logInfo(msg) {
  log(`%c${msg}`, 'background-color: yellow; font-size: 16px;')
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
  const iframes = Array.from($$(`iframe`)).filter(el => {
    if (typeof el.src !== 'string') return false
    let m = el.src.match(/[a-zA-Z0-9]?ad[a-zA-Z0-9]?/)
    if (m && m[0] === 'ad') return true
    m = el.src.match(/[a-zA-Z0-9]?ads[a-zA-Z0-9]?/)
    if (m && m[0] === 'ads') return true
    const keys = ['googleads']
    for (const key of keys)
      if (el.src.includes(key)) return true
    return false
  })
  iframes.forEach(el => (el.style.display = 'none'))
}
rmCommonAd()

function noop() {}

function debounce(fn, delay = 300) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(fn, delay);
}

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
// 遍历数组隐藏单个 类名或者id 元素
function hideArrList(classList, badge) {
  classList.forEach(item => {
    const itemStr = badge + item
    const dom = $(itemStr)
    if (dom) {
      dom.style.display = 'none'
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
  return function (...args) {
    const that = this
    const now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, args)
      }, delay)
    } else {
      last = now
      fun.apply(that, args)
    }
  }
}

// 视频播放
function videoPlay() {
  logInfo('视频加速')
  const video = $('video')
  if (video) {
    if (video.paused) {
      video.play()
    }
    video.playbackRate = 1.5
  }
}

// 点击事件
function proClick(str, options = {}, search = 'aira-label') {
  let dom = null
  const all = options.all || false
  const i = options.i || 0
  switch (search) {
    case 'aira-label':
      dom = all ? $$(`[aria-label=${str}]`)[i] : $(`[aria-label=${str}]`)
      break
    case 'class':
      dom = all ? $$(`.${str}`)[i] : $(`.${str}`)
      break
    case 'id':
      dom = all ? $$(`.${str}`)[i] : $(`#${str}`)
      break
    default:
      dom = all ? $$(`[aria-label=${str}]`)[i] : $(`[aria-label=${str}]`)
  }
  if (dom) {
    dom.click()
  }
}

// 移除包含指定元素的元素
function rmSomeSelf(father, child, lsit = [], flag = true) {
  const parents = document.querySelectorAll(father)
  const parentList = Array.from(parents)
  parentList.forEach(parent => {
    // flag 为 true 排序字段，为false包含字段
    if (flag) {
      lsit.push('广告')
      lsit.forEach(exclude => {
        const str = exclude.toLowerCase()
        if (parent.querySelector(child) && parent.querySelector(child).innerText.includes(str)) {
          parent.remove()
        }
      })
    } else {
      lsit.forEach(includes => {
        const str = includes.toLowerCase()
        console.log(parent.querySelector(child), '-------------------');
        if (parent.querySelector(child) && !parent.querySelector(child).innerText.includes(str)) {
          parent.remove()
        }
      })
    }
  })
}

// 将一个dom元素下的一个a标签放进一行li中
function addLinkListBox(linkList = [], boxName = '', customlinkStr) {
  let liListStr = ''
  const box = document.querySelector('.' + boxName)
  if (customlinkStr) {
    liListStr = customlinkStr
  } else {
    linkList.forEach(item => {
      liListStr += `<li title='${item.innerText}'><a href='${item.toString()}' rel="noopener noreferrer" target="_blank">${item.innerText}</a></li>\n`
    })
  }
  if (!liListStr) return
  const htmlStr = '<ul>' +
    liListStr +
    '</ul>'
  if (box) {
    box.innerHTML = htmlStr
  } else {
    const root = document.querySelector('body')
    const box = document.createElement('div')
    box.className = boxName
    box.innerHTML = htmlStr
    root.insertBefore(box, root.children[0])
  }
}
// 将一个dom元素下的一个a标签放进一行li中或者多个a放进一个li
// linkList为页面上a元素的父亲的集合
function addLinkListBoxPro(linkList = [], boxName = 'toolbox', oneLine = true) {
  let aLinkStr = '',
    linkListStr = ''
  linkList.forEach(item => {
    const itemList = Array.from(item.querySelectorAll('a'))
    if (itemList.length <= 0) return
    if (oneLine) {
      // 一个li标签多个a
      itemList.forEach(it => {
        aLinkStr += `<a title='${it.innerText}' href='${it.toString()}' rel="noopener noreferrer" target="_blank">${it.innerText}</a>`
      })
      linkListStr += `<li>${aLinkStr}</li>\n`
    } else {
      // 一个li标签里面一个a标签
      itemList.forEach(it => {
        aLinkStr += `<li title='${it.innerText}'><a href='${it.toString()}' rel="noopener noreferrer" target="_blank">${it.innerText}</a></li>\n`
      })
      linkListStr += aLinkStr
    }
    aLinkStr = ''
  })
  addLinkListBox([], boxName, linkListStr)
}

// 跳转方法
function gotoLink(href) {
  // 判断是否为网址，是网址可以直接跳转
  const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
  if (href && reg.test(href)) {
    const a = document.createElement('a')
    a.target = '_blank'
    a.rel = 'noopener noreferrer nofollow'
    a.href = href
    a.click()
    a.remove()
    tiaozhuanFlag = false
  }
}
const params = {
  href,
  win,
  pathname,
  origin,
  search,
  host
}

// dom数组
function getDomList(str, filterClassList) {
  let arr = []
  const list = document.querySelectorAll(str)
  arr = Array.from(list)
  if (!filterClassList) {
    return arr
  }
  arr = arr.map(it => it.cloneNode(true))
  if (Array.isArray(filterClassList)) {
    filterClassList.forEach(it => {
      arr.forEach(item => {
        const filterIt = Array.from(item.querySelectorAll(it))
        filterIt.forEach(t => t.remove())
      })
    })
  } else if (typeof filterClassList === 'string') {
    arr.forEach(item => {
      const filterIt = Array.from(item.querySelectorAll(filterClassList))
      filterIt.forEach(t => t.remove())
    })
  }
  arr.forEach(it => console.log(it))
  return arr
}

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
  'www.bilibili.com': {
    callback: bilibili,
    scroll: true
  },
  'www.it1352.cn': {
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
  'www.4hu.tv': {
    callback: hu4tv,
  },
  'www.csdn.net': {
    callback: csdn,
  },
  'www.youtube.com': {
    callback: youtube,
    scroll: true
  },
  'developer.mozilla.org': {
    callback: mdn,
  },
  'github.com': {
    callback: github,
    scroll: true
  },
  'www.zhihu.com': {
    callback: zhihu,
    scroll: true
  },
  'juejin.cn': {
    callback: juejin,
    scroll: true
  },
  'www.lodash.com': {
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
  'cn.pornhub.com': {
    callback: pornhub,
    scroll: true
  },
  'www.yyyweb.com': {
    callback: yyyweb,
  },
  'yt5.tv': {
    callback: yt5,
  },
  '360yy.cn': {
    callback: videoPlay,
  },
  'www.douyin.com': {
    callback: videoPlay,
  },
  'www.tiktok.com': {
    callback: videoPlay
  },
  'www.qidian.com': {
    callback: qidian,
    scroll: true
  },
  'read.qidian.com': {
    callback: qidian,
  },
  'www.douyu.com': {
    callback: douyu,
  },
  'reactjs.org': {
    callback: react
  },
  'www.jianshu.com': {
    callback: jianshu,
    scroll: true
  },
  'segmentfault.com': {
    callback: sifou,
    scroll: true
  },
  'www.google.com': {
    callback: google,
    scroll: true
  },
  'www.cnblogs.com': {
    callback: bokeyuan,
    scroll: true
  },
  'momoyu.cc': {
    callback: momoyu,
    scroll: true,
    // 滚动事件绑定者
    el: '#app'
  },
  'www.xiaodao0.com': {
    callback: xiaodao,
    scroll: true
  },
  'www.zhangxinxu.com': {
    callback: zhangxinxu,
    scroll: true
  },
  'so.toutiao.com': {
    callback: toutiao,
    scroll: true
  },
  'sso.iflytek.com:8443': {
    callback: iflytek,
    scroll: true
  }
}

clearInterval(timer)
for (const k in list) {
  // console.log(origin, k, origin.includes(k), "看看走的是哪一个");

  if (
    (host === k && list[k].moreCase && list[k].moreCase()) ||
    (host === k && !list[k].moreCase)
  ) {
    if (list[k].scroll) {
      const el = list[k].el ? document.querySelector(list[k].el) : window
      el.onscroll = function (e) {
        console.log('回调执行-scroll')
        list[k].callback(params)
      }
      setTimeout(() => {
        list[k].callback(params)
      }, 1000)
    } else {
      const config = {
        childList: true,
        subtree: true
      }
      const callback = function (mutationsList, observer) {
        console.log('回调执行-observer')
        list[k].callback(params)
      }
      const observer = new MutationObserver(callback)
      observer.observe(document, config)
    }
    break
  }
}

// iflytek自动登录
function iflytek() {
  const loginBtn = document.querySelector('.user-btn')
  loginBtn && loginBtn.click()
}
// react官网
function react({
  host,
  pathname
}) {
  location.href = 'https://zh-hans.reactjs.org' + pathname
}

// 今日头条
function toutiao() {
  const linkList = [...getDomList('.s-result-list .cs-view-block .text-darker a'), ...getDomList('.sldebar_out .silebar_inner li a')]
  addLinkListBox(linkList, 'toutiao-toolbox')
}

// 张鑫旭官网
function zhangxinxu() {
  const linkList = [...getDomList('#content .status-publish h2 a'), ...getDomList('.sldebar_out .silebar_inner li a')]
  addLinkListBox(linkList, 'zhangxinxu-toolbox')
}

// 斗鱼
function douyu() {
  const adClassList = [
    'XinghaiAd',
    'SvgaPlayerDom',
    'Bottom-ad',
    'layout-Player-title',
    'layout-Player-toolbar',
    'react-draggable',
  ]
  removeArrList(adClassList, '.')
  proClick('wfs-2a8e83', {}, 'class')
}

// 起点
function qidian() {
  const adIdList = [
    'topGameOp',
    'tr-banner',
    'banner-two',
    'banner3',
    'j-topHeadBox',
    'j_bodyRecWrap',
    'page-ops',
    'banner1',
    'j_guideBtn',
  ]
  const adClassList = [
    'game-link',
    'focus-img.cf',
    'top-bg-box',
    'topics-list.mb40.cf',
    'games-op-wrap',
    'right-op-wrap.mb10',
    'crumbs-nav.center990.top-op',
    'fans-zone',
  ]
  removeArrList(adIdList, '#')
  removeArrList(adClassList, '.')
  // window.addEventListener('keyup', function (e) {
  //   if (e.keyCode === 13) {
  //     proClick('j_chapterNext', {}, 'id')
  //   }
  // })
  const linkList = [...getDomList('.wrap .cf .fl li'), ...getDomList('.wrap .box-center .fl li'), ...getDomList('.wrap .box-center .rank-list .name-box')]
  addLinkListBoxPro(linkList, 'qidian-toolbox')
}

// 樱桃
function yt5() {
  const adClassList = [
    'v-footer',
    'notice-container',
    'page-promotion.noticeShow',
    'page-promotion',
    'download-tip',
    'detail-share',
  ]
  removeArrList(adClassList, '.')
  videoPlay()
}
// 前端里
function yyyweb() {
  const adClassList = ['google-auto-placed']
  removeArrList(adClassList, '.')
  removeAllFunc('[class*=adsbygoogle]')
}

function yyywebClick() {
  const adIdList = ['ad_position_box']
  removeArrList(adIdList, '#')
}

// 百度
function baidu() {
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
function wenku() {
  if ($('.read-all')) {
    $('.read-all').click()
    removeAllFunc('[class*=hx]')
    removeAllFunc('[class*=vip]')
  }
  removeFunc('.fwk_gH')
  removeFunc('.fengchaoad')
}
// 脚本之家
function jiaobenzhijia() {
  removeAllFunc('[class*=logo]')
  removeAllFunc('[class*=blank]')
  removeAllFunc('[class*=dxy]')
  removeAllFunc('[class*=lbd]')
  removeAllFunc('[class*=google-]')
  removeFunc('#aswift_1')
  $$('#article>.clearfix')[0]
  removeFunc('#article>.clearfix>div')
  removeAllFunc('#txtlink, .mainlr, .main-right, .topimg')
}
// 百度经验
function baidujingyan() {
  removeAllFunc(
    '#aside, #wgt-like, #fresh-share-exp-e, #wgt-exp-share, .task-panel-entrance'
  )
}
// 哔哩哔哩
function bilibili() {
  // removeAllFunc("[id*=Ad], [class*=activity]");
  // removeAllFunc(
  //   "[id*=ad-], [id*=ad-], [class*=-ad], [class*=ad-], [id*=Ad], [id*=recommand]"
  // );
  removeFunc('.extension')
  removeFunc('#bili_live>a')
  removeAllFunc('.banner-card.b-wrap')
  if ($$('.bilibili-player-video-btn-speed-name').innerHTML === '1.5x') return
  proClick('倍速')
  proClick(
    'bilibili-player-video-btn-speed-menu-list', {
      all: true,
      i: 1
    },
    'class'
  )
  const linkList = [...getDomList('#app .video-card-reco .info-box'), ...getDomList('.b-wrap .zone-list-box'), ...getDomList('#reco_list .video-page-card .info', '.count')]
  console.log(linkList, '-------------');
  addLinkListBoxPro(linkList, 'bilibili-toolbox', false)
}
// it屋
function it1352() {
  removeAllFunc('.row.hidden-sm')
}
// 未知
function alexacn() {
  removeAllFunc('[class*=important]')
}
// 樱花动漫
function yinghuadongman() {
  removeAllFunc('[id*=HM], #fix_bottom_dom')
  removeArrList(['HMRichBox', 'fix_bottom_dom'], '#')
}
// 笔趣阁
function biquge() {
  removeAllFunc('[id*=cs_]')
  removeAllFunc('.dahengfu')
  removeAllFunc('.box_con>table')
  removeAllFunc('.box_con>p')
  removeAllFunc('#content>p:last-child')
}
// 4hu
function hu4tv() {
  // #midBox
  const adList = [
    'midBox',
    'coupletLeft',
    'coupletRight',
    'listBox',
    'btmBox',
    'popBox',
    'maskBox',
  ]
  removeArrList(adList, '#')
  if (pathname !== '/') {
    $$('.wrap').length === 6 && $$('.wrap')[0].remove()
  }
  videoPlay()
}
// csdn
function csdn() {}
// youtube
function youtube() {
  videoPlay()
  const linkList = [...getDomList('.ytd-rich-grid-renderer #meta #video-title-link'), ...getDomList('.ytd-watch-next-secondary-results-renderer #dismissible .metadata a')]
  addLinkListBox(linkList, 'youtube-toolbox')
}

function mdn({
  href,
  win
}) {
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

function zhihu({
  href,
  win
}) {
  const adClassList = [
    'Post-SideActions',
    'Card.TopstoryItem.TopstoryItem--old.TopstoryItem--advertCard.TopstoryItem-isRecommend',
    'Pc-card.Card>a',
    'Sticky>a',
  ]
  removeArrList(adClassList, '.')
  rmSomeSelf('.Card.TopstoryItem.TopstoryItem--old.TopstoryItem-isFollow', '.advert-signpc-label')
  rmSomeSelf('.Card.TopstoryItem.TopstoryItem--old.TopstoryItem-isRecommend', '.advert-signpc-label')
  const throlleRemove = throttle(removeArrList, 300)
  win.addEventListener('scroll', function scroll() {
    throlleRemove(adClassList, '.')
  })
  const includesList = ['web', 'js', 'javascript', 'node', 'npm', 'github', 'jquery', 'css', 'html', '音视频', '前端', 'vue', 'react', 'nginx', 'webpack', 'http', 'websocket', 'ts', 'typescript', 'chrome']
  const root = document.querySelector('#root')
  let linkList = Array.from(root.querySelectorAll('a'))
  linkList = linkList.filter(link => {
    console.log(link.innerText || ('innerText' in link.firstElementChild && link.firstElementChild.innerText), '--------');
    return includesList.some(item => (link.innerText || ('innerText' in link.firstElementChild && link.firstElementChild.innerText) || "").toLowerCase().includes(item))
  })
  addLinkListBox(linkList, 'zhihu-toolbox')
}

function juejin() {
  setStyle('.article-suspended-panel.article-suspended-panel', 'right: 17rem;margin-right:unset')
  setStyle('.article-catalog', 'overflow-y:auto;height:calc(100vh - 100px)')
  rmSomeSelf('.entry-list>.item', '.tag')
  const linkList = [...getDomList('.content-wrapper .title-row a')]
  addLinkListBox(linkList, 'juejin-toolbox')
}
// 简书
function jianshu() {
  // iframe的广告都给他干掉
  const c = document.querySelectorAll('iframe')
  Array.from(c).forEach(it => it.remove())

  setStyle('._3Pnjry', 'right: 200px;left:unset')
  const linkList = [...getDomList('._1iTR78 .em6wEs>a'), ...getDomList('.itemlist-box .content>a'), ...getDomList('._3Z3nHf ._26Hhi2 a'), ...getDomList('._3Z3nHf .cuOxAY a')]
  addLinkListBox(linkList, 'jianshu-toolbox')
}
// 思否
function sifou() {
  setStyle('.d-none.col-2', 'position:fixed!important;right:0;')
  const linkList = [...getDomList('.content-list-wrap .list-group-flush .list-group-item h5 a'), ...getDomList('.article-content h3 a')]
  addLinkListBox(linkList, 'sifou-toolbox')
}

// google
function google() {
  const linkList = [...getDomList('.g .yuRUbf>a')]
  addLinkListBox(linkList, 'google-toolbox')
}
// 博客园
function bokeyuan() {
  setStyle('#main_content', 'max-width:1200px;margin:auto')
  setStyle('#post_list', 'width: 800px')
  const linkList = [...getDomList('#post_list .post-item .post-item-title'), ...getDomList('#side_right .item-list a')]
  addLinkListBox(linkList, 'bokeyuan-toolbox')
}
// 摸摸鱼
function momoyu() {
  const linkList = [...getDomList('.content .hot-outer ul li a')]
  addLinkListBox(linkList, 'momoyu-toolbox')
}
// 小刀娱乐网
function xiaodao() {
  const linkList = [...getDomList('#CommonListCell .post-list .post-title a'), ...getDomList('.LanMu_WenZhangCeBianLan ul li a')]
  addLinkListBox(linkList, 'xiaodao-toolbox')
}

function lodash({
  href,
  win
}) {
  const s = href.replace('lodash.com', 'www.lodashjs.com')
  location.href = s
}

function webpack({
  href,
  win
}) {
  const zhName = 'docschina'
  // https://webpack.docschina.org/
  const str = new URL(href)
  location.href = 'https://webpack.' + zhName + '.org' + str.pathname
}

function vue() {
  location.href = location.protocol + '//cn.' + location.host
}

function vite() {
  location.href = 'https://cn.vitejs.dev' + location.pathname
}

function pornhub() {
  removeFunc('#hd-rightColVideoPage')
  removeFunc('li.sniperModeEngaged.alpha')
  const adIdList = ['pb_content', 'pb_top_bar']
  removeArrList(adIdList, '#')
  videoPlay()
}

function github() {
  const linkList = [...getDomList('.d-md-flex .d-flex h3')]
  let aLinkStr = '',
    linkListStr = ''
  linkList.forEach(item => {
    const itemList = Array.from(item.querySelectorAll('a'))
    if (itemList.length <= 0) return
    itemList.forEach(it => {
      aLinkStr += `<a href='${it.toString()}' rel="noopener noreferrer" target="_blank">${it.innerText}</a>`
    })
    linkListStr += `<li>${aLinkStr}</li>\n`
    aLinkStr = ''
  })
  addLinkListBox([], 'xiaodao-toolbox', linkListStr)
}
//  https://product.pconline.com.cn/ class: fixLeftQRcode  id:xuanfu_wapper

// 所有跳转方法
function tiaozhuan(queryList, fn) {
  window.addEventListener('click', function (e) {
    let href = '',
      query = ''
    if (e.target.href) {
      href = e.target.href
    } else if (e.target.parentNode && e.target.parentNode.href) {
      href = e.target.parentNode.href
    }
    const hrefStr = decodeURIComponent(href)
    const splitStr = queryList.find(item => {
      return hrefStr.includes(item)
    })
    query = hrefStr.split(splitStr)[1]
    fn()
    if (query) {
      e.preventDefault()
      gotoLink(query)
    }
  })
}

const vueFlag = vueAroundList.some(it => host === it)
if (vueFlag && !href.includes('/zh/')) {
  let s = location.origin + '/zh/' + location.pathname
  location.href = s
}

// 去除copy之后的尾巴
document.addEventListener('copy', function (e) {
  e.preventDefault()
  const selection = window.getSelection().toString()
  e.clipboardData.setData('text/plain', selection)
})

// 谷歌翻译
// 不翻译的列表
const fanYiList = ['stackoverflow.com', 'www.npmjs.com']
const fanyiFlag = fanYiList.some(item => host === item)

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
  const {
    head
  } = document
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
  ;
  (function ziDongFanYi() {
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message, sender, sendResponse, 'message,sender,sendResponse')
  sendResponse({
    text: message + ' world'
  })
})

// 页面离开事件
window.addEventListener('beforeunload', function (event) {
  // clearInterval(timer);
  observer.disconnect()
  // event.returnValue = "\o/";
})

setTimeout(function () {
  let performance_end = performance.now()
  const time = performance_end - performance_now
  logInfo('加载时间' + '===>' + time)
}, 0)

setTimeout(function () {
  return false

  function removeAd(e) {
    const target = e.target
    const targetList = Array.from(e.target.classList)
    if (targetList.includes('remove-ad-box') || target.nodeName === 'BODY')
      return
    e.preventDefault()
    let domStr = ''
    if (targetList.length > 0) {
      domStr = '.' + targetList.join('.')
    } else if (target.id) {
      domStr = '#' + target.id
    } else {
      const parent = target.parentNode
      const parentClassList = Array.from(parent.classList)
      if (parentClassList.length > 0) {
        domStr =
          '.' + parentClassList.join('.') + '>' + target.nodeName.toLowerCase()
      } else {
        domStr = '#' + target.id + '>' + target.nodeName.toLowerCase()
      }
    }
    try {
      domStrList.push(domStr)
      log(domStrList, 'domStrList')
      const dom = document.querySelector(domStr)
      dom.remove()
    } catch (error) {}
  }
}, 0)

setTimeout(function () {
  // 需要指定 跳转分隔符 的列表
  const goLinkList = {
    'www.yyyweb.com': {
      callback: yyywebClick,
    },
    'www.jianshu.com': {
      target: ['url='],
    },
    // 知乎专栏
    'zhuanlan.zhihu.com': {
      target: ['?t='], // 优先级高于target
    },
  }

  if (tiaozhuanFlag) {
    tiaozhuanFlag = false
    const targetList = []
    if (goLinkList[host] && goLinkList[host].target) {
      targetList.concat(goLinkList[host].target)
    }
    targetList.push('target=')
    tiaozhuan(targetList, (goLinkList[host] = noop))
  }

  // ctrl + space 实现点击鼠标所在位置
  const body = document.querySelector("body");
  let point = {};
  //获取页面上所有的dom节点
  function getNodeList(body, nodeList = [], index = 0) {
    const childrenList = [...body.children];
    if (childrenList.length <= 0) {
      return nodeList;
    }
    index++;
    childrenList.forEach((item) => {
      const filterNodeNameList = ['SCRIPT', 'STYLE', 'IFRAME']
      if (filterNodeNameList.includes(item.nodeName)) return
      const point = item.getBoundingClientRect();
      nodeList.push({
        node: item,
        point,
        index,
      });
      getNodeList(item, nodeList, index);
    });
  }
  // 从子孙往上找，直到找到可以点击的dom
  function findParentClick(item) {
    console.log(item, 'findParentClicK可点击的对象');
    if ('click' in item) {
      item.click()
      return false
    }
    const parent = item.parentNode
    findParentClick(parent)
  }
  window.addEventListener("mousemove", function (e) {
    debounce(() => {
      point = {
        x: e.clientX,
        y: e.clientY,
      };
    })
  });
  window.addEventListener("keydown", function (e) {
    const code = e.keyCode;
    if (e.ctrlKey && code === 32) {
      debounce(() => {
        let nodeList = []
        getNodeList(body, nodeList);
        const chooseList = nodeList.filter((item) => inDom(item, point));
        console.log(chooseList, '-----chooseList-----');
        const len = chooseList.length;
        if (len === 0) return
        let index = 0;
        chooseList.forEach((item, i) => {
          if (index < item.index) {
            index = item.index;
          }
        });
        const item = chooseList.find((item) => item.index === index);
        findParentClick(item.node)
      })
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
}, 0)
