<template>
  <div style="padding: 10px;width: 100%" >



    <div style="margin: 10px">
      <el-input v-model="search" placeholder="请输入投放数量" style="width:200px" clearable/>
      <el-button type="primary" style="margin-left: 5px" @click="predict(search)">投放预测</el-button>
    </div>


    <!--    功能区-->



    <!--    搜索区-->



    <el-table :data="putData" border stripe  style="width: 100%" >
      <el-table-column prop="fenceId" label="围栏ID" sortable width="110" />
      <el-table-column prop="fenceName" label="围栏名称"  />
      <el-table-column prop="vehicleCount" label="投放数量" />
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
      dialogDescription:false,
      Description:'',
      total:10,
      currentPage:1,
      pageSize:5,
      search:'',
      tableData:[],
      putData:[],
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      request.get("/vehicle", {
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

    predict(nums){
      console.log(nums)
      request.post("/vehicle/vehicle_predict/"+nums, nums).then(res=>{
        console.log(res)
        this.putData=res.data
      })


    },

    add(){
      this.dialogVisible=true
      this.form={}
    },
    save(){
      console.log(this.form.id)
      if(this.form.id)
      {
        request.put("/vehicle",this.form).then(res=>{

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
        request.post("/vehicle", this.form,{
          params:{
            search:this.search
          }}).then(res => {
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
    handleSizeChange(pageSize){
      this.pageSize=pageSize;
      this.load()
    },
    handleCurrentChange(pageNum){
      this.currentPage=pageNum;
      this.load()
    },
  }
}
</script>


<style>
.headerBg {
  background: #eee!important;
}
</style>
