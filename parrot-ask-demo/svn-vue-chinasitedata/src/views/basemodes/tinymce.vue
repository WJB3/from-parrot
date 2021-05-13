<template>
  <div class="shiftsetting df">
    <!-- 组织列表 -->
    <div class="organization">
      <el-card class="shiftsetting">
        <div class="line" />
        <div class="shiftHeader">组织列表</div>
      </el-card>
      <el-card>
        <div class="btn">
          <el-button
            size="mini"
            type="danger"
            @click="handleReload(2)"
          ><i class="el-icon-refresh iconconfig" />刷新</el-button>
        </div>
        <!-- 二级菜单 -->
        <el-tree
          :data="data5"
          node-key="DepId"
          :default-expand-all="true"
          :props="defaultProps"
        />
      </el-card>
    </div>
    <div class="person">
      <!-- 人员基本信息頭部 -->
      <el-card>
        <div class="line" />
        <div class="shiftHeader">人员基本信息</div>
      </el-card>
      <!-- 人员基本信息  表格区域 -->
      <el-card>
        <!-- 表格 -->
        <!-- btn-table -->
        <el-row>
          <el-col :span="16">
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
          <el-col :span="8">
            <div class="btn">
              <el-input
                v-model="params.Name"
                placeholder="按姓名查询"
                clearable
                style="width: 180px; margin-right: 10px"
                size="mini"
              />
              <el-button type="primary" plain size="mini">查询</el-button>
              <el-button
                type="info"
                plain
                size="mini"
                @click="handleReload(3)"
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
            opacity: '0.7',
          }"
        >
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column label="序号" align="center" width="80" type="index" />
          <el-table-column prop="userid" label="用户名" align="center" />
          <el-table-column
            prop="depname"
            label="组织名称"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="tel" label="联系电话" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column
            prop="email"
            label="邮箱"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="age" label="年龄" align="center" />
          <el-table-column
            prop="positionname"
            label="职位名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="factoryname"
            label="工厂名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="productionlinename"
            label="产线名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="skillname"
            label="技能名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="teamname"
            label="班组名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="workingname"
            label="工位名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="workshopname"
            label="车间名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="creater"
            label="创建人"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            width="280"
            fixed="right"
          >
            <template #default="scope">
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
    </div>
    <!-- 新增对话框 -->
    <el-dialog
      title="新增用户信息"
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
        label-width="90px"
        class="shiftdisalog"
      >
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="用户名 :" prop="userid" class="shift">
              <el-input
                v-model="form.userid"
                placeholder="用户名"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码 :" prop="password" class="shift">
              <el-input
                v-model="form.password"
                placeholder="密码"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名 :" prop="name" class="shift">
              <el-input
                v-model="form.name"
                placeholder="姓名"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="邮箱 :" prop="email">
              <el-input
                v-model="form.email"
                placeholder="邮箱"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄 :" prop="age">
              <el-input
                v-model="form.age"
                placeholder="年龄"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="tel">
              <el-input
                v-model="form.tel"
                placeholder="联系电话"
                clearable
                style="width: 110px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="数据来源:" prop="shiftName">
              <el-select
                v-model="form.edatasources.Value"
                clearable
                placeholder="数据来源"
              >
                <el-option
                  v-for="(item, index) in form.edatasources"
                  :key="index"
                  :label="item.Text"
                  :value="item.Value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位名称 :">
              <el-select
                v-model="form.postno.positionId"
                clearable
                placeholder="职位名称"
              >
                <el-option
                  v-for="(item, index) in form.postno"
                  :key="index"
                  :label="item.positionName"
                  :value="item.positionId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组名称:">
              <el-select
                v-model="form.teamcode.code"
                clearable
                placeholder="班组名称"
              >
                <el-option
                  v-for="(item, index) in form.teamcode"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="部门名称:">
              <el-select
                v-model="form.depno.depId"
                clearable
                placeholder="部门名称"
              >
                <el-option
                  v-for="(item, index) in form.depno"
                  :key="index"
                  :label="item.depName"
                  :value="item.depId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="技能名称:">
              <el-select
                v-model="form.skillno.skillId"
                clearable
                placeholder="技能名称"
              >
                <el-option
                  v-for="(item, index) in form.skillno"
                  :key="index"
                  :label="item.skillName"
                  :value="item.skillId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="技能等级:">
              <el-select
                v-model="form.skilllevelno.gradeId"
                placeholder="技能等级"
              >
                <el-option
                  v-for="(item, index) in form.skilllevelno"
                  :key="index"
                  :label="item.gradeName"
                  :value="item.gradeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="是否启用:" prop="shiftCode">
              <el-radio v-model="form.start" label="0">是</el-radio>
              <el-radio v-model="form.start" label="1">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别 :">
              <el-radio v-model="form.sex" label="0">男</el-radio>
              <el-radio v-model="form.sex" label="1">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人 :" prop="creater">
              <el-input
                v-model="form.creater"
                placeholder="创建人"
                clearable
                style="width: 110px"
              />
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
          <el-button size="small" @click="cancel">取 消</el-button>
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
      id: '',
      rules: {
        userid: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        // email: [
        //   { validator: this.ValidEmail, required: true, trigger: 'change' }
        // ],
        // age: [{ validator: this.ValidAge, required: true, trigger: 'change' }],
        // tel: [
        //   { validator: this.ValidPhone, required: true, trigger: 'change' }
        // ],
        creater: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ]
      },
      total: 0,
      dialogVisible: false,
      data5: [],
      currentPage4: 4,
      ruleForm: '',
      defaultProps: {
        children: 'ChildrenList', // 设置通过children属性展示子节点信息
        label: 'DepName' // 设置树节点名称对应在字段
      },
      form: {
        userid: '',
        password: '',
        name: '',
        email: '',
        age: '',
        tel: '',
        depno: '',
        teamcode: '',
        skillno: '',
        edatasources: '',
        postno: '',
        esignoff: '0',
        skilllevelno: '',
        start: '0',
        sex: '0',
        creater: ''
      },
      // 获取用户列表的传参
      params: {
        pageIndex: 1,
        pageSize: 10,
        Code: '',
        Name: '',
        depname: ''
      },
      tableData: []
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
 @import '../../styles/tinymce.scss'
</style>
