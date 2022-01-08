/*
 * @Author: yucheng
 * @Date: 2022-01-01 16:28:16
 * @LastEditTime: 2022-01-08 20:08:33
 * @LastEditors: yucheng
 * @Description: ..
 */

let target = null,
  timer = null,
  targetCssText = null,
  configParamsDefault = {
    changeEleMiaoBian: false,
    debug: true
  },
  YUCHENG_USE_BOX = document.createElement('div'),
  YUCHENG_TIMER = null,
  YUCHENG_USE_DELAY = 1000,
  {
    log
  } = console,
  onerror = window.onerror,
  MAX_RECORD_REQUEST_LIST = 200
YUCHENG_USE_BOX.classList.add('yucheng-use-box')
document.body.appendChild(YUCHENG_USE_BOX)

function debounce(fn, delay = 16) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(fn, delay);
}

function boxInfo(info) {
  YUCHENG_USE_BOX.innerHTML = info
  YUCHENG_USE_BOX.style.display = 'block'
  setTimeout(() => {
    YUCHENG_USE_BOX.style.display = 'none'
  }, YUCHENG_USE_DELAY)
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
        boxInfo('click s')
        return false
      }
    } else if ('click' in item) {
      // 拿不到监听的事件对象就看能否点击，能点击就点击
      item.click()
      boxInfo('click s')
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
      logInfo(target.nodeName.toLowerCase(), target.classList, 'target');
    })
  }
  window.removeEventListener('pointermove', pointermove)
  window.addEventListener("pointermove", pointermove);

  function keyup(e) {
    const code = e.keyCode;
    if (e.ctrlKey && code === 88 && !window.getSelection().toString()) {
      findParentClick(target)
    }
    // 实现浏览器上一步下一步
    if (37 == code && e.ctrlKey) {
      //处理的部分
      boxInfo('后推')
      history.back()
    }
    if (39 == code && e.ctrlKey) {
      //处理的部分
      boxInfo('前进')
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

function clipboardWrite(text) {
  if (text) {
    navigator.clipboard.writeText(text).then(function () {
      /* clipboard successfully set */
      boxInfo('copy s')
    }, function (err) {
      /* clipboard write failed */
      boxInfo('copy e')
    });
  } else if (target.nodeName.toLowerCase() === 'img') {
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
