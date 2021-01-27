<template>
  <div class="allocation-detail" ref="wrapper">
    <div class="operation-bar">
      <span>
        <template v-if="outboundInfo.state === 0">
          <el-button size="small" type="primary" @click="outboundDelivery">出库</el-button>
        </template>
        <template v-if="outboundInfo.state === 10">
          <el-button size="small" type="primary">审核</el-button>
        </template>
        <template>
          <el-button size="small" type="primary">打印</el-button>
        </template>
      </span>
      <el-tag :type="tagType">{{outboundInfo.state_t}}</el-tag>
    </div>
    <el-scrollbar :style="{ height: wrapperHeight }">
      <div class="pr10">
        <el-row class="f17">出库单信息</el-row>
        <el-form size="small" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="出库单号">
                <el-input disabled :value="outboundInfo.outboundNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关联单据">
                <el-input disabled :value="outboundInfo.relatedNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出库类型">
                <el-input disabled :value="outboundInfo.outboundType_t"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出库仓库" prop="warehouseCode">
                <el-input disabled :value="outboundInfo.warehouseCode_t"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人">
                <el-input disabled :value="outboundInfo.linkman"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话">
                <el-input disabled :value="outboundInfo.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流公司">
                <el-input disabled :value="outboundInfo.logisticsCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流单号">
                <el-input disabled :value="outboundInfo.logisticsNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="收货地址">
                <el-input disabled :value="outboundInfo.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="备注">
                <el-input
                  disabled
                  :value="outboundInfo.remark"
                  type="textarea"
                  maxlength="500"
                  resize="none"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="f17">出库单明细</el-row>
        <el-form :inline="true" class="number-form">
          <el-form-item
            label="出库总数:"
          >{{outboundInfo.quantity | parseCurrency({ symbol: '', precision: 2 })}}</el-form-item>
          <el-form-item
            label="出库总金额:"
          >{{outboundInfo.amount | parseCurrency({ symbol: '', precision: 2 })}}</el-form-item>
        </el-form>
        <common-table
          :max-height="500"
          :data="outboundRelList"
          :columns="columns"
          :showTableSelection="false"
        >
          <template #forGoodQuantity="{ scope }">
            <span>{{scope.row._goodQuantity}}</span>
          </template>
          <template #forOldQuantity="{ scope }">
            <span>{{scope.row._oldQuantity}}</span>
          </template>
          <template #forBadQuantity="{ scope }">
            <span>{{scope.row._badQuantity}}</span>
          </template>
          <template #forQuantity="{ scope }">
            <span>{{scope.row.quantity}}</span>
          </template>
          <template #forPrice="{ scope }">
            <span>{{scope.row._price}}</span>
          </template>
          <template
            #forCode="{ scope }"
          >{{scope.row.classifyCode_t ? scope.row.classifyCode_t : scope.row.categoryCode_t}}</template>
        </common-table>
        <step-table ref="stepTable" :orderNo="outboundNo" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import pageDialog from '@c/PageDialog/index'
import { transformColumns } from '@/utils'
import { outboundRelColumns } from '../lib'
import CommonTable from '@c/PageTable/CommonTable'
import StepTable from '@c/PageTable/StepTable'
import Audit from '@vc/dialogPage/Audit'
import { outboundDetail, outboundAudit } from '@a/_warehouse'

export default {
  props: {
    type: String,
    outboundNo: String
  },
  data() {
    return {
      columns: [],
      wrapperHeight: '100%',
      outboundInfo: {},
      outboundRelList: []
    }
  },
  computed: {
    isINFO() {
      return this.type === this.$global.TYPE.INFO
    },
    tagType() {
      const state = this.outboundInfo.state
      if (state === 100) {
        return 'success'
      } else if (state === 10) {
        return 'danger'
      } else {
        return 'info'
      }
    }
  },
  methods: {
    async allocationAudit() {
      const { dataId, dataType, executionId, processDefinitionKey, taskDefinitionKey, taskId } = this.outboundInfo
      const res = await pageDialog(Audit, {
        auditData: { dataId, dataType, executionId, processDefinitionKey, taskDefinitionKey, taskId, finished: true },
        httpRequest: outboundAudit
      })
      if (res.code === 0) {
        this.outboundDetail()
        this.$refs.stepTable.getOperations()
      }
    },
    outboundDelivery() {
      this.$router.push({ name: 'OutboundAdd', params: { type: this.$global.TYPE.DELIVERY, id: this.outboundNo } })
    },
    inintColumns() {
      let delProps = []
      if (
        this.outboundInfo.outboundType === 8 ||
        this.outboundInfo.outboundType === 9 ||
        this.outboundInfo.outboundType === 10
      ) {
        delProps = ['goodPlanQuantity', 'oldPlanQuantity', 'badPlanQuantity', 'planQuantity', 'quantity']
      }
      if (this.outboundInfo.outboundType === 11) {
        delProps = [
          '_goodQuantity',
          'goodPlanQuantity',
          '_oldQuantity',
          'oldPlanQuantity',
          '_badQuantity',
          'badPlanQuantity'
        ]
      }
      if (this.outboundInfo.outboundType === 12) {
        delProps = ['_oldQuantity', 'oldPlanQuantity', 'planQuantity', 'quantity']
      }
      if (this.outboundInfo.outboundType === 13) {
        delProps = ['_badQuantity', 'badPlanQuantity', 'planQuantity', 'quantity']
      }
      const columns = transformColumns(delProps, outboundRelColumns)
      this.columns = columns.slice(0, -1)
    },
    async outboundDetail() {
      const res = await outboundDetail({ place: [this.outboundNo] })
      if (res.code === 0) {
        this.outboundInfo = res.data
        res.data.outboundRelVOList &&
          res.data.outboundRelVOList.forEach((i) => {
            i._goodQuantity = i.goodQuantity
            i._oldQuantity = i.oldQuantity
            i._badQuantity = i.badQuantity
            i._price = i.price
            if (res.data.outboundType === 11) {
              i.planQuantity = i.goodPlanQuantity
              i.quantity = i.goodQuantity
            }
          })
        this.outboundRelList = res.data.outboundRelVOList
        this.inintColumns()
      }
    }
  },
  created() {
    this.outboundDetail()
  },
  mounted() {
    const { height } = this.$refs.wrapper.getBoundingClientRect()
    this.wrapperHeight = `${height - 40}px`
  },
  activated() {
    this.outboundDetail()
    this.$refs.stepTable.getOperations()
  },
  components: {
    CommonTable,
    StepTable
  }
}
</script>

<style lang="scss" scoped>
.allocation-detail {
  height: 100%;
  .operation-bar {
    display: flex;
    justify-content: space-between;
  }
  .number-form {
    color: red;
    ::v-deep .el-form-item__content {
      font-size: 15px;
      font-weight: 700;
      opacity: 0.8;
    }
  }
}
.pr10 {
  padding-right: 10px;
}
::v-deep .el-table th,
.el-table td {
  padding: 5px 0;
  font-size: 12px;
}
::v-deep .el-table .cell {
  padding: 0 2px;
}
</style>
