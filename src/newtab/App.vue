<!--
 * @Author: yucheng
 * @Date: 2021-08-31 08:23:13
 * @LastEditTime: 2021-12-14 22:08:32
 * @LastEditors: yucheng
 * @Description: ...
-->
<template>
  <div class="newtab">
    <!-- <h1>{{ msg }}</h1> -->
    <div class="search-btn-list">
      <input
        ref="input"
        type="search"
        v-model="value"
        class="yucheng-search-input"
        @focus="searchInputFocus = true"
        @blur="searchInputFocus = false"
      /><button @click="handleSearch" ref="search-btn">搜索</button><br />
      google:<button
        v-for="(item, i) in searchBtnList"
        :key="i"
        @click="handleSearchChange(item.type)"
      >
        {{ item.text }}</button
      ><br />
      <!-- baidu:<button
        v-for="(item, i) in baiduSearchBtnList"
        :key="i"
        @click="handleBaiduSearchChange(item.type)"
      >
        {{ item.text }}
      </button> -->
    </div>
    <div class="content-wrap">
      <div v-for="(item, i) in list" :key="i" class="content-item">
        <div class="icon">
          <img :src="item.icon || '../assets/icons/icon_64.png'" alt />
          <i @click="remove(i)">×</i>
        </div>
        <a :href="item.href" @click="clickA(item, $event, i)">{{
          item.name
        }}</a>
      </div>
    </div>
    <button @click="handlerClick">添加表单</button>
    <div v-show="show" class="form">
      <div class="form-item">
        <span>icon:</span>
        <input v-model="formData.icon" type="text" />
      </div>
      <div class="form-item">
        <span>name:</span>
        <input v-model="formData.name" type="text" />
      </div>
      <div class="form-item">
        <span>href:</span>
        <input v-model="formData.href" type="text" />
      </div>
      <div class="form-item">
        <button @click="cancel">取消</button>
        <button @click="confirm">确定</button>
      </div>
    </div>
    <div class="link-list">
      <ul>
        <li v-for="(item, i) in linkList" :key="i">
          <a :href="item.href">{{ item.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from './config';

export default {
  data() {
    return {
      msg: '欢迎来到我的页面，我是靓仔',
      list: [],
      linkList: config.linkList,
      show: false,
      formData: {
        icon: '',
        name: '',
        href: ''
      },
      value: '',
      searchBtnList: [
        {
          text: '精确搜索',
          type: '"'
        },
        {
          text: '包含关键字网站',
          type: ' inurl:'
        },
        {
          text: '指定网站',
          type: ' site:'
        },
        {
          text: '或者',
          type: ' OR:'
        },
        {
          text: '缩小范围',
          type: ' -'
        },
        {
          text: '加大范围',
          type: ' +'
        },
        {
          text: '指定文件',
          type: ' filetype:'
        },
        {
          text: '指定标题',
          type: ' intitle:'
        },
        {
          text: '正文包含',
          type: ' intext:'
        },
        {
          text: '所有包含关键字',
          type: ' allinurl:'
        },
        {
          text: '所有包含标题',
          type: ' allintitle:'
        },
        {
          text: '缓存搜索',
          type: ' cache:'
        },
        {
          text: '所有包含标题',
          type: ' allintitle:'
        }
      ],
      baiduSearchBtnList: [
        {
          text: '指定标题',
          type: 1
        },
        {
          text: '指定网站',
          type: 2
        },
        {
          text: '指定url含参',
          type: 3
        },
        {
          text: '精确搜索',
          type: 4
        },
        {
          text: '缩小范围',
          type: 5
        },
        {
          text: '文档搜索',
          type: 6
        },
        {
          text: '包含特定查询词',
          type: 7
        }
      ],
      searchInputFocus: false,
      baseUrl: 'https://www.google.com/search?q='
    };
  },
  created() {
    console.log(chrome, 'newTab');
    this.getCurrentTabId();
    this.init();
  },
  mounted() {
    window.addEventListener('keyup', this.keyup);
  },
  methods: {
    handleSearch() {
      location.href = this.baseUrl + this.value;
    },
    handleBaiduSearchChange(type) {
      this.baseUrl = 'https://www.baidu.com/s?wd=';
      if (type === 1) {
        const a = 'intitle:';
        if (this.value.includes(a)) {
          return;
        }
        this.value = a + this.value;
      } else if (type === 2) {
        const a = ' site:';
        if (this.value.includes(a)) {
          return;
        }
        this.value = this.value + a;
      } else if (type === 3) {
        const a = ' inurl:';
        if (this.value.includes(a)) {
          return;
        }
        this.value = this.value + a;
      } else if (type === 4) {
        const a = '"';
        if (this.value.includes(a)) {
          return;
        }
        this.value = a + this.value + a;
      } else if (type === 5) {
        const a = ' -';
        if (this.value.includes(a)) {
          return;
        }
        this.value = this.value + a;
      } else if (type === 6) {
        const a = ' fileType:';
        if (this.value.includes(a)) {
          return;
        }
        this.value = this.value + a;
      } else if (type === 7) {
        const a = ' +';
        if (this.value.includes(a)) {
          return;
        }
        this.value = this.value + a;
      }
      this.focus();
    },
    handleSearchChange(type) {
      this.baseUrl = 'https://www.google.com/search?q=';
      if (type === '"') {
        if (this.value.includes(type)) {
          return;
        }
        this.value = type + this.value + type;
      } else {
        if (this.value.includes(type)) {
          return;
        }
        this.value = this.value + type;
      }
      this.focus();
      console.log(this.value);
    },
    focus() {
      this.$refs.input.focus();
    },
    // '/'键搜索框自动聚焦
    keyup(e) {
      if (e.keyCode === 191) {
        if (!this.searchInputFocus) {
          this.$refs.input.focus();
        }
      }
      if (e.keyCode === 13) {
        if (this.searchInputFocus) {
          this.handleSearch();
        }
      }
    },
    // 获取当前选项卡ID
    getCurrentTabId(callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs, 'tabs');
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
      chrome.storage.sync.get(['linkList'], function (result) {
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
      chrome.storage.sync.set({ linkList: list }, function () {
        that.init.call(that);
        if (clearForm) {
          that.formData = {
            icon: '',
            name: '',
            href: ''
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
          content: '';
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
