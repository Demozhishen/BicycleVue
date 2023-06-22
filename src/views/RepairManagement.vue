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
      <el-input v-model="search" placeholder="请输入车辆状态" style="width:200px" clearable/>
      <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
    </div>


    <!--    功能区-->


    <div style="margin: 10px">

      <el-button type="primary" @click="exp">导出 <i class="el-icon-top"></i></el-button>

    </div>

<!--    搜索区-->



    <el-table :data="tableData" border stripe  style="width: 100%" >
      <el-table-column prop="repairId" label="检修ID" sortable width="130" />
      <el-table-column prop="bikeId" label="车辆ID" width="130" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间"   />
      <el-table-column prop="description" label="检修描述" />
      <el-table-column fixed="right" label="Operations" >
        <template #default="scope">
        <el-button type="info" @click="handleFinish(scope.row)" round  v-if="!scope.row.endTime">维修完成</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.repairId)">
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
        title="新增车辆"
        width="30%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="车辆编号">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="车辆X坐标" >
          <el-input v-model="form.xcoordinate"></el-input>
        </el-form-item>
        <el-form-item label="车辆Y坐标">
          <el-input v-model="form.ycoordinate"></el-input>
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-radio v-model="form.status" label="使用中">使用中</el-radio>
          <el-radio v-model="form.status" label="空闲中">空闲中</el-radio>
          <el-radio v-model="form.status" label="维修中">维修中</el-radio>
          <el-radio v-model="form.status" label="已损坏">已损坏</el-radio>
        </el-form-item>
        <el-form-item label="蓝牙ID">
          <el-input v-model="form.bluetoothId"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>




import request from "@/utils/request";

export default {
  name: 'HomeView',
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
      tableData:[]
    }
    },
  created() {
    this.load()
  },
  methods:{
    load(){
       request.get("/repairManagement", {
         params:{
           pageNum:this.currentPage,
           pageSize:this.pageSize,
           search:this.search
         }
       }).then(res=>{

         console.log(res)
         console.log(this.search)
         this.tableData=res.data.records
         this.total=res.data.total
       })
    },
    exp(){
      window.open("/repairManagement/export")
    },

    save(){
      console.log(this.form.id)
      if(this.form.id)
      {
        request.put("/repairManagement",this.form).then(res=>{

          if(res.code==='0')
          {
            this.$message({
              type:"success",
              message:"修改成功"
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
      }else
        {
          request.post("/repairManagement", this.form).then(res => {
            console.log(res)
            this.$message({
              type:"success",
              message:"新增成功"
            })
            this.load();
          })
        }

      this.dialogVisible=false
    },


    handleFinish(row){
      this.form=row;
      request.put("/repairManagement",this.form).then(res=>{
        this.$message({
          type:"success",
          message:"检修完成"
        })
        this.load()
      })
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
      request.delete("/repairManagement/"+id).then(res=>{
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
.headerBg {
  background: #eee!important;
}
</style>
