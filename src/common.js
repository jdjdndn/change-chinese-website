/*
 * @Author: yucheng
 * @Date: 2022-01-01 16:28:16
 * @LastEditTime: 2022-01-01 17:51:37
 * @LastEditors: yucheng
 * @Description: ..
 */

let target = null,
  timer = null,
  targetCssText = null,
  configParamsDefault = {
    changeEleMiaoBian: false,
    debug: true
  }

function debounce(fn, delay = 16) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(fn, delay);
}

// shift + space 实现点击鼠标所在位置
export function mouseClick(configParams = configParamsDefault) {
  // console.log(configParams, 'common.js------');
  // 从子孙往上找，直到找到可以点击的dom
  function findParentClick(item) {
    if (!item) return
    // 获取元素上的监听事件
    if (typeof getEventListeners === 'function') {
      const listeners = getEventListeners(item)
      if (listeners && listeners.click) {
        item.click()
        return false
      }
    } else if ('click' in item) {
      // 拿不到监听的事件对象就看能否点击，能点击就点击
      item.click()
      return false
    }
    const parent = item.parentNode
    findParentClick(parent)
  }

  function pointermove(e) {
    debounce(() => {
      if (configParams.changeEleMiaoBian) {
        if (target) {
          target.style.cssText = targetCssText
        }
      }
      target = e.target
      if (configParams.changeEleMiaoBian) {
        targetCssText = e.target.style.cssText
        e.target.style.cssText += 'box-shadow: 0px 0px 1px 1px #ccc;'
      }
      if (!target || !target.nodeName || !target.classList || target.innerText === '') return false
      logInfo(target.nodeName.toLowerCase(), target.classList, target.innerText.slice(0, 20), 'target');
    })
  }
  window.removeEventListener('pointermove', pointermove)
  window.addEventListener("pointermove", pointermove);

  function keydown(e) {
    const code = e.keyCode;
    // if (e.shiftKey && code === 32) {
    // if (e.altKey && code === 66) {
    if (e.ctrlKey && code === 81) {
      findParentClick(target)
    }
  }

  window.removeEventListener("keydown", keydown);
  window.addEventListener("keydown", keydown);

  function logInfo(...msg) {
    if (!configParams.debug) return false
    console.log(...msg);
  }
}
