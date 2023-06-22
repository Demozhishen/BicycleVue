<template>
  <div class="block text-center" style="width: 100%;height: 100%;margin-top: 20px" >

    <el-carousel height="720px" style="width: 100%">
      <el-carousel-item v-for="item in 4" :key="item" >
        <img class="p1" src="../assets/3.jpg"  v-show="item===2">
        <img class="p2" src="../assets/2.jpeg"  v-show="item===1">
        <img class="p3" src="../assets/4.jpg"  v-show="item===3">
        <img class="p2" src="../assets/2.jpeg"  v-show="item===4">
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<style scoped>


.p2 {
  color: #475669;
  opacity: 0.70;
  line-height: 150px;
  text-align: center;
  margin-left: 350px;
}
.p1{
  opacity: 0.90;
  line-height: 150px;
  text-align: center;
  margin-left: 90px;
  width: 90%;
  height: 90%;
}
.p3{
  opacity: 0.90;
  line-height: 150px;
  text-align: center;
  margin-left: 280px;
  width: 1080px;
  height: 719px;
}


</style>
