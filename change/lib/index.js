export const deviceColumns = [{
  label: '编码',
  prop: 'deviceNo'
},
{
  label: '厂家编码1',
  prop: 'factoryCode1'
},
{
  label: '厂家编码2',
  prop: 'factoryCode2'
},
{
  label: '名称',
  prop: 'name',
  // couldEdit: true
},
{
  label: '型号',
  prop: 'model'
},
{
  label: '品牌',
  prop: 'brandCode_t'
},
{
  label: '类别',
  prop: 'categoryCode_t'
},
{
  label: '服务品类',
  prop: 'serviceCategoryCode_t'
},
{
  label: '单位',
  prop: 'unitCode_t'
},
{
  label: '售价(元)',
  prop: 'price'
},
{
  label: '状态',
  prop: 'enabled_t'
}]

export const fields = [
  {
    label: '设备名称',
    key: 'name',
    type: 'el-input',
    options: [],
    props: {}
  },
  {
    label: '型号',
    key: 'model',
    type: 'el-input',
    options: [],
    props: {}
  },
  {
    label: '厂家编码',
    key: 'factoryCode',
    type: 'el-input',
    options: [],
    props: {}
  },
  {
    label: '品牌',
    key: 'brandCode',
    type: 'simple-select',
    // options: [],
    props: {
      'dict-key': 'brand_code'
    }
  },
  {
    label: '类别',
    key: 'categoryCode',
    type: 'simple-select',
    options: [],
    props: {
      'dict-key': 'category_code'
    }
  },
]
