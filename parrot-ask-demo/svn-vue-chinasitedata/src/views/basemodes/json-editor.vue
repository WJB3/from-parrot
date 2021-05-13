<template>
  <div class="shiftsetting">
    <!-- 工厂基本信息頭部 -->
    <el-card>
      <div class="line"></div>
      <div class="shiftHeader">
        工厂基本信息
      </div>
    </el-card>
    <!-- 工厂基本信息  表格区域 -->
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
              placeholder="按工厂名称查询"
              style="width:180px;margin-right:10px;"
              clearable
              v-model="params.Name"
              size="mini"
            />
            <el-button type="primary" plain size="mini"
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
        :data="list"
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
        <el-table-column
          label="序号"
          align="center"
          width="80"
          type="index"
          prop="id"
        >
        </el-table-column>
        <el-table-column prop="code" label="工厂编码" align="center">
        </el-table-column>
        <el-table-column prop="name" label="工厂名称" align="center">
        </el-table-column>
        <el-table-column prop="address" label="工厂地址" align="center">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="工厂电话"
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
      :title="id ? '编辑工厂信息' : '新增工厂信息'"
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
          content="工厂编码编码只读（系统自动获取）"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="color:orange;font-size:18px;position:absolute;top:65px;left:38px;"
          ></i>
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工厂编码 :" class="shift">
              <el-input
                v-model="form.code"
                placeholder="请输入工厂编码"
                readonly
                style="width:180px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工厂名称 :" prop="name" class="shift">
              <el-input
                clearable
                v-model="form.name"
                placeholder="请输入工厂名称"
                style="width:180px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 工厂地址 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工厂电话 :" prop="telephone">
              <el-input
                placeholder="请输入工厂电话"
                clearable
                v-model="form.telephone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 工厂地址 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工厂地址 :" prop="address">
              <el-input
                placeholder="请输入工厂地址"
                clearable
                type="textarea"
                v-model="form.address"
              ></el-input>
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
          { required: true, message: "工厂名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "工厂编码不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "工厂地址不能为空", trigger: "blur" }
        ],
        telephone: [{ validator: this.validataTel, required: true, trigger: "blur" }]
      },
      form: {
        name: "",
        code: "",
        address: "",
        telephone: "",
        esignoff: 1,
        edatasources: 1
      },
      params: {
        pageIndex: 1,
        pageSize: 10,
        Code: "",
        Name: ""
      },
      dialogVisible: false,
      list: [],
      total: 0,
      currentPage4: 4,
      ruleForm: "",
      id: ""
    };
  },
  methods: {
    //表单验证
    validataTel(rele, value, callback) {
      if (value === "") {
        callback(new Error("工厂电话不能为空"));
      } else {
        if (!value == "") {
          let reg = /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的号码"));
          }
        }
      }
    },
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
      // this.$refs.form.resetFields()
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
