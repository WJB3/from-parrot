<template>
  <div class="dropzone">
    <!-- 菜单管理頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">系统管理-菜单管理</div>
    </el-card>
    <!-- 菜单管理表格 -->
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
              placeholder="按一级菜单名称查询"
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
        row-key="id"
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
        <el-table-column label="菜单名称" prop="menuName" align="center" />
        <el-table-column label="组件路径" prop="src" align="center" />
        <el-table-column label="菜单类型" prop="type" align="center" />
        <el-table-column label="图标" prop="icon" align="center" />
        <el-table-column label="操作" align="center" width="200">
          <template>
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
      title="新增菜单"
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
        <el-tooltip effect="dark" content="菜单编号只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;right:304px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顶级菜单 :" prop="parentid" style="margin-left:-52px">
              <el-select
                v-model="form.parentid"
                placeholder="请选择顶级菜单"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="菜单编号 :" prop="menuid" style="margin-left:-52px">
              <el-input v-model="form.menuid" style="width: 180px" readonly placeholder="(只读)菜单编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称 : " prop="menuName" style="margin-left:-52px">
              <el-input v-model="form.menuName" style="width: 180px" clearable placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单地址 : " prop="src" style="margin-left:-52px">
              <el-input v-model="form.src" style="width: 180px" clearable placeholder="请填写菜单地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图标 : " prop="icon" style="margin-left:-52px">
              <el-input v-model="form.icon" style="width: 180px" clearable placeholder="请输入菜单图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型 : " prop="type" style="margin-left:-52px">
              <el-select
                v-model="form.type"
                placeholder="请选择菜单类型"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item label="创建人 : " prop="createrId" style="margin-left:-52px">
              <el-input v-model="form.createrId" style="width: 100%" clearable placeholder="请输入创建人" />
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
      title="编辑菜单"
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
        <el-tooltip effect="dark" content="菜单编号只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;right:304px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顶级菜单 :" prop="parentid" style="margin-left:-52px">
              <el-select
                v-model="form.parentid"
                placeholder="请选择顶级菜单"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="菜单编号 :" prop="menuid" style="margin-left:-52px">
              <el-input v-model="form.menuid" style="width: 180px" readonly placeholder="(只读)菜单编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称 : " prop="menuName" style="margin-left:-52px">
              <el-input v-model="form.menuName" style="width: 180px" clearable placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单地址 : " prop="src" style="margin-left:-52px">
              <el-input v-model="form.src" style="width: 180px" clearable placeholder="请填写菜单地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图标 : " prop="icon" style="margin-left:-52px">
              <el-input v-model="form.icon" style="width: 180px" clearable placeholder="请输入菜单图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型 : " prop="type" style="margin-left:-52px">
              <el-select
                v-model="form.type"
                placeholder="请选择菜单类型"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item label="创建人 : " prop="createrId" style="margin-left:-52px">
              <el-input v-model="form.createrId" style="width: 100%" clearable placeholder="请输入创建人" />
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
  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogVisible: false, // 新增
      dialogEdit: false, // 编辑
      content: '', // 查询input框输入的内容
      currentPage4: 4,
      total: 0,
      list: [
        {
          id: '1',
          menuName: '菜单名称001',
          src: '组件路径001',
          type: '菜单类型001',
          icon: '图标1'
        },
        {
          id: '2',
          menuName: '菜单名称002',
          src: '组件路径002',
          type: '菜单类型002',
          icon: '图标2'
        },
        {
          id: '3',
          menuName: '菜单名称003',
          src: '组件路径003',
          type: '菜单类型003',
          icon: '图标3'
        },
        {
          id: '4',
          menuName: '菜单名称004',
          src: '组件路径004',
          type: '菜单类型004',
          icon: '图标4'
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
        // menuid: [
        //   { required: true, message: "菜单编号不能为空", trigger: "blur" },
        // ],系统自动获取，不提示校验。
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        src: [
          { required: true, message: '菜单地址不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '菜单图标不能为空', trigger: 'blur' }
        ],
        createrId: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
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
