<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-10-05 07:28:27
 * @LastEditors: yucheng
 * @Description: ...
-->
<template>
  <div class="newtab">
    <h1>{{ msg }}</h1>
    <div class="content-wrap">
      <div
        v-for="(item, i) in list"
        :key="i"
        class="content-item"
      >
        <div class="icon">
          <img
            :src="item.icon || '../assets/icons/icon_64.png'"
            alt
          >
          <i @click="remove(i)">×</i>
        </div>
        <a
          :href="item.href"
          @click="clickA(item, $event, i)"
        >{{
          item.name
        }}</a>
      </div>
    </div>
    <button @click="handlerClick">
      添加表单
    </button>
    <div
      v-show="show"
      class="form"
    >
      <div class="form-item">
        <span>icon:</span>
        <input
          v-model="formData.icon"
          type="text"
        >
      </div>
      <div class="form-item">
        <span>name:</span>
        <input
          v-model="formData.name"
          type="text"
        >
      </div>
      <div class="form-item">
        <span>href:</span>
        <input
          v-model="formData.href"
          type="text"
        >
      </div>
      <div class="form-item">
        <button @click="cancel">
          取消
        </button>
        <button @click="confirm">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config";

export default {
  data() {
    return {
      msg: "欢迎来到我的页面，我是靓仔",
      list: [],
      show: false,
      formData: {
        icon: "",
        name: "",
        href: ""
      }
    };
  },
  created() {
    console.log(chrome, "newTab");
    this.getCurrentTabId();
    this.init();
  },
  methods: {
    // 获取当前选项卡ID
    getCurrentTabId(callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log(tabs, "tabs");
        if (callback) callback(tabs.length ? tabs[0].id : null);
      });
    },
    clickA(item, e, i) {
      e.preventDefault();
      if (item.index <= 0 || !item.index) {
        this.list[i].index = 1;
      } else {
        // eslint-disable-next-line no-plusplus
        this.list[i].index++;
      }
      this.setData(this.list);
      this.init();
      // eslint-disable-next-line no-restricted-globals
      location.href = item.href;
    },
    // 初始化获取数据
    init() {
      const that = this;
      chrome.storage.sync.get(["linkList"], function(result) {
        if (!result.linkList) {
          that.list = config.list;
          return true;
        }
        that.list = result.linkList.sort((a, b) => {
          if (!a.index) {
            a.index = 1;
          }
          if (!b.index) {
            b.index = 1;
          }
          return b.index - a.index;
        });
      });
    },
    // 打开添加表单
    handlerClick() {
      this.show = true;
    },
    // 取消
    cancel() {
      this.show = false;
    },
    // 确定
    confirm() {
      this.list.push(this.formData);
      this.setData(this.list, true);
      this.cancel();
    },
    // 设置数据
    setData(list, clearForm = false) {
      const that = this;
      chrome.storage.sync.set({ linkList: list }, function() {
        that.init.call(that);
        if (clearForm) {
          that.formData = {
            icon: "",
            name: "",
            href: ""
          };
        }
      });
    },
    // 删除
    remove(i) {
      const list = this.list.filter((item, index) => index !== i);
      this.setData(list);
    }
  }
};
</script>

<style lang="scss">
$width: 80px;
$height: 80px;
.newtab {
  padding: 20px;
  h1 {
    font-size: 30px;
  }
  .content-wrap {
    display: flex;
    flex-wrap: wrap;
    .content-item {
      width: $width;
      height: $height;
      display: flex;
      margin: 10px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      div {
        position: relative;
        width: 100%;
        height: 50px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        .icon {
        }
        i {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          right: -8px;
          top: -10px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          font-size: 20px;
          z-index: 999;
          cursor: pointer;
        }
      }
      a {
        position: relative;
        width: 100%;
        height: 20px;
        text-decoration: none;
        font-size: 12px;
        &:before {
          content: "";
          position: absolute;
          width: $width;
          height: $height;
          left: 0;
          top: -60px;
        }
      }
    }
  }
  .form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
  }
}
</style>
