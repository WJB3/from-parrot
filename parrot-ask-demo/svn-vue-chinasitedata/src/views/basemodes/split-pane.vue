<template>
  <div class="shiftsetting">
    <!-- 车间基本信息頭部 -->
    <el-card>
      <div class="line"></div>
      <div class="shiftHeader">
        车间基本信息
      </div>
    </el-card>
    <!-- 车间基本信息  表格区域 -->
    <el-card>
      <!-- 表格 -->
      <!-- btn-table -->
      <el-row>
        <el-col :span="18">
          <div class="btn">
            <el-button size="mini" type="danger" @click="handleReload(1)"
              ><i class="el-icon-refresh iconconfig"></i>刷新</el-button
            >
            <el-button size="mini" type="primary" @click="add"
              ><i class="el-icon-plus iconconfig"></i>新增</el-button
            >
            <el-button size="mini" type="success"
              ><i class="el-icon-male iconconfig"></i>导出</el-button
            >
          </div>
        </el-col>
        <el-col :span="6">
          <div class="btn">
            <el-input
              placeholder="按车间名称查询"
              style="width:180px;margin-right:10px;"
              clearable
              v-model="params.Name"
              size="mini"
            />
            <el-button type="primary" plain size="mini" @click="handleSearch"
              >查询</el-button
            >
            <el-button type="info" plain size="mini" @click="handleReload(1)"
              >重置</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table
        highlight-current-row
        :data="tableData"
        stripe
        border
        size="mini"
        show-overflow-tooltip
        tooltip-effect="dark"
        :header-cell-style="{
          background: 'rgba(214, 234, 255,.8)',
          color: '#000',
          opacity: '0.7'
        }"
      >
        <el-table-column type="selection" width="80" align="center">
        </el-table-column>
        <el-table-column label="序号" align="center" width="80" type="index">
        </el-table-column>
        <el-table-column prop="code" label="车间编码" align="center">
        </el-table-column>
        <el-table-column prop="name" label="车间名称" align="center">
        </el-table-column>
        <el-table-column prop="address" label="车间地址" align="center">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="车间电话"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="factoryName"
          label="工厂名称"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button
              size="small"
              class="el-icon-edit"
              @click="handleCreate(2, scope.row)"
              >编辑</el-button
            >

            <el-popconfirm
              title="确定刪除该条记录？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">
                  <i class="el-icon-delete iconconfig"></i>删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 新增对话框 -->
    <el-dialog
      :title="id ? '编辑车间信息管理' : '新增车间信息管理'"
      :visible.sync="dialogVisible"
      width="650px"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        ref="ruleForm"
        label-positioin="right"
        label-width="115px"
        class="shiftdisalog"
      >
        <el-tooltip
          effect="dark"
          content="车间编码只读（系统自动获取）"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="color:orange;font-size:18px;position:absolute;top:65px;right:278px;"
          ></i>
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车间名称 :" prop="name" class="shift">
              <el-input
                clearable
                v-model="form.name"
                placeholder="请输入车间名称"
                style="width:180px;"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="车间编码 :" class="shift">
              <el-input
                v-model="form.code"
                placeholder="请输入车间编码"
                readonly
                style="width:180px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 车间电话，工厂编码 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据来源:">
              <el-select
                v-model="form.edatasources.Value"
                placeholder="数据来源"
              >
                <el-option
                  v-for="(item, index) in form.edatasources"
                  :key="index"
                  :label="item.Text"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工厂名称 :">
              <el-select
                v-model="form.factoryname.code"
                placeholder="请选择工厂名称"
              >
                <el-option
                  v-for="(item, index) in form.factoryname"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 工厂地址 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车间地址 :" prop="address">
              <el-input
                clearable
                placeholder="请输入车间地址"
                v-model="form.address"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间电话 :" prop="telephone">
              <el-input
                clearable
                placeholder="请输入车间电话"
                v-model="form.telephone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="签核状态:">
              <el-radio-group v-model="form.esignoff">
                <el-radio label="0">未签核</el-radio>
                <el-radio label="1">签核中</el-radio>
                <el-radio label="2">已签核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel" size="small">取 消</el-button>
          <el-button type="primary" @click="shiftAdd()" size="small"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "车间名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "车间编码不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "车间地址不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "车间电话不能为空", trigger: "blur" }
        ],
        plant: [
          { required: true, message: "工厂名称不能为空", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      form: {
        name: "",
        code: "",
        address: "",
        telephone: "",
        factoryname: "",
        esignoff: "0",
        edatasources: "0"
      },
      tableData: [],
      currentPage4: 4,
      total: 0,
      id: "",
      ruleForm: "",
      params: {
        pageIndex: 1,
        pageSize: 10,
        Code: "",
        Name: ""
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 关闭dialog
    handleClose(done) {
      done()
      // this.$refs.form.resetFields()
    },
    // 取消dialog
    cancel() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // dialog确定
    shiftAdd() {
      this.dialogVisible = false
    },
    add() {
      this.dialogVisible = true
    }
  }
};
</script>

<style lang="scss" scoped>
.shiftsetting {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  //分页
  .el-pagination {
    padding: 5px 0 -5px 0;
    text-align: right;
  }
  .el-card {
    margin-top: 2px;
  }
  .iconconfig {
    margin-right: 5px;
  }
  //头部
  .shiftHeader {
    height: 5px;
    line-height: 5px;
    font-size: 16px;
    margin-left: 10px;
    margin-top: -10px;
  }
  .btn {
    margin: -10px 0 10px 0;
  }
  .shiftdisalog .shift {
    margin-top: -20px;
  }
}
</style>
