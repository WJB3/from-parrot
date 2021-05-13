<template>
  <div class="dropzone">
    <!-- 生产班组管理頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">生产班组管理</div>
    </el-card>
    <!-- 生产班组管理表格 -->
    <el-card>
      <el-row>
        <el-col :span="18">
          <div class="btn">
            <el-button size="mini" type="danger" @click="handleReload">
              <i class="el-icon-refresh iconconfig" />刷新</el-button>
            <el-button size="mini" type="primary" @click="addDialog">
              <i class="el-icon-plus iconconfig" />新增</el-button>
            <el-button size="mini" type="success">
              <i class="el-icon-male iconconfig" />导出</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="btn">
            <el-input
              v-model="content"
              placeholder="按班组名称查询"
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
        <el-table-column label="班组名称" prop="name" align="center" />
        <el-table-column label="班组编号" prop="code" align="center" />
        <el-table-column
          label="班组负责人"
          prop="teamPrincipal"
          align="center"
        />
        <el-table-column label="班组负责人电话" prop="phone" align="center" />
        <el-table-column label="当班人数" prop="personCount" align="center" />
        <el-table-column label="班组人员" prop="person" align="center">
          <template>
            <el-button size="mini" @click="details">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="equipmentName" align="center" />
        <el-table-column label="班次" prop="skillName" align="center" />
        <el-table-column
          label="创建时间"
          prop="createtime"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="200">
          <template>
            <el-button size="small" plainclass="el-icon-edit" @click="editDialog">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete">
              <i class="el-icon-delete iconconfig" />删除</el-button>
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
    <el-dialog title="新增班组信息" :visible.sync="dialogVisible" width="670px">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="170px"
        class="demo-ruleForm"
      >
        <el-tooltip
          effect="dark"
          content="班组编号只读（系统自动获取）"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="
              color: orange;
              font-size: 18px;
              position: absolute;
              top: 64px;
              right: 290px;
            "
          />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="班组名称 :"
              prop="name"
              style="margin-left: -70px"
            >
              <el-input v-model="form.name" style="width: 180px" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="班组编号 :" style="margin-left: -58px">
              <el-input
                v-model="form.code"
                style="width: 180px"
                placeholder="(只读)班组编号"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="班组负责人 :"
              prop="teamPrincipal"
              style="margin-left: -70px"
            >
              <el-input
                v-model="form.teamPrincipal"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="负责人电话 : "
              prop="phone"
              style="margin-left: -58px"
            >
              <el-input v-model="form.phone" style="width: 180px" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="最多成员数 :"
              prop="person"
              style="margin-left: -70px"
            >
              <el-input v-model="form.person" style="width: 180px" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工作类型 : "
              prop="workingtype"
              style="margin-left: -58px"
            >
              <el-select
                v-model="form.workingtype"
                placeholder="请选择工作类型"
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
    <el-dialog title="编辑班组信息" :visible.sync="dialogEdit" width="670px">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="170px"
        class="demo-ruleForm"
      >
        <el-tooltip
          effect="dark"
          content="班组编号只读（系统自动获取）"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="
              color: orange;
              font-size: 18px;
              position: absolute;
              top: 64px;
              right: 290px;
            "
          />
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="班组名称 :"
              prop="name"
              style="margin-left: -70px"
            >
              <el-input v-model="form.name" style="width: 180px" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="班组编号 :" style="margin-left: -58px">
              <el-input
                v-model="form.code"
                style="width: 180px"
                placeholder="(只读)班组编号"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="班组负责人 :"
              prop="teamPrincipal"
              style="margin-left: -70px"
            >
              <el-input
                v-model="form.teamPrincipal"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="负责人电话 : "
              prop="phone"
              style="margin-left: -58px"
            >
              <el-input v-model="form.phone" style="width: 180px" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="最多成员数 :"
              prop="person"
              style="margin-left: -70px"
            >
              <el-input v-model="form.person" style="width: 180px" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工作类型 : "
              prop="workingtype"
              style="margin-left: -58px"
            >
              <el-select
                v-model="form.workingtype"
                placeholder="请选择工作类型"
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
    <!-- 查看详情对话框 -->
    <el-dialog title="查看班组人员" :visible.sync="dialogDetails" width="670px">
      <el-row>
        <el-col :span="18">
          <div class="btn" style="margin-top:-20px">
            <el-input placeholder="按姓名查询" style="width:180px;margin-right:10px;" size="mini" clearable />
            <el-button type="primary" plain size="mini" @click="detailsSearch">查询</el-button>
            <el-button type="info" plain size="mini" @click="detailsReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table
        highlight-current-row
        :data="detailslist"
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
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column prop="id" label="序号" align="center" width="80" type="index" />
        <el-table-column prop="userid" label="用户名" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="tel" label="电话" align="center" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogDetails = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogDetails = false">确 定</el-button>
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
      dialogDetails: false,
      currentPage4: 4,
      total: 0,
      list: [
        {
          id: '1',
          name: 'BZMC001',
          code: 'BZBH001',
          teamPrincipal: '猪八戒',
          phone: '15645156713',
          personCount: '8',
          person: '刘海柱，沙僧',
          equipmentName: 'SBMC001',
          skillName: '早班',
          createtime: '2021.4.30.14:57'
        },
        {
          id: '2',
          name: 'BZMC002',
          code: 'BZBH002',
          teamPrincipal: '唐僧',
          phone: '16601960131',
          personCount: '15',
          person: '王大锤，渣渣灰',
          equipmentName: 'SBMC002',
          skillName: '常白班',
          createtime: '2021.4.15.14:57'
        },
        {
          id: '3',
          name: 'BZMC003',
          code: 'BZBH003',
          teamPrincipal: '孙悟空',
          phone: '18621977374',
          personCount: '5',
          person: '李小璐，贾乃亮',
          equipmentName: 'SBMC003',
          skillName: '晚班',
          createtime: '2021.4.25.14:57'
        },
        {
          id: '4',
          name: 'BZMC004',
          code: 'BZBH004',
          teamPrincipal: '渣渣灰',
          phone: '15004622553',
          personCount: '7',
          person: '范冰冰',
          equipmentName: 'SBMC004',
          skillName: '中班',
          createtime: '2021.4.25.14:57'
        }
      ],
      detailslist: [],
      // 返回后端的字段
      form: {
        code: '',
        name: '',
        teamPrincipal: '',
        phone: ''
      },
      // 校验
      rules: {
        // code: [
        //   { required: true, message: "工位编号不能为空", trigger: "blur" },
        // ],系统自动获取，不提示校验。
        name: [
          { required: true, message: '班组名称不能为空', trigger: 'blur' }
        ],
        teamPrincipal: [
          { required: true, message: '班组负责人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '负责人电话不能为空', trigger: 'blur' }
        ],
        person: [
          { required: true, message: '最多成员数不能为空', trigger: 'blur' }
        ],
        workingtype: [
          { required: true, message: '工作类型不能为空', trigger: 'blur' }
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
    details() {
      console.log('查看详情按钮')
      this.dialogDetails = true
    },
    detailsSearch() {
      console.log('查看详情查询按钮')
    },
    detailsReset() {
      console.log('查看详情重置按钮')
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
    .line {
      width: 2px;
      height: 20px;
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
  .demo-ruleForm {
    margin-top: -20px;
  }
}
</style>
