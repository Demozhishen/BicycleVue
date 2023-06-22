<template>
  <div style="padding: 10px;width: 100%" >


    <!--    搜索区-->
    <!--    <div style="margin: 10px 0">
          <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search"></el-input>
          <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5"></el-input>
          <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5"></el-input>
          <el-button class="ml-5" type="primary">搜索</el-button>
        </div>-->

    <div style="margin: 10px">
      <el-input v-model="search" placeholder="请输入车辆ID" style="width:200px" clearable/>
      <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
    </div>


    <!--    功能区-->


    <div style="margin: 10px">
<!--      <el-button type="primary" @click="add" v-if="!role">新增</el-button>-->

      <el-button type="primary" @click="exp" v-if="role">导出 <i class="el-icon-top"></i></el-button>
      <el-button type="primary" @click="exp">导出 <i class="el-icon-top"></i></el-button>

    </div>

    <!--    搜索区-->



    <el-table :data="tableData" border stripe  style="width: 100%" >
      <el-table-column prop="recordId" label="使用记录ID" sortable width="130" />
      <el-table-column prop="vehicleId" label="车辆ID" width="110"/>
      <el-table-column prop="fenceId" label="围栏ID" width="110"/>
      <el-table-column label="开始时间" >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.startX}}</div>
              <div>PointY: {{ scope.row.startY}}</div>
            </template>
            <template #reference>
              <el-tag type="info">{{scope.row.startTime}}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.endX}}</div>
              <div>PointY: {{ scope.row.endY}}</div>
            </template>
            <template #reference>
              <el-tag type="info">{{scope.row.endTime}}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="distance" label="距离" />
      <el-table-column fixed="right" label="Operations" >
        <template #default="scope">
          <el-button type="success" @click="handleEdit(scope.row)" round disabled>编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.recordId)">
            <template #reference>
              <el-button type="danger" round>删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px">
      <el-pagination
          v-model:current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
        v-model="dialogVisible"
        title="新增使用记录"
        width="30%"
    >
      <el-form :model="form" label-width="120px">

        <el-form-item label="车辆编号">
          <el-input v-model="form.vehicleId"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="距离">
          <el-input v-model="form.distance"></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          添加
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>





import request from "@/utils/request";

export default {
  name: 'item',
  components: {

  },
  data(){
    return {
      form:{},
      dialogVisible:false,
      total:10,
      currentPage:1,
      pageSize:5,
      search:'',
      tableData:[],
      test:{},
      role:false,
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      this.form = JSON.parse( localStorage.getItem("user"));
      console.log(this.form)
      request.get("/vehicleUsage",{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search,
        },

      }).then(res=>{
        console.log(localStorage.getItem("user"))
        this.tableData=res.data.records
        this.total=res.data.total
      })
    },

    add(){
      this.dialogVisible=true
      this.form={}
    },
    save(){

        request.post("/vehicleUsage", this.form).then(res => {
          console.log(res)
          this.$message({
            type:"success",
            message:"新增成功"
          })
          this.load();
        })


      this.dialogVisible=false
    },
  exp(){
      window.open("/vehicleUsage/export")
  },
    handleEdit(row){
      this.form=JSON.parse(JSON.stringify(row))
      this.dialogVisible=true
    },

    handleSizeChange(pageSize){
      this.pageSize=pageSize;
      this.load()
    },
    handleCurrentChange(pageNum){
      this.currentPage=pageNum;
      this.load()
    },
    handleDelete(id){
      console.log(id)
      request.delete("/vehicleUsage/"+id).then(res=>{
        if(res.code==='0')
        {
          this.$message({
            type:"success",
            message:"删除成功"
          })
        }
        else {
          this.$message({
            type:"error",
            message: res.msg
          })
        }
        this.load()
      })
    },
  }
}
</script>


<style>

</style>
