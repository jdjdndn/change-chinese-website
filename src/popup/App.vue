<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-12-31 21:24:29
 * @LastEditors: yucheng
 * @Description: ...
-->
<template>
  <div ref="popup" class="popup">
    <h1>{{ msg }}</h1>
    <!-- 开启选中元素描边 -->
    <div class="popup-item">
      1、开启选中元素描边
      <label for="a" @click="changeEleCssText(true)"
        >开<input id="a" type="radio" name="a" :checked="changeEleMiaoBian"
      /></label>
      <label for="b" @click="changeEleCssText()"
        >关<input id="b" type="radio" name="a" :checked="!changeEleMiaoBian"
      /></label>
    </div>
    <div class="popup-item">
      2、开启debug
      <label for="c" @click="changeDebug(true)"
        >开<input id="c" type="radio" name="c" :checked="debug"
      /></label>
      <label for="d" @click="changeDebug()"
        >关<input id="d" type="radio" name="c" :checked="!debug"
      /></label>
    </div>
    <!-- 不跳转列表 -->
    <div class="popup-item">
      3、不跳转列表
      <textarea
        name=""
        id=""
        cols="50"
        rows="3"
        :value="noChangeHrefList"
        @blur="noChangeHrefListBlur"
      ></textarea>
      4、记录报错列表
      <textarea
        name=""
        id=""
        cols="50"
        rows="3"
        :value="recordErrorList"
        @blur="recordErrorBlur"
      ></textarea>
    </div>
    <button @click="openBackground">打开popup页面</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!--popup',
      changeEleMiaoBian: false, // 是否开启移入元素加样式
      noChangeHrefList: ['iflytek', 'zhixue', 'localhost'], // 不跳转其他url列表
      debug: false, // 调试模式
      recordErrorList: ['localhost'] // 记录报错列表
    };
  },
  mounted() {
    let that = this;
    // 获取配置参数
    chrome.storage.sync.get(['configParams'], function (result) {
      that.result = result.configParams;
      const { changeEleMiaoBian, noChangeHrefList, debug, recordErrorList } =
        that.result;
      that.changeEleMiaoBian = changeEleMiaoBian || that.changeEleMiaoBian;
      that.debug = debug || that.debug;

      that.noChangeHrefList = noChangeHrefList.length
        ? noChangeHrefList
        : that.noChangeHrefList;
      that.recordErrorList = recordErrorList.length
        ? recordErrorList
        : that.recordErrorList;
      console.log(that, 'that');
    });
  },
  methods: {
    recordErrorBlur(e) {
      // const recordErrorList = e.target.value
      //   .replaceAll('，', ',')
      //   .split(',')
      //   .filter(Boolean);
      const recordErrorList = this.replaceComma(e.target.value);
      // this.changeStorage({ recordErrorList });
      // this.sendMessage({ recordErrorList });
      this.saveAndSend({ recordErrorList });
    },
    changeDebug(flag = false) {
      this.debug = flag;
      const { debug } = this;
      // this.changeStorage({ debug });
      // this.sendMessage({ debug });
      this.saveAndSend({ debug });
    },
    noChangeHrefListBlur(e) {
      // const noChangeHrefList = e.target.value
      //   .replaceAll('，', ',')
      //   .split(',')
      //   .filter(Boolean);
      // this.changeStorage({ noChangeHrefList });
      // this.sendMessage({ noChangeHrefList });
      const noChangeHrefList = this.replaceComma(e.target.value);
      this.saveAndSend({ noChangeHrefList });
    },
    // 打开新页面
    openBackground() {
      // alert(chrome.extension.getURL('background.html'), 'extension');
      window.open(chrome.extension.getURL('options.html'));
    },
    // 切换是否开启元素描边
    changeEleCssText(flag = false) {
      this.changeEleMiaoBian = flag;
      const { changeEleMiaoBian } = this;
      // this.changeStorage({ changeEleMiaoBian });
      // this.sendMessage({ changeEleMiaoBian });
      this.saveAndSend({ changeEleMiaoBian });
    },
    // 分割并替换逗号
    replaceComma(val) {
      return val.replaceAll('，', ',').split(',').filter(Boolean);
    },
    // 保存参数并且发消息
    saveAndSend(msg) {
      this.changeStorage(msg);
      this.sendMessage(msg);
    },
    // 改变配置参数
    changeStorage(payload) {
      const params = { ...this.result, ...payload };
      console.log(params, 'params');
      this._data = {
        ...this._data,
        ...params
      };
      chrome.storage.sync.set({ configParams: params }, function (result) {});
    },
    // 发送消息
    sendMessage(message) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
            console.log(res);
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
.popup {
  label,
  input {
    cursor: pointer;
  }
  textarea {
    outline: 0;
  }
}
</style>
