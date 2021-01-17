<template>
  <div class="wrapper">
    <simplebar class="content-wrapper">
      <el-row class="title">基础信息</el-row>
      <el-form
        ref="form"
        :model="ruleForm"
        class="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="settleName">
              <el-input v-model.trim="ruleForm.settleName" class="w300"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务品类" prop="serviceCategoryCode">
              <el-select
                :popper-append-to-body="false"
                v-model="ruleForm.serviceCategoryCode"
                filterable
                placeholder="服务品类"
                class="w300"
              >
                <el-option
                  v-for="item in service_category"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="merchantCode">
              <el-select
                :popper-append-to-body="false"
                v-model="ruleForm.merchantCode"
                filterable
                placeholder="商家名称"
                class="w300"
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
          <el-col :span="12">
            <el-form-item label="品牌" prop="brandCode">
              <el-select
                :popper-append-to-body="false"
                v-model="ruleForm.brandCode"
                filterable
                placeholder="品牌"
                class="w300"
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
              <el-button type="primary" size="mini" @click="seeDevice = true">选择设备型号</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="技术支持电话" prop="techPhone">
          <el-input v-model="ruleForm.techPhone" class="w300"></el-input>
        </el-form-item>
        <el-form-item label="要求详情">
          <el-input v-model="ruleForm.settleDesc" type="textarea" resize="none" style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="ruleForm.enabled" :label="true">启用</el-radio>
          <el-radio v-model="ruleForm.enabled" :label="false">禁用</el-radio>
        </el-form-item>
      </el-form>
      <el-row class="title">要求明细</el-row>
      <div style="marginTop: 10px;">
        <el-form inline size="small">
          <el-form-item>
            <el-button type="primary" size="small">添加要求</el-button>
          </el-form-item>
        </el-form>
        <basic-table
          height="100%"
          border
          :showSelect="false"
          :data="settleRequireDetailList"
          :loading="loading"
          :columns="columns"
          :cell-style="{padding:'0px'}"
        >
          <template #operate="{ scope }">
            <el-button
              type="text"
              @click="handleRemove(scope.row.materialNo, scope.row.showEdit)"
            >移除</el-button>
          </template>
        </basic-table>
      </div>
    </simplebar>
    <div class="footer">
      <el-button :loading="btnLoading" size="small" type="primary" @click="handleSubmit">确 定</el-button>
      <el-button class="left" size="small" @click="handleTabRemove">取 消</el-button>
    </div>
    <add-grid
      :columns="deviceColumns"
      :checkedColumns="deviceColumns"
      :checkedData="checkedDevice"
      :visible.sync="seeDevice"
      searchApi="seeDevice"
      :searchParams="searchParams"
      keyCode="deviceNo"
      :fields="fields"
      @prepare-table-data="test"
    >
      <!-- <template slot="visibleConditions">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="searchParams.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="searchParams.model" placeholder></el-input>
        </el-form-item>
        <el-form-item label="厂家编码">
          <el-input v-model="searchParams.factoryCode" placeholder></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="品牌">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.brandCode"
            clearable
            placeholder="品牌"
          >
            <el-option
              v-for="item in brand_code"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
      <!-- </template> -->
      <!-- <template slot="hiddenConditions">
        <el-form-item label="类别">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.categoryCode"
            clearable
            placeholder="类别"
          >
            <el-option
              v-for="item in category_code"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="searchParams.deviceNo" placeholder></el-input>
        </el-form-item>
        <el-form-item label="服务品类">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.serviceCategoryCode"
            clearable
            placeholder="服务品类"
          >
            <el-option
              v-for="item in service_category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属机构">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.orgCode"
            clearable
            placeholder="归属机构"
          >
            <el-option
              v-for="item in org_code"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BOM">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.bomVindicate"
            clearable
            placeholder="BOM"
          >
            <el-option
              v-for="item in bom_vindicate"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            :popper-append-to-body="false"
            v-model="searchParams.enabled"
            clearable
            placeholder="状态"
          >
            <el-option
              v-for="item in enabled"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDate"
          ></el-date-picker>
        </el-form-item>
      </template>-->
    </add-grid>
  </div>
</template>

<script>
import { manualRemoveTab } from '@/mixins/basic'
import { rules, materialFixedColumns } from '../lib'
import { deviceColumns, fields } from './lib'
import { reqSomeCodeSelect, reqCodeSelect } from '@a/common'
import { get } from '@a/_request'

import BasicTable from '@c/PageTable/BasicTable'
import ChoseDialog from '@vc/ChoseDialog'
import AddGrid from './AddGrid'

export default {
  name: 'SettleRequireDetail',
  mixins: [manualRemoveTab],
  props: {
    type: {
      type: String
    },
    settleCode: {
      type: String
    }
  },
  data() {
    return {
      deviceColumns,
      fields,
      btnLoading: false,
      settleRequireDetailList: [],
      loading: false,
      columns: materialFixedColumns,
      rules,
      ruleForm: {
        settleName: '',
        serviceCategoryCode: '',
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
      checkedDevice: [
        {
          deviceNo: 'DE00003192'
        }
      ],
      seeDevice: false,
      searchParams: {}
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
    test(data) {
      // console.log(data);
    },
    /* handleCancel() {
      this.$router.push(this.whereFrom)
      this.handleTabRemove(this.tabs.activeName)
    }, */
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
  /* beforeRouteEnter(to, from, next) {
    const { path } = from
    console.log(from)
    next((vm) => {
      vm.whereFrom = path ? path : '/'
      console.log(vm)
    })
  }, */
  components: {
    BasicTable,
    ChoseDialog,
    AddGrid
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
  .title {
    font-size: 17px;
  }
}
</style>
