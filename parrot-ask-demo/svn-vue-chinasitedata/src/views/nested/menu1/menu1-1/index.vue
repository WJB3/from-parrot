<template>
  <div class="workOrder">
    <!-- 预处理工单头部 -->
    <el-card style="margin: 10px">
      <div class="top">
        <div class="line"></div>
        <div class="txt">生产管理-切割车间-预处理工单</div>
      </div>
    </el-card>
    <!-- 預處理工單table -->
    <el-card class="tableContain">
      <div class="Search" style="display: flex; justify-content: space-between">
        <div class="btnLeft">
          <el-button size="small" type="danger" @click="cutworkData"
            ><i class="el-icon-refresh fontleft"></i>刷新</el-button
          >
          <el-button size="small" type="warning"
            ><i class="el-icon-female fontleft"></i>导入</el-button
          >
          <el-button size="small" type="success" @click="handleExport"
            ><i class="el-icon-male fontleft"></i>导出</el-button
          >
        </div>
        <div class="searchRight">
          <el-input
            placeholder="按材料类型查询"
            clearable
            style="width: 180px; margin-right: 10px"
            size="small"
          />
          <el-button type="primary" plain size="small">
            <i class="el-icon-search fontleft"></i>查询</el-button
          >
          <el-button type="info" plain size="small">重置</el-button>
        </div>
      </div>
      <!-- 预处理数据表格 -->
      <el-table
        style="margin-top: 15px"
        highlight-current-row
        :data="list"
        stripe
        border
        size="mini"
        show-overflow-tooltip
        tooltip-effect="dark"
        :loading="loading"
        :header-cell-style="{
          background: 'rgba(214, 234, 255,.8)',
          color: '#000',
          opacity: '0.7',
        }"
      >
        <el-table-column type="selection" width="80" align="center">
        </el-table-column>
        <el-table-column label="序号" align="center" width="80" type="index">
        </el-table-column>

        <el-table-column prop="workSheetCode" label="工单编号" align="center">
          <template #default="scope">
            <span
              size="mini"
              @click="workSheetDetails(scope.row.workSheetCode)"
              style="
                text-decoration: underline;
                cursor: pointer;
                color: #6bb5f8;
              "
              >{{ scope.row.workSheetCode }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="workSheetType" label="材料类型" align="center">
        </el-table-column>
        <el-table-column prop="materialNumber" label="材料数量" align="center">
        </el-table-column>
        <el-table-column
          prop="planBeginTime"
          label="计划开始时间"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="planEndTime" label="计划结束时间" align="center">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination" style="text-align: right; margin-top: 5px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        >
        </el-pagination>
      </div>
    </el-card>

    <div
      class="show"
      v-show="disAbles"
      style="margin-top: 35px; margin-bottom: 10px"
    >
      <el-card style="margin: 2px 0px; height: 60px">
        <!-- <div class="line" ></div> -->
        <div
          class="preHeader"
          style="margin-left: 13px; text-align: center; margin-top: -5px"
        >
          生产管理 - 预处理工单 - 工单编号<span
            style="color: red; margin: 0px 5px"
            >{{ workCode }}</span
          >详情
        </div>
        <div class="btn" style="float: right; margin-top: -25px">
          <el-button type="danger" size="small" @click="disAbles = false"
            >关闭</el-button
          >
        </div>
      </el-card>
      <el-card>
        <!-- 预处理数据表格 -->
        <el-table
          highlight-current-row
          :data="listData"
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
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column label="序号" align="center" width="80" type="index">
          </el-table-column>
          <!-- <el-table-column prop="name" label="工艺名称" align="center">
                        </el-table-column> -->
          <!-- <el-table-column prop="workSheetType" label="工艺顺序" align="center">
                        </el-table-column> -->
          <el-table-column prop="name" label="材料名称" align="center">
          </el-table-column>
          <el-table-column prop="code" label="材料编码" align="center">
          </el-table-column>
          <el-table-column prop="type" label="材料类型" align="center">
          </el-table-column>
          <el-table-column prop="quality" label="材质" align="center">
          </el-table-column>
          <el-table-column prop="materialGrade" label="材料标准" align="center">
          </el-table-column>
          <el-table-column prop="size" label="尺寸" align="center">
          </el-table-column>
          <el-table-column prop="weight" label="重量" align="center">
          </el-table-column>
          <el-table-column prop="heatno" label="炉批号" align="center">
          </el-table-column>
          <el-table-column
            prop="materialNumber"
            label="材料数量"
            align="center"
          >
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="280">
                            <template #default="scope">
                                <el-button
                                type="primary"
                                size="small"
                                @click="openDialog(2, scope.row)"><i class="el-icon-news" style="margin-right:5px;"></i> 查看</el-button>
                            </template>
                    </el-table-column> -->
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { exportExcel } from "@/utils/exportExcel";
import work from "@/api/work";
import qs from "qs";
export default {
  data() {
    return {
      //分页数据
      pages: {
        total: 0,
        pageSize: 10,
        currentSize: 1,
      },
      //表格数据
      list: [], //表格数据总数
      loading: false,
      listData: [],
      disAbles: false,
      workCode: 0,
    };
  },
  methods: {
    //刷新方法
    cutworkData() {
      this.getList();
    },
    //页码数量
    handleSizeChange(value) {
      console.log("size", value);
      this.pages.pageSize = value;
      this.getList();
    },
    //当前页码数量
    handleCurrentChange(value) {
      console.log("curret", value);
      this.pages.currentSize = value;
      this.getList();
    },
    workSheetDetails(id) {
      const self = this;
      self.workCode = id;
      work.getDetail(id).then((res) => {
        console.log(1, res);
        self.disAbles = true;
        self.listData =res.result;
      });
    },
    handleExport() {
      const self = this;
      let entozh = {
        workSheetCode: "工单编号",
        workSheetType: "材料类型",
        materialNumber: "材料数量",
        planBeginTime: "计划开始时间",
        planEndTime: "计划结束时间",
      };
      exportExcel(self.list, entozh, "xlsx", "预处理工单信息表");
    },
    getList() {
      const self = this;
      this.loading = true;
      work
        .getList({
          pageindex: self.pages.currentSize,
          pagesize: self.pages.pageSize,
        })
        .then((res) => {
          self.loading = false;
          console.log("Rows", res);
          const { 
              result: { Rows, Total },
       
          } = res;
          
          self.list = Rows;
          self.pages.total = Total;
        })
        .catch((err) => {
          self.loading = false;
        });
    },
  },

  mounted: function () {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.tableContain {
  margin: 10px;
}
@import url("./index.scss");
</style>