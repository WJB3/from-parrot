<template>
  <div class="dropzone">
    <!-- 产线信息管理頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">产线信息管理</div>
    </el-card>
    <!-- 产线信息管理表格 -->
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
              placeholder="按产线名称查询"
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
        <el-table-column label="产线编号" prop="code" align="center" />
        <el-table-column label="产线名称" prop="name" align="center" />
        <el-table-column label="车间编码" prop="workShopName" align="center" />
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
      title="新增产线信息"
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
        <el-tooltip effect="dark" content="产线编号只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产线编号 :" style="margin-left:-52px">
              <el-input v-model="form.code" style="width: 180px" placeholder="(只读)产线编号" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产线名称 :" prop="name" style="margin-left:-26px">
              <el-input v-model="form.name" style="width: 180px" clearable placeholder="请输入产线名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车间编码 : " prop="workshopcode" style="margin-left:-52px">
              <el-select
                v-model="form.workshopcode"
                placeholder="请选择车间编码"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
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
      title="编辑产线信息"
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
        <el-tooltip effect="dark" content="产线编号只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产线编号 :" prop="code" style="margin-left:-52px">
              <el-input v-model="form.code" style="width: 180px" placeholder="(只读)产线编号" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产线名称 :" prop="name" style="margin-left:-26px">
              <el-input v-model="form.name" style="width: 180px" placeholder="请填写产线名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车间编码 : " prop="workshopcode" style="margin-left:-52px">
              <el-select
                v-model="form.workshopcode"
                placeholder="请选择车间编码"
                style="width: 180px"
              >
                <el-option label="区域一" value="shanghai" />
              </el-select>
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
          code: 'CXBH001',
          name: 'CXMC001',
          workShopName: 'CJBM001'
        },
        {
          id: '2',
          code: 'CXBH002',
          name: 'CXMC002',
          workShopName: 'CJBM002'
        },
        {
          id: '3',
          code: 'CXBH003',
          name: 'CXMC003',
          workShopName: 'CJBM003'
        },
        {
          id: '4',
          code: 'CXBH004',
          name: 'CXMC004',
          workShopName: 'CJBM004'
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
        // code: [
        //   { required: true, message: "产线编号不能为空", trigger: "blur" },
        // ],系统自动获取，不提示校验。
        name: [
          { required: true, message: '产线名称不能为空', trigger: 'blur' }
        ],
        workshopcode: [
          { required: true, message: '车间编码不能为空', trigger: 'blur' }
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
    margin-bottom: 2px;
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
