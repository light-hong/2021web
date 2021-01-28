<template>
  <div class="wrapper">
    <simplebar class="content-wrapper">
      <div class="pr10">
        <el-row class="fs17">基础信息</el-row>
        <el-form
          ref="form"
          :model="ruleForm"
          class="form"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="名称" prop="settleName">
                <el-input v-model.trim="ruleForm.settleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务品类" prop="serviceCategoryCode">
                <el-select v-model="ruleForm.serviceCategoryCode" filterable placeholder="服务品类">
                  <el-option
                    v-for="item in service_category"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商家名称" prop="merchantCode">
                <el-select
                  @change="(val) => selectChange(val, 'merchantCode')"
                  :value="ruleForm.merchantCode"
                  placeholder="商家名称"
                >
                  <el-option
                    v-for="item in merchant_code"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌" prop="brandCode">
                <el-select
                  @change="(val) => selectChange(val, 'brandCode')"
                  :value="ruleForm.brandCode"
                  placeholder="品牌"
                >
                  <el-option
                    v-for="item in brand_code"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="技术支持电话" prop="techPhone">
                <el-input v-model="ruleForm.techPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-radio v-model="ruleForm.enabled" :label="true">启用</el-radio>
                <el-radio v-model="ruleForm.enabled" :label="false">禁用</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="服务类型">
                <chose-dialog
                  title="服务类型"
                  width="450px"
                  :listData="service_type"
                  :chosedList="checkedServiceType"
                  btnValue="选择服务类型"
                ></chose-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务子类">
                <chose-dialog
                  title="服务子类"
                  width="450px"
                  :listData="service_sub_class"
                  :chosedList="checkedSubClass"
                  btnValue="选择服务子类"
                ></chose-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类别">
                <chose-dialog
                  title="设备类别"
                  width="450px"
                  :listData="category_code"
                  :chosedList="checkedDeviceCategory"
                  btnValue="选择设备类别"
                ></chose-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备型号">
                <span v-if="allDevice" style="paddingRight: 5px">全 部</span>
                <el-tag
                  v-else
                  style="marginRight: 5px;"
                  size="mini"
                  :key="item.deviceNo"
                  v-for="item in checkedDevice"
                >{{item.name}}</el-tag>
                <el-button type="primary" size="mini" @click="choseDevice">选择设备型号</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="要求详情">
            <el-input
              v-model="ruleForm.settleDesc"
              type="textarea"
              resize="none"
              style="width: 50%;"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-row class="fs17">要求明细</el-row>
        <el-row class="add-btn">
          <el-button type="primary" size="small" @click="handleAddRequire">添加要求</el-button>
        </el-row>
        <basic-table
          border
          :showSelect="false"
          :data="settleRequireDetailList"
          :columns="settleRequireColumns"
          :cell-style="{padding:'0px'}"
        >
          <template #forType="{ scope }">
            <span v-if="scope.row.requireType === 'photo'">照片</span>
            <span v-else-if="scope.row.requireType === 'number'">数字</span>
            <span v-else-if="scope.row.requireType === 'options'">选项</span>
            <span v-else>文本</span>
          </template>
          <template #forRequired="{ scope }">
            <span>{{scope.row.required ? '是' : '否'}}</span>
          </template>
          <template #forPostBack="{ scope }">
            <span>{{scope.row.postBack ? '是' : '否'}}</span>
          </template>
          <template #operate="{ scope }">
            <el-button type="text" @click="handleRow(scope.row, 'edit')">编辑</el-button>
            <el-button
              v-if="scope.row.requireType === 'text'"
              type="text"
              @click="handleRow(scope.row, 'check')"
            >验证规则</el-button>
            <el-button
              v-else-if="scope.row.requireType === 'option'"
              type="text"
              @click="handleRow(scope.row, 'set')"
            >选项设置</el-button>
            <el-button type="text" @click="handleRow(scope.row, 'remove')">移除</el-button>
          </template>
        </basic-table>
      </div>
    </simplebar>
    <div class="footer">
      <el-button :loading="btnLoading" size="small" type="primary" @click="handleSubmit">确 定</el-button>
      <el-button class="left" size="small" @click="handleCancel">取 消</el-button>
    </div>
    <add-device
      :columns="deviceColumns"
      :checkedColumns="deviceColumns"
      :checkedData="checkedDevice"
      :visible.sync="seeDevice"
      searchUrl="/merchant-device-rel/page"
      keyCode="deviceNo"
      :fields="fields"
      drawerTitle="添加设备"
      checkedTitle="已选设备"
      @prepare-search-params="prepareSearchParams"
      @prepare-table-data="prepareTableData"
      @confirm-checked="confirmChecked"
    >
      <template #picture="{ scope }">
        <el-image
          style="width: 50px; height: 50px"
          fit="cover"
          :preview-src-list="scope.row.imgUrls"
          :src="scope.row.imgUrl"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </template>
    </add-device>
  </div>
</template>

<script>
import { manualRemoveTab } from '@/mixins/basic'
import { rules, settleRequireColumns, deviceColumns, fields } from '../lib'
import { reqSomeCodeSelect, reqCodeSelect } from '@a/common'
import pageDialog from '@c/PageDialog/index'
import { reqMerchantDevice } from '@a/_merchant'

import BasicTable from '@c/PageTable/BasicTable'
import ChoseDialog from '@vc/ChoseDialog'
import AddDevice from '@vc/AddDrawer'
import AddRequire from './AddRequire'
import CheckRules from './CheckRules'
import SetOptions from './SetOptions'

export default {
  name: 'SettleRequireDetail',
  mixins: [manualRemoveTab],
  props: {
    type: String,
    settleCode: String
  },
  data() {
    return {
      deviceColumns,
      fields,
      btnLoading: false,
      settleRequireDetailList: [],
      loading: false,
      settleRequireColumns,
      rules,
      currentRow: {},
      ruleForm: {
        settleName: '',
        serviceCategoryCode: '1',
        merchantCode: '',
        brandCode: '',
        serviceTypeCodeList: [],
        serviceSubclassCodeList: [],
        deviceCategoryCodeList: [],
        deviceModelList: [],
        techPhone: '',
        settleDesc: '',
        enabled: true
      },
      service_category: [],
      merchant_code: [],
      brand_code: [],
      service_type: [],
      service_sub_class: [],
      category_code: [],
      checkedServiceType: [],
      checkedSubClass: [],
      checkedDeviceCategory: [],
      allDevice: false,
      checkedDevice: [],
      seeDevice: false
    }
  },
  methods: {
    async handleSubmit() {
      // const data = { ...this.ruleForm }
      // eslint-disable-next-line space-before-function-paren
      /* this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = { ...this.ruleForm }
          data.packageRelList = this.packageRelList
          if (this.type === 'add') {
            const res = await reqAddFixedPack(data)
            if (res.code === 0) {
              this.$pubsub.publish('fixedPackRefresh')
              this.$router.push('/merchant/merchant-settlerequire')
              this.handleTabRemove(this.tabs.activeName)
            }
          } else {
            this.$router.push('/merchant/merchant-settlerequire')
            this.handleTabRemove(this.tabs.activeName)
          }
        }
      }) */
    },
    async handleRow(currentRow, type) {
      if (type !== 'remove') {
        this.currentRow = currentRow
        if (type === 'edit') {
          const res = await pageDialog(AddRequire, {
            addedData: this.settleRequireDetailList,
            requireData: currentRow
          })
          if (res) {
            Object.assign(currentRow, res)
          }
        }
        if (type === 'check') {
          const res = await pageDialog(CheckRules, {
            ruleData: currentRow.validationRules ? currentRow.validationRules[0] : {}
          })
          if (res) {
            // eslint-disable-next-line require-atomic-updates
            currentRow.validationRules = [{ ...res }]
          }
        }
        if (type === 'set') {
          let flag
          if (!currentRow.optionSettings) {
            flag = false
          } else if (currentRow.hasOwnProperty('optionSettings')) {
            if (
              Array.isArray(currentRow.optionSettings.optionList) &&
              currentRow.optionSettings.optionList.length > 0
            ) {
              flag = true
            }
          }
          const res = await pageDialog(SetOptions, {
            setData: flag ? currentRow.optionSettings.optionList : []
          })
          if (res) {
            if (flag) {
              // eslint-disable-next-line require-atomic-updates
              currentRow.optionSettings.optionList = res
            } else {
              currentRow.optionSettings = { optionList: res }
            }
          }
        }
      } else {
        this.$confirm('确定移除此条结算要求？', {
          type: 'warning'
        })
          .then((_) => {
            this.settleRequireDetailList = this.settleRequireDetailList.filter(
              (item) => item.requireName !== currentRow.requireName
            )
          })
          .catch((_) => {})
      }
    },
    async handleAddRequire() {
      const res = await pageDialog(AddRequire, {
        addedData: this.settleRequireDetailList,
        requireData: {}
      })
      if (res) {
        this.settleRequireDetailList.push(res)
      }
    },
    selectChange(val, key) {
      if (this.ruleForm[key]) {
        this.$confirm(`更改${key === 'merchantCode' ? '商家' : '品牌'}已选设备类别和型号将被清空, 是否继续?`, '提示', {
          type: 'warning'
        })
          .then(() => {
            if (key === 'merchantCode') {
              this.ruleForm.brandCode = ''
            }
            if (key === 'brandCode') {
              this.ruleForm.merchantCode = ''
            }
            if (this.checkedDeviceCategory.length) {
              this.checkedDeviceCategory = []
            }
            if (this.checkedDevice.length) {
              this.checkedDevice = []
            }
          })
          .catch(() => {})
      } else {
        this.ruleForm[key] = val
      }
    },
    confirmChecked(checkedData) {
      this.checkedDevice = checkedData
      if (checkedData.length && checkedData.length === this.totalDevice) {
        this.allDevice = true
      }
    },
    choseDevice() {
      const { merchantCode, brandCode } = this.ruleForm
      const { checkedDeviceCategory } = this
      if (!merchantCode || !brandCode) {
        this.$message.warning('请先选择商家和品牌')
        return
      }
      if (checkedDeviceCategory.length === 0) {
        this.$message.warning('请先选择设备类别')
        return
      }
      this.seeDevice = true
    },
    prepareSearchParams(searchParams) {
      searchParams.categoryCodeList = this.checkedDeviceCategory.map((i) => i.value)
      searchParams.brandCode = this.ruleForm.brandCode
      searchParams.merchantCode = this.ruleForm.merchantCode
      this.getMerchantDevice()
    },
    async getMerchantDevice() {
      const params = {}
      params.categoryCodeList = this.checkedDeviceCategory.map((i) => i.value)
      params.brandCode = this.ruleForm.brandCode
      params.merchantCode = this.ruleForm.merchantCode
      const res = await reqMerchantDevice({ params })
      if (res.code === 0) {
        this.totalDevice = res.data.total
      }
    },
    handleCancel() {
      this.handleTabRemove('/merchant/merchant-settlerequire')
    },
    prepareTableData(tableData) {
      tableData.forEach((i) => {
        if (i.imgUrl) {
          i.imgUrls = i.imgUrl.split(',')
        } else {
          i.imgUrls = []
        }
      })
    },
    async getCodeSelect(codes) {
      const keyList = codes.split(',')
      const res = await reqCodeSelect(codes)
      if (res.code === 0) {
        keyList.forEach((key) => {
          this[key] = res.data[key]
        })
      }
    },
    async getSomeCodeSelect(code, grade, key) {
      const res = await reqSomeCodeSelect(code, grade)
      this[key] = res.data[code]
    }
  },
  created() {
    this.getCodeSelect('service_category,merchant_code,brand_code,service_type,category_code')
    this.getSomeCodeSelect('service_type', 3, 'service_sub_class')
  },
  components: {
    BasicTable,
    ChoseDialog,
    AddDevice
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-wrapper {
    height: calc(100% - 50px);
    .add-btn {
      line-height: 50px;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding: 15px 30px 0 0;
    /* border-top: 1px solid #dcdfe6; */
    .left {
      margin-right: 20px;
    }
  }
}
</style>
