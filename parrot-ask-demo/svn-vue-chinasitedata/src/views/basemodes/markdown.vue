<template>
  <div class="shiftsetting">
    <!-- 角色基本信息頭部 -->
    <el-card>
      <div class="line" />
      <div class="shiftHeader">
        角色基本信息
      </div>
    </el-card>
    <!-- 角色基本信息  表格区域 -->
    <el-card>
      <!-- 表格 -->
      <!-- btn-table -->
      <el-row>
        <el-col :span="18">
          <div class="btn">
            <el-button
              size="mini"
              type="danger"
              @click="handleReload(1)"
            ><i class="el-icon-refresh iconconfig" />刷新</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="add"
            ><i class="el-icon-plus iconconfig" />新增</el-button>
            <el-button
              size="mini"
              type="success"
            ><i class="el-icon-male iconconfig" />导出</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="btn">
            <el-input
              v-model="params.Name"
              placeholder="按角色名称查询"
              clearable
              style="width:180px;margin-right:10px;"
              size="mini"
            />
            <el-button type="primary" plain size="mini">查询</el-button>
            <el-button
              type="info"
              plain
              size="mini"
              @click="handleReload(1)"
            >重置</el-button>
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
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="序号" align="center" width="80" type="index" />
        <el-table-column prop="roleId" label="角色编码" align="center" />
        <el-table-column prop="roleName" label="角色名称" align="center" />
        <el-table-column prop="describe" label="角色描述" align="center" />
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="isStar"
          label="是否启用"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column label="操作" align="center" width="300">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              class=""
              @click="handlePession(scope.row.id)"
            ><i class="el-icon-menu" style="margin-right:5px;" />分配权限</el-button>
            <el-button
              size="small"
              class="el-icon-edit"
              @click="handleCreate(2, scope.row)"
            >编辑</el-button>

            <el-popconfirm
              title="确定刪除该条记录？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">
                  <i class="el-icon-delete iconconfig" />删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增对话框 -->
    <el-dialog
      :title="id ? '编辑角色信息' : '新增角色信息'"
      :visible.sync="dialogVisible"
      width="650px"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-positioin="right"
        label-width="115px"
        class="shiftdisalog"
      >
        <el-tooltip
          effect="dark"
          content="角色编码只读（系统自动获取）"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="color:orange;font-size:18px;position:absolute;top:65px;left:38px;"
          />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色编码 :" class="shift">
              <el-input
                v-model="form.shiftCode"
                readonly
                style="width:180px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色名称 :" prop="shiftName" class="shift">
              <el-input
                v-model="form.shiftName"
                clearable
                placeholder="请输入角色名称"
                style="width:180px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 人员，工厂编码 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色描述 :" prop="remark">
              <el-input
                v-model="form.remark"
                clearable
                placeholder="请输入角色描述"
                style="width:180px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用:" prop="shiftCode">
              <el-radio v-model="form.start" label="0">是</el-radio>
              <el-radio v-model="form.start" label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 车间，产线编码-->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色备注 :" prop="describe">
              <el-input
                v-model="form.describe"
                clearable
                type="textarea"
                placeholder="请输入角色备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="cancel()">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="shiftAdd()"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 新增
      form: {
        shiftCode: '',
        shiftName: '',
        remark: '',
        start: 0,
        describe: '',
        skilllevelno: []
      },
      ruleForm: '',
      total: 0,
      currentPage4: 4,
      params: {
        pageIndex: 1,
        pageSize: 10,
        Code: '',
        Name: ''
      },
      roleName: '',
      rules: {
        shiftCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ],
        shiftName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ],
        describe: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      tableData: [],
      index: 1,
      id: ''
    }
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
}
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
