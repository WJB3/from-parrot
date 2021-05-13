<template>
  <div class="dropzone">
    <!-- 工艺信息管理頭部 -->
    <el-card class="card">
      <div class="line" />
      <div class="dropzoneHeader">工艺信息管理</div>
    </el-card>
    <!-- 工艺信息管理表格 -->
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
              placeholder="关键字筛选"
              style="width: 180px; margin-right: 10px"
              size="mini"
              clearable
            />
            <el-button
              type="primary"
              plain
              size="mini"
              @click="handleSearch"
            >查询</el-button>
            <el-button
              type="info"
              plain
              size="mini"
              @click="handleReset"
            >重置</el-button>
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
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="序号" align="center" width="80" type="index" />
        <el-table-column prop="coding" label="工艺路线编码" align="center" />
        <el-table-column prop="name" label="工艺路线名称" align="center" />
        <el-table-column prop="classify" label="工艺路线分类" align="center" />
        <el-table-column prop="versions" label="工艺路线版本" align="center" />
        <el-table-column
          prop="file"
          label="工艺文件"
          align="center"
        />
        <el-table-column
          prop="flow"
          label="工艺路线流程"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column label="启用" align="center" width="160">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="关闭"
              @change="changeSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template>
            <el-button
              size="small"
            ><i class="el-icon-thumb" style="margin-right: 5px" />配置路线</el-button>
            <el-button
              size="small"
              plain
              class="el-icon-edit"
              @click="editDialog"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete"
            ><i class="el-icon-delete iconconfig" />删除</el-button>
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
    <el-dialog title="新增工艺信息" :visible.sync="dialogVisible" width="690px">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="工艺路线编码 : "
              prop="bm"
              style="margin-left: -26px"
            >
              <el-input
                v-model="form.bm"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="工艺路线名称 : "
              prop="mc"
              style="margin-left: -20px"
            >
              <el-input
                v-model="form.mc"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="工艺路线分类 : "
              prop="fl"
              style="margin-left: -26px"
            >
              <el-select
                v-model="form.fl"
                placeholder="请选择工艺路线分类"
                style="width: 180px"
              >
                <el-option label="分类一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="工艺路线版本 : "
              prop="bb"
              style="margin-left: -20px"
            >
              <el-input
                v-model="form.bb"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑工艺信息" :visible.sync="dialogEdit" width="690px">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        size="small"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="工艺路线编码 : "
              prop="bm"
              style="margin-left: -26px"
            >
              <el-input
                v-model="form.bm"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="工艺路线名称 : "
              prop="mc"
              style="margin-left: -20px"
            >
              <el-input
                v-model="form.mc"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="工艺路线分类 : "
              prop="fl"
              style="margin-left: -26px"
            >
              <el-select
                v-model="form.fl"
                placeholder="请选择工艺路线分类"
                style="width: 180px"
              >
                <el-option label="分类一" value="shanghai" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="工艺路线版本 : "
              prop="bb"
              style="margin-left: -20px"
            >
              <el-input
                v-model="form.bb"
                style="width: 180px"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogEdit = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="dialogEdit = false"
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
      dialogEdit: false, // 编辑
      content: '', // 查询input框输入的内容
      currentPage4: 4,
      total: 0,
      list: [
        {
          number: '1',
          coding: 'CX001',
          name: '板材预处理产线',
          classify: 'GCBM001',
          versions: 'CJ001',
          flow: '等离子切割-开坡口-报检-杆件分拣',
          file: '1.xsl',
          status: true
        },
        {
          number: '2',
          coding: 'CX002',
          name: '板材切割产线',
          classify: 'GCBM002',
          versions: 'CJ002',
          flow: '等离子切割-开坡口-报检-杆件分拣',
          file: '1.xsl',
          status: 'true'
        },
        {
          number: '3',
          coding: 'CX003',
          name: '型材预处理产线',
          classify: 'GCBM003',
          versions: 'CJ003',
          flow: '等离子切割-开坡口-报检-杆件分拣',
          file: '1.xsl',
          status: 'true'
        },
        {
          number: '4',
          coding: 'CX004',
          name: '型材切割产线',
          classify: 'GCBM004',
          versions: 'CJ004',
          flow: '等离子切割-开坡口-报检-杆件分拣',
          file: '1.xsl',
          status: 'false'
        }
      ],
      // 返回后端的字段
      form: {
        bm: '',
        mc: '',
        fl: '',
        bb: ''
      },
      // 校验
      rules: {
        bm: [
          { required: true, message: '工艺路线编码不能为空', trigger: 'blur' }
        ],
        mc: [
          { required: true, message: '工艺路线名称不能为空', trigger: 'blur' }
        ],
        fl: [
          { required: true, message: '工艺路线分类不能为空', trigger: 'blur' }
        ],
        bb: [
          { required: true, message: '工艺路线版本不能为空', trigger: 'blur' }
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
    changeSwitch(e) {
      console.log('启用', e)
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

