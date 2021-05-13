<template>
  <div class="workFinallOrder">
       <!-- 头部 -->
       <div class="topFinTop">
             <el-card class="card">
                  <div class="line"></div>
                  <div class="txt">生产管理-切割车间-预处理完检工单</div>
             </el-card>
       </div>

       <!-- 预处理完检工单表格 -->
       <div class="tableContainer">
         <el-card class="card">
         <div class="Search" style="display:flex;justify-content: space-between;">
              <div class="btnLeft">
                      <el-button size="small"  type="danger"  ><i class="el-icon-refresh fontleft" ></i>刷新</el-button>
                      <el-button size="small"  type="warning" ><i class="el-icon-female fontleft"></i>导入</el-button>
                      <el-button size="small" type="success" ><i class="el-icon-male fontleft" ></i>导出</el-button>
              </div>
              <div class="searchRight">
                      <el-input placeholder="按材料类型查询" clearable    style="width:180px;margin-right:10px;" size="small"/>
                      <el-button type="primary"  plain size="small"> <i class="el-icon-search fontleft" ></i>查询</el-button>
                      <el-button type="info"  plain size="small">重置</el-button>
              </div>
         </div>
       <!-- 预处理数据表格 -->
        <el-table
                style="margin-top:15px;"
                highlight-current-row
                :data="pages.list"
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
                <el-table-column label="序号" align  ="center" width="80" type="index">
                </el-table-column>
                  
                <el-table-column prop="workSheetCode" label="工单编号" align="center">
                    <template #default="scope">
                        <span size="mini"  @click="workSheetDetails(scope.row.workSheetCode)" style="text-decoration:underline;cursor:pointer;color:#6BB5F8;">{{scope.row.workSheetCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="workSheetType" label="物料总数量" align="center">
                </el-table-column>
                <el-table-column prop="materialNumber" label="到料数量" align="center">
                </el-table-column>
                <el-table-column prop="planBeginTime" label="未到料数量" align="center">
                </el-table-column>
                <el-table-column prop="planEndTime" label="计划开始时间" align="center">
                </el-table-column>
                <el-table-column prop="planEndTime" label="计划结束时间" align="center">
                </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" style="text-align:right;margin-top:5px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10,20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pages.total">
            </el-pagination>
        </div>
     </el-card>
       </div>
  </div>
</template>

<script>
  export default {
      data() {
        return {
          pages:{
              list:[], //表格数据
              total:0,
              pageSize:10,
              currentSize:1
          }
             
        }
      },
      methods: {
        handleSizeChange() {
          
        },
        handleCurrentChange(){
          
        }
      },
  }
</script>

<style lang="scss" scoped>
@import url('./workFinall.scss');
</style>