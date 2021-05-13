<template>
  <div class="dropzone">
    <!-- 用户基本信息頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">系统管理-用户基本信息</div>
    </el-card>
    <!-- 用户基本信息表格 -->
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
              placeholder="按用户名查询"
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
        <el-table-column label="用户编码" prop="userId" align="center" />
        <el-table-column label="用户名" prop="name" align="center" />
        <el-table-column label="联系电话" prop="tel" align="center" />
        <el-table-column label="性别" prop="sex" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" show-overflow-tooltip />
        <el-table-column label="年龄" prop="age" align="center" />
        <el-table-column label="头像地址" prop="photo" align="center" />
        <el-table-column label="操作" align="center" width="280">
          <template>
            <el-button size="small" type="primary" @click="handleAssign"><i class="el-icon-s-custom" style="margin-right:5px;" />分配角色</el-button>
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
      title="新增用户信息"
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
        <!-- <el-tooltip effect="dark" content="用户编码只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip> -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户编码 :" style="margin-left:-52px">
              <el-input v-model="form.userid" style="width: 180px" placeholder="请输入用户编码" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="密码 :" prop="password" style="margin-left:-26px">
              <el-input v-model="form.password" style="width: 180px" clearable placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别 : " style="margin-left:-52px">
              <el-radio-group v-model="form.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号 :" prop="tel" style="margin-left:-26px">
              <el-input v-model="form.tel" style="width: 180px" clearable placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名 :" style="margin-left:-52px">
              <el-input v-model="form.name" style="width: 180px" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱 :" prop="email" style="margin-left:-26px">
              <el-input v-model="form.email" style="width: 180px" clearable placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年龄 :" style="margin-left:-52px">
              <el-input v-model="form.age" style="width: 180px" placeholder="请输入年龄" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像 :" style="margin-left:-26px">
              <el-upload
                id="picture"
                style="display: inline-block;text-align: center;cursor: pointer;outline: 0;width: 180px;height: 160px;border: 1px solid #d9d9d9;"
                multiple
                action="https://jsonplaceholder.typicode.com/posts/"
                accept="image/png,image/jpg,image/jpeg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="display:block;width:180px;height:120px;line-height:155px;font-size:35px;text-align:center;color:#ccc;" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑用户信息"
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
        <!-- <el-tooltip effect="dark" content="用户编码只读（系统自动获取）" placement="top-start">
          <i class="el-icon-question" style="color:orange;font-size:18px;position:absolute;top:64px;left:14px;" />
        </el-tooltip> -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户编码 :" style="margin-left:-52px">
              <el-input v-model="form.userid" style="width: 180px" placeholder="请输入用户编码" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="密码 :" prop="password" style="margin-left:-26px">
              <el-input v-model="form.password" style="width: 180px" clearable placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别 : " style="margin-left:-52px">
              <el-radio-group v-model="form.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号 :" prop="tel" style="margin-left:-26px">
              <el-input v-model="form.tel" style="width: 180px" clearable placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名 :" style="margin-left:-52px">
              <el-input v-model="form.name" style="width: 180px" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱 :" prop="email" style="margin-left:-26px">
              <el-input v-model="form.email" style="width: 180px" clearable placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年龄 :" style="margin-left:-52px">
              <el-input v-model="form.age" style="width: 180px" placeholder="请输入年龄" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span>
          <el-button size="small" @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogEdit = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogAssign"
    >
      <el-checkbox-group v-model="checkedAssign" size="medium" style="margin-top:-25px">
        <el-checkbox label="超级管理员" />
      </el-checkbox-group>
      <template #footer>
        <span>
          <el-button size="small" @click="dialogAssign = false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogAssign = false">确 定</el-button>
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
      dialogAssign: false, // 分配角色
      content: '', // 查询input框输入的内容
      imageUrl: '', // 头像
      checkedAssign: '',
      currentPage4: 4,
      total: 0,
      list: [
        {
          id: '1',
          userId: 'YHBM001',
          name: 'YHM001',
          tel: '15645156713',
          sex: '男',
          email: '1760271341@qq.com',
          age: '23',
          photo: 'Yangyuze'
        },
        {
          id: '2',
          userId: 'YHBM002',
          name: 'YHM002',
          tel: '15004622553',
          sex: '女',
          email: '1094080893@qq.com',
          age: '22',
          photo: 'Liuyanjia'
        },
        {
          id: '3',
          userId: 'YHBM003',
          name: 'YHM003',
          tel: '13945066473',
          sex: '男',
          email: '739577396@qq.com',
          age: '25',
          photo: 'Zhangchengjie'
        },
        {
          id: '4',
          userId: 'YHBM004',
          name: 'YHM004',
          tel: '18621977374',
          sex: '女',
          email: '511807303@qq.com',
          age: '24',
          photo: 'Tangxiaosheng'
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
        userid: [
          { required: true, message: '用户编码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
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
    handleAssign() {
      console.log('分配角色按钮')
      this.dialogAssign = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 上传头像部分 //
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。//
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
  .el-input{
    caret-color: rgb(10, 190, 245) !important;
}
  // 触摸样式?? //
  #picture:hover{
    border: #409EFF 1px dashed;
  }

}
</style>
