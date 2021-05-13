<template>
  <div class="shiftsetting">
    <!-- 班次設定頭部 -->
    <el-card>
      <div class="line"></div>
      <div class="shiftHeader">
        班次设定
      </div>
    </el-card>
    <!-- 班次设定  表格区域 -->
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
              placeholder="按班次名称查询"
              style="width:180px;margin-right:10px;"
              clearable
              size="mini"
            />
            <el-button type="primary" plain size="mini">查询</el-button>
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
        <el-table-column
          prop="productionlinename"
          label="产线名称"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="shiftname" label="班次名称" align="center">
        </el-table-column>
        <el-table-column prop="shiftcode" label="班次编码" align="center">
        </el-table-column>
        <el-table-column prop="teamname" label="班组名称" align="center">
        </el-table-column>
        <el-table-column
          prop="workshopname"
          label="车间名称"
          align="center"
          width="120"
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
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
    <!-- 新增对话框 -->
    <el-dialog title="新增班次" :visible.sync="dialogVisible" width="650px">
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        ref="ruleForm"
        label-positioin="right"
        label-width="115px"
        class="shiftdisalog"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班次名称 :" prop="shiftName" class="shift">
              <el-input
                v-model="form.shiftName"
                clearable
                style="width:180px;"
                placeholder="班次名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班次编号 :" prop="shiftCode" class="shift">
              <el-input
                v-model="form.shiftCode"
                clearable
                style="width:180px;"
                placeholder="班次编号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 班次开始时间 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班次开始时间 :" prop="shiftstart">
              <el-date-picker
                clearable
                style="width:180px;"
                v-model="form.shiftstart"
                type="date"
                value-format="YYYY-MM-dd"
                placeholder="选择班次开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班次结束时间 :" prop="shiftend">
              <el-date-picker
                clearable
                v-model="form.shiftend"
                style="width:180px;"
                type="date"
                value-format="YYYY-MM-dd"
                placeholder="选择班次结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 启用日期 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="启用开始日期 :" prop="startDate">
              <el-date-picker
                clearable
                style="width:180px;"
                v-model="form.startDate"
                type="date"
                value-format="YYYY-MM-dd"
                placeholder="选择启用开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用结束日期 :" prop="startendDate">
              <el-date-picker
                clearable
                v-model="form.startendDate"
                style="width:180px;"
                type="date"
                value-format="YYYY-MM-dd"
                placeholder="选择启用结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 适用车间 -->
        <el-row :gutter="20" style="margin-top:0px;">
          <el-col :span="24">
            <el-form-item label="适用车间 :" prop="wordshops">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group
                v-model="checkedCities"
              >
                <el-checkbox></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 适用产线 -->
        <el-row :gutter="20" style="margin-top:-10px;">
          <el-col :span="24">
            <el-form-item label="适用产线 :" prop="wordLine">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group
                v-model="checkedCities"
              >
                <el-checkbox></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 选择班组 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="选择班组 ：" style="margin-top:20px;">
              <el-button>添加班组</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 描述 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述 :">
              <el-input
                type="textarea"
                v-model="form.destrice"
                placeholder="输入描述信息"
                clearable
              />
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
      lineOptions: [],
      dialogVisible: false,
      checkAll: false,
      checkedCities: ["切割车间", "阻焊车间"],
      isIndeterminate: true,
      form: {
        shiftCode: "",
        shiftName: "",
        shiftstart: "",
        shiftend: "",
        startDate: "",
        startendDate: "",
        destrice: "" //描述
      },
      radio: 1,
      radioLine: 2,
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
        telephone: [
          { required: true, message: "工厂地址不能为空", trigger: "blur" }
        ]
      },
      tableData: [],
      params: {
        pageIndex: 1,
        pageSize: 10,
        Code: "",
        Name: ""
      },
      total: 0,
      currentPage4: 4,
      ruleForm: "",
      id: ""
    };
    const total = ref(0);
    const ruleForm = ref(null);
    const id = ref("");
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 关闭dialog
    handleClose(done) {
      done();
      // this.$refs.form.resetFields()
    },
    // 取消dialog
    cancel() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    // dialog确定
    shiftAdd() {
      this.dialogVisible = false;
    },
    add() {
      this.dialogVisible = true;
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
