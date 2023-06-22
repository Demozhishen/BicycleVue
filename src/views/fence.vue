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
      <el-input v-model="search" placeholder="请输入围栏名称" style="width:200px" clearable/>
      <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
    </div>


    <!--    功能区-->


    <div style="margin: 10px">
      <el-button type="primary" @click="add">新增</el-button>

      <el-button type="primary" @click="exp">导出 <i class="el-icon-top"></i></el-button>

    </div>

    <!--    搜索区-->



    <el-table :data="tableData" border stripe  style="width: 100%" >
      <el-table-column prop="fenceId" label="围栏ID" sortable />
      <el-table-column prop="fenceName" label="围栏名称" />
      <el-table-column label="坐标点一" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.point1X }}</div>
              <div>PointY: {{ scope.row.point1Y }}</div>
            </template>
            <template #reference>
              <el-tag type="info">点位一</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="坐标点二" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.point2X }}</div>
              <div>PointY: {{ scope.row.point2Y }}</div>
            </template>
            <template #reference>
              <el-tag type="info">Point2</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="坐标点三" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.point3X }}</div>
              <div>PointY: {{ scope.row.point3Y }}</div>
            </template>
            <template #reference>
              <el-tag type="info">点位三</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="坐标点四" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>PointX: {{ scope.row.point4X }}</div>
              <div>PointY: {{ scope.row.point4Y }}</div>
            </template>
            <template #reference>
              <el-tag type="info">(x4,y4)</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="vehicleCount" label="车辆数量"   />
      <el-table-column fixed="right" label="Operations" >
        <template #default="scope">
          <el-button type="success" @click="handleEdit(scope.row)" round>编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.fenceId)">
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
        title="新增围栏"
        width="30%"
    >
      <el-form :model="form" label-width="120px">

        <el-form-item label="围栏名称">
          <el-input v-model="form.fenceName"></el-input>
        </el-form-item>
        <el-form-item label="Point1" inline="true" >
          <el-input v-model="form.point1X" placeholder="输入坐标X" style="display:inline"></el-input>
          <el-input v-model="form.point1Y" placeholder="输入坐标Y" style="display:inline"></el-input>
        </el-form-item>
        <el-form-item label="Point2">
          <el-input v-model="form.point2X" placeholder="输入坐标X" style="display:inline"></el-input>
          <el-input v-model="form.point2Y" placeholder="输入坐标Y" style="display:inline"></el-input>
        </el-form-item>
        <el-form-item label="Point3">
          <el-input v-model="form.point3X" placeholder="输入坐标X" style="display:inline"></el-input>
          <el-input v-model="form.point3Y" placeholder="输入坐标Y" style="display:inline"></el-input>
        </el-form-item>
        <el-form-item label="Point4">
          <el-input v-model="form.point4X" placeholder="输入坐标X" style="display:inline"></el-input>
          <el-input v-model="form.point4Y" placeholder="输入坐标Y" style="display:inline"></el-input>
        </el-form-item>
        <el-form-item label="车辆数目">
          <el-input v-model="form.vehicleCount" disabled></el-input>
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
  name: 'staff',
  components: {

  },
  data(){
    return {
      form:{},
      dialogVisible:false,
      total:10,
      currentPage:1,
      pageSize:10,
      search:'',
      tableData:[]
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      request.get("/fence", {
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search
        }
      }).then(res=>{
        console.log(res)
        this.tableData=res.data.records
        this.total=res.data.total
      })
    },

    add(){
      this.dialogVisible=true
      this.form={}
    },
    save(){

      if(this.form.fenceId)
      {
        request.put("/fence",this.form).then(res=>{

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
        request.post("/fence", this.form).then(res => {
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
  exp(){
      window.open("/fence/export")
  },
    handleEdit(row){
      this.form=JSON.parse(JSON.stringify(row))
      this.dialogVisible=true
      console.log(this.form.employeeId)
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
      request.delete("/fence/"+id).then(res=>{
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
