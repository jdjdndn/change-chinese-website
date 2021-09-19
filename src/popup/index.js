/*
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-09-17 17:23:02
 * @LastEditors: yucheng
 * @Description:...
 */
import Vue from 'vue'
import 'bulma-fluent/bulma.sass'

import App from './App.vue'

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
})

var background = chrome.extension.getBackgroundPage() // 得到background页的windows对象
// 接下来为所欲为~
background.GetMessageFromPopup('给我的兄弟background点东西')
// function GetMessageFromBackground(data) {
//   console.log('background给我的东西~', data)
// }
