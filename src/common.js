/*
 * @Author: yucheng
 * @Date: 2022-01-01 16:28:16
 * @LastEditTime: 2022-01-14 21:46:54
 * @LastEditors: yucheng
 * @Description: ..
 */
export const defaultparams = {
  defaultVideoPlayRate: 1.5
}
let target = null,
  timer = null,
  targetCssText = null,
  configParamsDefault = {
    changeEleMiaoBian: false,
    debug: true
  },
  YUCHENG_USE_BOX = document.createElement('div'),
  YUCHENG_USE_DELAY = 1000,
  {
    log
  } = console
YUCHENG_USE_BOX.classList.add('yucheng-use-box')
document.body.appendChild(YUCHENG_USE_BOX)

// 工具类
class Util {
  constructor() {
    this.timer = null;
  }
  debounce(fn, delay = 16) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (typeof fn !== 'function') {
      return false
    }
    this.timer = setTimeout(fn, delay);
  }
}

// noClose 为 false 时，不关闭
export function boxInfo(info, noClose = true) {
  YUCHENG_USE_BOX.innerHTML = info
  YUCHENG_USE_BOX.style.display = 'block'
  noClose && setTimeout(() => {
    YUCHENG_USE_BOX.style.display = 'none'
  }, YUCHENG_USE_DELAY)
}

// shift + space 实现点击鼠标所在位置
export function mouseClick(configParams = configParamsDefault) {
  // console.log(configParams, 'common.js------');
  // 从子孙往上找，直到找到可以点击的dom
  function findParentClick(item, isClick = true) {
    if (!item) return !isClick
    // 获取元素上的监听事件
    if (typeof getEventListeners === 'function') {
      const listeners = getEventListeners(item)
      if (listeners && listeners.click) {
        item.click()
        boxInfo('click s')
        return isClick
      }
    } else if ('click' in item) {
      // 拿不到监听的事件对象就看能否点击，能点击就点击
      item.click()
      boxInfo('click s')
      return isClick
    }
    const parent = item.parentNode
    findParentClick(parent, isClick)
    return !isClick
  }

  function pointermove(e) {
    moveObj.debounce(() => {
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
      logInfo(target.nodeName.toLowerCase(), target.classList, 'target');
    })
  }

  const moveObj = new Util()
  window.removeEventListener('pointermove', pointermove)
  window.addEventListener("pointermove", pointermove);

  window.addEventListener("auxclick", (e) => {
    const flag = findParentClick(target)
    if (flag) {
      boxInfo('auxclick s')
    } else {
      boxInfo('auxclick e')
    }
  });

  function keyup(e) {
    const code = e.keyCode;
    if (e.keyCode === 13) {
      YUCHENG_USE_BOX.style.display = 'none'
    }
    if (e.ctrlKey && code === 88 && !window.getSelection().toString()) {
      const flag = findParentClick(target)
      if (flag) {
        boxInfo('click s')
      } else {
        boxInfo('click e')
      }
    } else if (37 == code && e.ctrlKey) {
      // 实现浏览器上一步下一步
      //处理的部分
      boxInfo('back')
      history.back()
    } else if (39 == code && e.ctrlKey) {
      //处理的部分
      boxInfo('forward')
      history.go(1)
    }
  }

  window.removeEventListener("keyup", keyup);
  window.addEventListener("keyup", keyup);

  function logInfo(...msg) {
    if (!configParams.debug) return false
    // console.log(...msg);
    boxInfo(...msg)
  }
}

// ctrl+c 复制文本
export function copyTargetText() {
  const preList = [...document.querySelectorAll('pre')]
  window.addEventListener('keyup', (e) => {
    if (e.ctrlKey && e.keyCode === 67) {
      const text = window.getSelection().toString()
      if (text) {
        clipboardWrite(text)
      } else {
        if (preList.length) {
          const pre = preList.find(it => it.contains(target))
          if (pre) {
            clipboardWrite(pre.innerText)
            return false
          }
        }
        clipboardWrite(target.innerText)
      }
    }
  })
}

function clipboardWrite(text, needClear = false) {
  if (text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        /* clipboard successfully set */
        boxInfo('copy s')
        if (needClear) {
          window.getSelection().removeAllRanges()
        }
      }, function (err) {
        /* clipboard write failed */
        boxInfo('copy e')
        if (needClear) {
          window.getSelection().removeAllRanges()
        }
      });
    } else {
      document.execCommand('copy')
      boxInfo('copy s')
      if (needClear) {
        window.getSelection().removeAllRanges()
      }
    }
  } else if (['img', 'video'].includes(target.nodeName.toLowerCase())) {
    copyImg()
  } else if (target.nodeName.toLowerCase() === 'canvas') {
    canvasCopy(target)
  }
}


function copyImg() {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const defaultWidth = 800
  const ratio = target.width / target.height
  const width = target.width >= defaultWidth ? target.width : defaultWidth
  const height = width / ratio

  canvas.width = width;
  canvas.height = height;
  // 宽高比

  img.crossOrigin = "Anonymous";
  img.src = target.src;

  img.onload = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    canvasCopy(canvas, true)
  }

  img.onerror = () => {
    boxInfo('cors e')
  }
}

function canvasCopy(canvas, need = false) {
  // 将canvas转为blob
  canvas.toBlob(blob => {
    const data = [
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ];
    navigator.clipboard.write(data)
      .then(
        () => {
          boxInfo("copy s");
        },
        () => {
          boxInfo("copy e");
        }
      );
  });
}

// 选择的自动选中
const selectObj = new Util()
export function autoSelect() {
  document && document.addEventListener('selectionchange', e => {
    selectObj.debounce(() => {
      if (!window.getSelection().toString()) return false
      clipboardWrite(window.getSelection().toString(), true)
    }, 1000)
  })
}
