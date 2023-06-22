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
      <el-button type="primary" @click="add">新增<i class="el-icon-plus"></i></el-button>
<!--      <el-button type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      <el-button type="primary">导入 <i class="el-icon-bottom"></i></el-button>-->
      <el-button type="primary" @click="exp">导出 <i class="el-icon-top"></i></el-button>

    </div>

<!--    搜索区-->



    <el-table :data="tableData" border stripe  style="width: 100%" >
      <el-table-column prop="id" label="车辆编号" sortable width="110" />
      <el-table-column prop="heng" label="X坐标"  />
      <el-table-column prop="shu" label="Y坐标" />
      <el-table-column prop="status" label="车辆状态"   />
      <el-table-column prop="fence" label="围栏ID"   />
      <el-table-column prop="bluetoothId" label="蓝牙ID" />
      <el-table-column fixed="right" label="Operations" >
        <template #default="scope">
        <el-button type="success" @click="handleEdit(scope.row)" round>编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="danger" round>删除 </el-button>
            </template>
          </el-popconfirm>
        <el-button type="warning" @click="handleRepair(scope.row)" v-if="scope.row.status==='已损坏'" round>检修</el-button>
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
          <el-input v-model="form.heng"></el-input>
        </el-form-item>
        <el-form-item label="车辆Y坐标">
          <el-input v-model="form.shu"></el-input>
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

    <el-dialog
        v-model="dialogDescription"
        title="检修描述"
        width="30%"
    >
        <el-input
            v-model="Description"
            :rows="2"
            type="textarea"
            placeholder="请描述车辆问题"
        />
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogDescription = false">取消</el-button>
        <el-button type="primary" @click="Repair">
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
      dialogDescription:false,
      Description:'',
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
    exp(){
      window.open("/vehicle/export")
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

    Repair(){
      console.log(this.form);
      request.post("/vehicle/repair",this.form,{  params:{
          Description:this.Description,
        }}).then(res=>{
        this.$message({
          type:"success",
          message:"已加入检修队列"
        })
        this.dialogDescription=false
        this.load()
      })

    },
    handleEdit(row){
      this.form=JSON.parse(JSON.stringify(row))
      this.dialogVisible=true
    },
    handleRepair(row){
      this.dialogDescription=true
      this.form=row;
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
      request.delete("/vehicle/"+id).then(res=>{
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
