/*
 * @Descripttion:基础通用mixin
 * @Date: 2020-11-19 11:03:17
 */

import { mapGetters, mapActions } from 'vuex'

import { reqCodeSelect } from '@a/common'

export const tableMixin = {
  data() {
    return {
      tableData: [],
      loading: false,
      date: [],
      detail: {},
      detailTitle: '',
      detailVisible: false,
      isAdd: true,
      idList: [],
      pageObj: {
        total: null,
        pageSize: 20,
        pageNum: 1
      }
    }
  },
  methods: {
    // 获取code下拉框数据
    async getCodeSelect(codes) {
      const keyList = codes.split(',')
      const res = await reqCodeSelect(codes)
      if (res.code === 0) {
        keyList.forEach(key => {
          this[key] = res.data[key]
        })
      }
    }
  },
  created() {
    this.search()
  }
}

export const manualRemoveTab = {
  methods: {
    ...mapActions('app', ['removeTabsData']),
    handleTabRemove() {
      this.$router.push(this.whereFrom)
      const tabName = this.tabs.activeName
      this.removeTabsData(tabName).then((removeIndex) => {
        const tabsLength = this.tabs.data.length
        if (tabsLength) {
          if (tabName === this.tabs.activeName) {
            const newActiveIndex =
              removeIndex >= tabsLength - 1 ? tabsLength - 1 : removeIndex
            const tabData = this.tabs.data[newActiveIndex]
            this.$router.push(this.tabToRoute(tabData))
          }
        }
      })
    },
    tabToRoute(tabData) {
      return {
        fullPath: tabData.fullPath,
        path: tabData.path,
        name: tabData.name,
        query: tabData.query,
        params: tabData.params
      }
    }
  },
  computed: {
    ...mapGetters(['tabs'])
  },
  beforeRouteEnter(to, from, next) {
    const {
      path
    } = from
    next((vm) => {
      vm.whereFrom = path
      // console.log(vm)
    })
  },
}
