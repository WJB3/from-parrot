<template>
  <div class="dropzone">
    <!-- 角色基本信息頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">系统管理-角色基本信息</div>
    </el-card>
    <!-- 角色基本信息表格 -->
    <el-card>
      <el-row>
        <el-col :span="18">
          <div class="btn">
            <el-button
              size="mini"
              type="danger"
              @click="handleReload"
            ><i class="el-icon-refresh iconconfig" />刷新</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addDialog"
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
              v-model="content"
              placeholder="按角色名称查询"
              style="width: 180px; margin-right: 10px"
              size="mini"
              clearable
            />
            <el-button type="primary" plain size="mini" @click="handleSearch">查询</el-button>
            <el-button type="info" plain size="mini" @click="handleReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
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
          opacity: '0.7',
        }"
      >
        <el-table-column type="selection" align="center" width="80" />
        <el-table-column
          label="序号"
          prop="id"
          align="center"
          width="80"
          type="index"
        />
        <el-table-column label="角色编码" prop="roleId" align="center" />
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="角色描述" prop="describe" align="center" />
        <el-table-column label="角色备注" prop="remark" align="center" />
        <el-table-column label="操作" align="center" width="280">
          <template>
            <el-button size="small" type="success" @click="handleJurisdiction"><i class="el-icon-menu" style="margin-right:5px;" />分配权限</el-button>
            <el-button size="small" plain class="el-icon-edit" @click="editDialog">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete"><i class="el-icon-delete iconconfig" />删除</el-button>
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
      title="新增角色信息"
      :visible.sync="dialogVisible"
      width="650px"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-tooltip effect="dark" content="角色编码只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色编码 :" style="margin-left:-52px">
              <el-input v-model="form.roleId" style="width: 180px" placeholder="(只读)角色编码" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色名称 :" prop="roleName" style="margin-left:-26px">
              <el-input v-model="form.roleName" style="width: 180px" clearable placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色描述 : " prop="describe" style="margin-left:-52px">
              <el-input v-model="form.describe" style="width: 180px" clearable placeholder="请输入角色描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色备注 :" prop="remark" style="margin-left:-26px">
              <el-input v-model="form.remark" style="width: 180px" clearable placeholder="请输入角色备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="dialogEdit"
      width="650px"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-tooltip effect="dark" content="角色编码只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色编码 :" style="margin-left:-52px">
              <el-input v-model="form.roleId" style="width: 180px" placeholder="(只读)角色编码" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色名称 :" prop="roleName" style="margin-left:-26px">
              <el-input v-model="form.roleName" style="width: 180px" clearable placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色描述 : " prop="describe" style="margin-left:-52px">
              <el-input v-model="form.describe" style="width: 180px" clearable placeholder="请输入角色描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色备注 :" prop="remark" style="margin-left:-26px">
              <el-input v-model="form.remark" style="width: 180px" clearable placeholder="请输入角色备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogEdit = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogJurisdiction"
      width="650px"
    >
      <!-- 权限树 -->
      <el-tree
        style="margin-top:-30px;"
        :data="treeData"
        :default-expand-all="true"
        :show-checkbox="true"
        node-key="menuId"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogJurisdiction = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogJurisdiction = false">确 定</el-button>
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
      dialogEdit: false, // 编辑
      dialogJurisdiction: false, // 分配权限
      content: '', // 查询input框输入的内容
      currentPage4: 4,
      total: 0,
      list: [
        {
          id: '1',
          roleId: 'JSBM001',
          roleName: 'JSMC001',
          describe: 'JSMS001',
          remark: '超级管理员'
        },
        {
          id: '2',
          roleId: 'JSBM002',
          roleName: 'JSMC002',
          describe: 'JSMS002',
          remark: '超级管理员'
        },
        {
          id: '3',
          roleId: 'JSBM003',
          roleName: 'JSMC003',
          describe: 'JSMS003',
          remark: '超级管理员'
        },
        {
          id: '4',
          roleId: 'JSBM004',
          roleName: 'JSMC004',
          describe: 'JSMS004',
          remark: '超级管理员'
        }
      ],
      treeData: [
        {
          label: '系统管理',
          children: [{
            label: '角色基本信息',
            children: [{
              label: '角色列表页面'
            }]
          }]
        }
      ],
      // 返回后端的字段
      form: {
        code: '',
        name: '',
        workshopcode: ''
      },
      // 校验
      rules: {
        // roleId: [
        //   { required: true, message: "角色编码不能为空", trigger: "blur" },
        // ],系统自动获取，不提示校验。
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '角色备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addDialog() {
      console.log('新增按钮')
      this.dialogVisible = true
    },
    handleDelete() {
      console.log('删除按钮')
    },
    editDialog() {
      console.log('编辑按钮')
      this.dialogEdit = true
    },
    handleSearch() {
      console.log('查询按钮')
    },
    handleReload() {
      console.log('刷新按钮')
    },
    handleReset() {
      console.log('重置按钮')
    },
    handleJurisdiction() {
      console.log('分配权限按钮')
      this.dialogJurisdiction = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropzone {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  .card {
    margin-top: 2px;
    .line{
    width: 2px;
    height:20px;
    background-color: rgb(47, 136, 219);
          }
    .dropzoneHeader {
      height: 5px;
      line-height: 5px;
      font-size: 16px;
      margin-left: 10px;
      margin-top: -10px;
    }
  }
  .btn {
    margin: -10px 0 10px 0;
    .iconconfig {
      margin-right: 5px;
    }
  }
  .el-pagination {
    padding: 5px 0 -5px 0;
    text-align: right;
  }
  .demo-ruleForm{
    margin-top:-20px;
  }
}
</style>
