<template>
  <el-dialog :visible.sync="dialogVisible" title="选项设置" width="500px">
    <el-form class="max350" ref="form" label-width="100px" size="medium">
      <el-form-item required :label="`选项${index + 1}`" v-for="(item, index) in setList" :key="index">
        <el-input class="w300" v-model.trim="item.value"></el-input>
      </el-form-item>
      <el-button class="w100f" size="medium" @click="addSet" plain>+添加选项</el-button>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    setData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      setList: []
    }
  },
  watch: {
    setData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.length) {
          this.setList = val.map((item, index) => {
            const temp = {}
            temp.key = index
            temp.value = item
            return temp
          })
        } else {
          this.setList.push({
            key: 1,
            value: ''
          })
        }
      }
    }
  },
  methods: {
    addSet() {
      if (this.setList.some(i => i.value === '')) {
        this.$message.warning('请填写完整后再添加新选项!')
        return
      }
      const setItem = { value: '' }
      setItem.key = this.setList.length
      this.setList.push(setItem)
    },
    cancel() {
      this.$emit('resolve', false)
    },
    confirm() {
      if (this.setList.some(i => i.value === '')) {
        this.$message.warning('请填写完整!')
        return
      }
      const res = this.setList.map(item => item.value)
      this.$emit('resolve', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form .el-form-item:last-child {
  margin-bottom: 0px !important;
}
::v-deep .el-dialog__body {
  padding: 20px 20px 10px 20px;
}
.max350 {
  max-height: 350px;
}
</style>
