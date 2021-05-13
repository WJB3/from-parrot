<template>
     <div class="shiftsetting df">
         <!-- 左侧 -->
        <div class="organization">
            <!-- 标题 -->
            <el-card class="shiftsetting">
                <div class="line" ></div>
                <div class="shiftHeader">物料基础信息管理</div>
           </el-card>
          <el-card>
                <!-- 按钮 -->
                <div class="btn">
                    <el-button size="mini"  type="danger" ><i class="el-icon-refresh iconconfig" ></i>刷新</el-button>
                </div>
                <!-- 二级菜单 -->
                <el-tree  
                        :data="datatree"  
                        node-key="DepId" 
                        :default-expand-all="true" 
                        :props="defaultProps"
                        @node-click="change">
                </el-tree>
        </el-card>
    </div>
       <div class="person">
        <el-card>
            <div class="line" ></div>
            <div class="shiftHeader">物料基础信息管理</div>
        </el-card>
        <el-card >
                <!-- 表格 -->
                <!-- btn-table -->
                  <el-row>
                    <el-col :span=16> 
                        <div class="btn">
                           <el-button size="mini"  type="danger" ><i class="el-icon-refresh iconconfig"></i>刷新</el-button>
                           <el-button  size="mini"  type="primary"><i class="el-icon-plus iconconfig"></i>新增</el-button>
                           <el-button size="mini" type="success" ><i class="el-icon-male iconconfig"></i>导出</el-button>
                        </div>
                    </el-col> 
                    <el-col :span=8>
                         <div class="btn">
                            <el-input placeholder="按物料名称查询" clearable style="width:180px;margin-right:10px;"  size="mini"/>
                            <el-button type="primary" plain size="mini" >查询</el-button>
                            <el-button type="info" plain size="mini" >重置</el-button>
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
                <el-table-column type="selection" width="80" align="center">
                </el-table-column>
                <el-table-column label="序号" align="center" width="80" type="index">
                </el-table-column>
                <el-table-column prop="userid" label="物料编码" align="center">
                </el-table-column>
                <el-table-column prop="depname" label="物料名称" align="center" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="tel" label="物料类型" align="center">
                </el-table-column>
                <el-table-column prop="name" label="材质" align="center">
                </el-table-column>
                <el-table-column prop="email" label="公称直径" align="center" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="age" label="壁厚" align="center">
                </el-table-column>
                <el-table-column prop="positionname" label="材料标准" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="factoryname" label="磅级" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="productionlinename" label="标准" show-overflow-tooltip align="center">
                </el-table-column>
                 <el-table-column prop="skillname" label="端面" show-overflow-tooltip align="center">
                </el-table-column>
                 <el-table-column prop="teamname" label="物料备注" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="workingname" label="长度" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="workshopname" label="宽度" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="creater" label="厚度" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="workshopname" label="炉批号" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="creater" label="重量" show-overflow-tooltip align="center">
                </el-table-column>
                </el-table>
        </el-card>
        <!-- 分页:current-page="currentPage4" -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="0">
        </el-pagination>
       </div>
       
        </div>
</template>

<script>
export default {
        data(){
            return{
                datatree:[],
                defaultProps:{

                },
                tableData:[]
            }
        },
        methods: {
            change() {
                
            },
            handleSizeChange(){

            },
            handleCurrentChange(){

            }
        },
    }
</script>

<style lang="scss" scoped>
.df{
    display: flex;
    margin:10px;
}
   .shiftsetting{
       background-color: #fff;
       border-radius:5px;
       
       .organization{
           margin:0 2px;
           width: 20%;
       }
       .person{
           width: 80%;
       }
       //分页
       .el-pagination {
            padding: 5px 0 -5px 0;
            text-align: right;
        }
       .el-card{
           margin-top:2px;
       }
       //字体图标
       .iconconfig{
           margin-right: 5px;
       }
       //头部
        .shiftHeader{
            height:5px;
            line-height:3px;
            font-size:16px;
            margin-left:15px;
            margin-top:-10px;
        }
        .btn{
            margin:-10px 0 10px 0;
        }
        .shiftdisalog{
            margin-top:-20px;
        }
        .shift{
            margin-top: 25px;
        }
        
   }
</style>