<template>
  <el-drawer
    size="70%"
    :title="drawerTitle"
    :visible="visible"
    @close="close"
    @opened="opened"
    @open="open"
  >
    <div class="wrapper">
      <el-form
        :inline="true"
        ref="searchForm"
        :model="searchParams"
        size="small"
        class="search-form"
      >
        <!-- 显示的查询条件 -->
        <div class="visible-conditions">
          <el-form-item
            v-for="(item, index) in visibleConditions"
            :key="index"
            :label="item.label"
            :prop="item.key"
          >
            <component
              :is="item.type"
              v-model="searchParams[item.key]"
              :options="item.options"
              v-bind="item.props"
              @keyup.enter.native="search(true)"
            />
          </el-form-item>
          <div class="btn-wrapper">
            <el-button-group>
              <el-button
                v-if="hiddenConditions.length > 0"
                type="default"
                size="small"
                :icon="expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                @click="toggleHiddenConditions"
              >{{expandText}}</el-button>
              <el-button icon="el-icon-search" type="primary" size="small" @click="search">查询</el-button>
            </el-button-group>
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="reset('searchForm')"
              style="margin-left:10px"
            >重置</el-button>
          </div>
        </div>
        <!-- 隐藏的查询条件 -->
        <div class="hidden-conditions">
          <el-collapse-transition>
            <div class="hide-position" v-show="expanded">
              <el-form-item
                v-for="(item, index) in hiddenConditions"
                :key="index"
                :label="item.label"
                :prop="item.key"
              >
                <component
                  :is="item.type"
                  v-model="searchParams[item.key]"
                  :options="item.options"
                  v-bind="item.props"
                />
              </el-form-item>
            </div>
          </el-collapse-transition>
        </div>
      </el-form>
      <!-- 选择数据表格 -->
      <el-table
        ref="table"
        border
        :stripe="stripe"
        v-loading="loading"
        :data="tableData"
        :cell-style="{padding:'0px'}"
        class="table"
      >
        <!-- 数据列 -->
        <template v-for="(item, index) in columns">
          <el-table-column v-if="item.prop === 'enabled_t'" :key="index" v-bind="item">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.enabled" size="small" effect="plain">{{ scope.row.enabled_t }}</el-tag>
              <el-tag v-else size="small" type="info" effect="plain">{{ scope.row.enabled_t }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.slotName" :key="index" v-bind="item">
            <template slot-scope="scope">
              <slot :scope="scope" :name="item.slotName"></slot>
            </template>
          </el-table-column>
          <af-table-column v-else :key="index" v-bind="item"></af-table-column>
        </template>
        <el-table-column v-if="columns.length > 0" align="center" width="50px" fixed="right">
          <template slot="header">操作</template>
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row._disabled"
              @click="checkAdd(scope.row)"
              type="text"
              size="small"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :background="false"
        layout="total, sizes, next, pager, prev, jumper"
        class="pagination"
        @size-change="sizeChange"
        @current-change="currentPageChange"
      ></el-pagination>
      <div class="checked">{{checkedTitle}}</div>
      <!-- 已选数据表格 -->
      <el-table
        ref="checkeTtable"
        border
        :stripe="stripe"
        :data="tempCheckedData"
        :cell-style="{padding:'0px'}"
        class="checkeTtable"
      >
        <!-- 数据列 -->
        <template v-for="(item, index) in checkedColumns">
          <el-table-column v-if="item.slotName" :key="index" v-bind="item">
            <template slot-scope="scope">
              <slot :scope="scope" :name="item.slotName"></slot>
            </template>
          </el-table-column>
          <af-table-column v-else :key="index" v-bind="item"></af-table-column>
        </template>
        <el-table-column v-if="checkedColumns.length > 0" align="center" width="50px" fixed="right">
          <template slot="header">操作</template>
          <template slot-scope="scope">
            <el-button @click="checkRemove(scope.row)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button class="left" size="small" @click="handleCancel">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { get } from '@a/_request'
import SimpleSlect from '@c/SimpleSelect'

export default {
  components: {
    SimpleSlect
  },
  props: {
    keyCode: {
      // 数据唯一key
      type: String,
      // default: 'id',
      required: true
    },
    visible: {
      // 抽屉显示
      type: Boolean,
      required: true
    },
    fields: {
      // 搜索项
      type: Array,
      required: true
    },
    columns: {
      // 数据列定义不需要操作列
      type: Array,
      required: true
    },
    checkedColumns: {
      // 已选数据列定义不需要操作列
      // 某一列可以编辑需定义couldEdit属性为true
      type: Array,
      required: true
    },
    /* searchParams: {
      // 查询参数对象
      type: Object,
      required: true
    }, */
    checkedData: {
      // 有checkedColumns所有属性的对象数组
      type: Array,
      required: true
    },
    drawerTitle: {
      // 抽屉标题
      type: String,
      default: '添加物料'
    },
    checkedTitle: {
      // 已选项标题
      type: String,
      default: '已选物料'
    },
    cellEdit: {
      // 表格单元格双击修改
      type: Boolean,
      default: true
    },
    searchUrl: {
      // 查询数据API
      type: String,
      // default: '/device/material-list'
      default: '/device/page'
    },
    stripe: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hasEdit() {
      if (this.checkedColumns.length > 0) {
        return this.checkedColumns.some((i) => i.couldEdit)
      } else {
        return false
      }
    },
    visibleConditions() {
      return this.fields.slice(0, 4)
    },
    hiddenConditions() {
      return this.fields.slice(4)
    }
  },
  data() {
    return {
      expanded: false, // 隐藏查询条件是否展开
      expandText: '展开',
      loading: false,
      searchParams: {},
      tableData: [],
      pagination: {
        // 分页栏数据对象
        total: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 50]
      },
      tempCheckedData: []
    }
  },
  methods: {
    handleSubmit() {
      const { tempCheckedData } = this
      const couldSubmit = tempCheckedData.some((i) => i._isEdit)
      if (couldSubmit) {
        this.$message.warning('请先完成编辑操作!')
        return
      }
      const data = JSON.parse(JSON.stringify(tempCheckedData))
      // 提交已选数据
      this.$emit('confirm-checked', data)
      this.close()
      this.tempCheckedData = []
    },
    handleCancel() {
      // 取消
      this.close()
    },
    checkAdd(data) {
      data._disabled = true
      const tempRow = JSON.parse(JSON.stringify(data))
      // 已选数据添加新属性
      this.$emit('init-check-data', tempRow)
      this.tempCheckedData.unshift(tempRow)
    },
    checkRemove(data) {
      const { tempCheckedData, keyCode, tableData } = this
      const couldRemove = tempCheckedData.some((i) => i._isEdit)
      if (data._isEdit || couldRemove) {
        this.$message.warning('编辑中，无法移除!')
        return
      }
      this.tempCheckedData = tempCheckedData.filter((i) => i[keyCode] !== data[keyCode])
      const target = tableData.find((i) => i[keyCode] === data[keyCode])
      if (target) {
        target._disabled = false
      }
    },
    opened() {
      /* console.log(this.$refs.searchForm)
      this.$refs.searchForm.$el.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
          // 焦点位于searchForm内时，回车触发查询
          // TODO 当焦点在下拉框上，并且下拉选项未展开时，阻止下拉框的回车事件
          event.preventDefault()
          event.stopPropagation()
          this.search()
        }
      })
      this.$el.addEventListener('keydown', (event) => {
        if (event.keyCode === 81 && event.ctrlKey) {
          // Ctrl+Q 展开/折叠隐藏查询条件
          this.toggleHiddenConditions()
        }
      }) */
    },
    open() {
      if (this.checkedData && this.checkedData.length > 0) {
        const tempCheckedData = JSON.parse(JSON.stringify(this.checkedData))
        if (this.hasEdit) {
          tempCheckedData.forEach((i) => {
            // 已选数据存在编辑项 添加_isEdit属性
            i._isEdit = false
          })
        }
        this.tempCheckedData = tempCheckedData
      }
      this.search(true)
    },
    getCouldEdit(arr) {
      if (!Array.isArray(arr)) {
        return []
      }
      return arr.filter((i) => i.hasOwnProperty('couldEdit'))
    },
    async search(reload) {
      // 注入额外查询参数
      this.$emit('prepare-search-params', this.searchParams)
      this.loading = true
      const params = this.prepareSearchParams()
      const { pageSize, currentPage } = this.pagination
      params.pageSize = pageSize
      params.currentPage = reload ? 1 : currentPage
      try {
        const response = await get(this.searchUrl, { params })
        if (response.code === 0) {
          const { result, total } = response.data
          if (Array.isArray(result) && result.length > 0) {
            result.forEach((i) => {
              // 默认不禁用
              i._disabled = false
            })
          }
          const { tempCheckedData, keyCode } = this
          if (tempCheckedData.length > 0) {
            for (const checked of tempCheckedData) {
              for (const unchecked of result) {
                if (unchecked[keyCode] === checked[keyCode]) {
                  // 禁用已选择的数据
                  unchecked._disabled = true
                }
              }
            }
          }
          // 处理表格数据
          this.$emit('prepare-table-data', result)
          // console.log(this.$listeners)
          this.pagination.total = total
          this.loading = false
          this.tableData = result
          return result
        }
      } catch (error) {
        this.loading = false
      }
    },
    /**
     * 预处理查询参数
     * 1、去除值为空的字段
     */
    prepareSearchParams() {
      const searchParams = { ...this.searchParams }
      // 去除值为空的字段
      for (const key in searchParams) {
        if (searchParams[key] !== false && searchParams[key] !== 0 && !searchParams[key]) {
          delete searchParams[key]
        }
      }
      return searchParams
    },
    reset(formName) {
      // TODO 下拉框默认值被清空的问题
      this.$refs[formName].resetFields()
      this.search()
    },
    sizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      this.search()
    },
    currentPageChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.search()
    },
    toggleHiddenConditions() {
      this.expanded = !this.expanded
      this.expandText = this.expanded ? '收起' : '展开'
    },
    close() {
      this.$refs.searchForm.resetFields()
      if (this.$listeners['update:visible']) {
        this.$emit('update:visible', false)
      } else {
        // 关闭抽屉回调
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  padding: 10px 10px 20px 10px;
  margin-bottom: 0;
}
::v-deep .el-drawer__header span:focus {
  outline: 0;
}
::v-deep .el-table th,
.el-table td {
  padding: 5px 0;
  font-size: 12px;
}
::v-deep .el-table .cell {
  padding: 0 2px;
}
.wrapper {
  padding: 0 10px;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-rows: 35px 1.1fr 45px 30px 1fr 50px;
  /* .data-table { */
  .search-form {
    .visible-conditions {
      padding-left: 5px;
      width: 100%;
      height: 35px;
      display: grid;
      grid-template-rows: repeat(1, 1fr);
      grid-template-columns: repeat(5, 1fr);
      ::v-deep .el-form-item {
        display: flex;
        white-space: nowrap;
      }
      ::v-deep .el-form-item > .el-form-item__content {
        width: 100%;
      }
      .btn-wrapper {
        display: inline-flex;
        height: 32px;
        width: 270px;
        flex-wrap: nowrap;
      }
    }
    .hidden-conditions {
      position: relative;
      margin-top: 5px;
      .hide-position {
        padding-left: 5px;
        position: absolute;
        width: 100%;
        background: #fff;
        z-index: 66;
        box-shadow: 0 8px 15px -5px #999;
        display: grid;
        grid-template-rows: repeat(auto-fill, 40px);
        grid-template-columns: repeat(5, 1fr);
        grid-auto-rows: 40px;
        ::v-deep .el-form-item {
          display: flex;
          white-space: nowrap;
        }
        ::v-deep .el-form-item > .el-form-item__content {
          width: 100%;
        }
      }
    }
    ::v-deep .el-date-editor {
      width: 100%;
    }
    ::v-deep .el-select {
      width: 100%;
    }
    ::v-deep .el-select-dropdown__wrap {
      margin-bottom: 0px !important;
    }
  }
  .table {
    width: 100%;
    margin-top: 10px;
  }
  .pagination {
    display: flex;
    flex-direction: row-reverse;
    padding-top: 12px;
  }
  /* } */
  .checked {
    line-height: 30px;
  }
  .footer {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding-right: 30px;
    .left {
      margin-right: 20px;
    }
  }
}
</style>
