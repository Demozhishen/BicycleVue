<template>

  <div class="bmap" id="container"></div>
  <ul class="drawing-panel" style="position: absolute;right: 120px;top: 120px;list-style-type:none">
    <!-- <li class="bmap-btn bmap-polyline" id="polyline" @click="draw('polyline')"></li> -->
    <li class="bmap-btn bmap-rectangle" id="rectangle" @click="draw('rectangle')" />
    <li class="bmap-btn bmap-polygon" id="marker" @click="draw('marker')" ></li>
    <li class="bmap-btn bmap-circle" id="close" @click="draw(1)"></li>
  </ul>

  <el-dialog
      :visible.sync="dialogVisible"
      title="Tips"
      width="30%"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>
</template>

<script>

import { useStore } from 'vuex'
import request from "@/utils/request";

export default {
  name: 'BmapDemo',
  mounted() {

   this.load();



  },
  created() {

  },
  data() {
    return {
      styleOptions: {
        strokeColor: "#5E87DB", // 边线颜色
        fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 2, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2, // 填充透明度，取值范围0-1
      },
      labelOptions: {
        borderRadius: "2px",
        background: "#FFFBCC",
        border: "1px solid #E1E1E1",
        color: "#703A04",
        fontSize: "12px",
        letterSpacing: "0",
        padding: "5px",
      },
      drawingManager: null,
      drawingType: '',
      dialogVisible:false,
      tableData:[],
      fenceData:[],
      form:{},
    }
  },
  methods:{
    draw(str) {
      if(str===1)
      {
        this.drawingManager.close();
        console.log(11)
      }
      // 进行绘制
      if ( this.drawingManager.isOpen && this.drawingManager.getDrawingMode() === str ) {
        this.drawingManager.close();
      } else {
        this.drawingManager.setDrawingMode(str);
        this.drawingManager.open();
      }
    },
    load(){
      request.get("/vehicle/get").then(res=>{
        console.log(res.data)
        this.tableData=res.data
      })
      request.get("/fence/get").then(res=>{
        console.log(res.data)
        this.fenceData=res.data
        this.initMap();
      })

    },
    drawPointsOnMap(map) {

      this.tableData.forEach((point) => {

        const marker = new BMap.Marker(new BMap.Point(point.heng, point.shu));
        const infoWindow = new BMap.InfoWindow("车辆id为："+point.id+"<br>经度:"+point.heng+"<br>维度:"+point.shu+"<br>车辆状态:"+point.status+"<br>蓝牙ID:"+point.bluetoothId);
        marker.addEventListener("mouseover", function () {
          this.openInfoWindow(infoWindow);
        });
        map.addOverlay(marker);
      });

    },
    drawPolygonsOnMap(map) {
      class CustomOverlay {
        constructor(map, position, name) {
          this.map = map;
          this.position = position;
          this.name = name;
          this.div = null;
        }

        addToMap() {
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.zIndex = BMap.Overlay.getZIndex(this.position.lat);
          div.style.backgroundColor = "#fff";
          div.style.border = "1px solid #ccc";
          div.style.padding = "3px";
          div.style.color = "#333";
          div.style.fontFamily = "Arial, sans-serif";
          div.style.fontSize = "12px";
          div.innerHTML = this.name;

          const pixel = this.map.pointToOverlayPixel(this.position);
          div.style.left = pixel.x + "px";
          div.style.top = pixel.y + "px";

          this.map.getPanes().labelPane.appendChild(div);

          this.div = div;
        }
      }
      this.fenceData.forEach(polygon => {
        const path = [];
        path.push(new BMap.Point(polygon.point1X, polygon.point1Y));
        path.push(new BMap.Point(polygon.point3X, polygon.point3Y));
        path.push(new BMap.Point(polygon.point2X, polygon.point2Y));
        path.push(new BMap.Point(polygon.point4X, polygon.point4Y));
        const center = new BMap.Point((polygon.point1X + polygon.point2X) / 2, (polygon.point1Y + polygon.point2Y) / 2);

        // 创建自定义覆盖物
        const customOverlay = new CustomOverlay(map, center, polygon.fenceName);
        // 添加自定义覆盖物到地图上
        customOverlay.addToMap();
        const polygonObj = new BMap.Polygon(path,{strokeWeight: 1,fillColor:"rgba(57,202,215,0.49)"});

        map.addOverlay(polygonObj);
      });
    },
    putCar(lng,lat){
      this.form.heng=lng
      this.form.shu=lat
      this.form.status="空闲中"
      request.post("/vehicle/", this.form,).then(res => {
        console.log(res)
        this.$message({
          type:"success",
          message:"新增车辆成功"
        })
      })
    },
    putFence(){
      request.post("/fence/", this.form,).then(res => {
        console.log(res)
        this.$message({
          type:"success",
          message:"新增围栏成功"
        })
      })
    },

    initMap(){
      var map = new BMap.Map('container')
      var point = new BMap.Point(116.34974,39.957902);
      const radius = 500; // 半径，单位为米
      const circle = new BMap.Circle(point, radius, {
       // fillColor: "#FF0000", // 填充颜色
        strokeColor: "red", // 边线颜色
        strokeWeight: 5, // 边线宽度
        strokeOpacity: 0.8, // 边线透明度
        fillOpacity: 0.3 // 填充透明度
      });
      const distance = this.getDistance(118, 40, 116.34974,39.957902);

// 判断点是否在圆形内部
      const isInside = distance <= radius;

      console.log(isInside);


      map.addOverlay(circle);
      map.centerAndZoom(point, 26)
      map.enableScrollWheelZoom(true)
      var label = new window.BMap.Label('北交大', {
        position: point, // 设置标注的地理位置
        offset: new window.BMap.Size(0, 0) // 设置标注的偏移量
      })
      // 添加标签
      map.addOverlay(label) // 将标注添加到地图中
      this.drawPointsOnMap(map)
      this.drawPolygonsOnMap(map)
      const BMAP_DRAWING_MARKER = 'marker'
      const BMAP_DRAWING_POLYLINE = 'polyline'
      const BMAP_DRAWING_CIRCLE = 'circle'
      const BMAP_DRAWING_RECTANGLE = 'rectangle'
      const BMAP_DRAWING_POLYGON = 'polygon'
      /*map.addEventListener('click', function(e) {
        alert('点击的经纬度：' + e.latlng.lng + ', ' + e.latlng.lat);
      });*/
      this.drawPointsOnMap(map)

      var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,       //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      }
      this.drawingManager = new BMapLib.DrawingManager(map, {isOpen: close,
        drawingType: BMAP_DRAWING_CIRCLE, enableDrawingTool: false,
        enableCalculate: false,
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          offset: new BMap.Size(5, 5),
          drawingTypes : [
            BMAP_DRAWING_MARKER,
            BMAP_DRAWING_CIRCLE,
            BMAP_DRAWING_POLYLINE,
            BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_RECTANGLE
          ]
        },
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions,
        rectangleOptions: {
          strokeWeight: 1 ,// 设置线条宽度为2（用于绘制矩形）
          fillColor:"rgba(57,202,215,0.49)"
        },
      });

      //this.drawingManager.addEventListener("overlaycomplete", );


      //e.getPath获取坐标。length共有多少坐标，用for循环遍历坐标
      map.addEventListener('rightclick', function(e) {
        const { lng, lat } = e.point;

        const isConfirmed = window.confirm(`是否确认点击坐标：${lng}, ${lat}?`);

        if (isConfirmed) {
          // 用户确认操作，执行相应的逻辑
          // ...
        } else {
          // 用户取消操作，执行相应的逻辑
          // ...
        }


      });
      this.drawingManager.addEventListener("rectanglecomplete", (e,overlay) => {
        const rectangle = overlay;
        class CustomOverlay {
          constructor(map, position, name) {
            this.map = map;
            this.position = position;
            this.name = name;
            this.div = null;
          }

          addToMap() {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.zIndex = BMap.Overlay.getZIndex(this.position.lat);
            div.style.backgroundColor = "#fff";
            div.style.border = "1px solid #ccc";
            div.style.padding = "3px";
            div.style.color = "#333";
            div.style.fontFamily = "Arial, sans-serif";
            div.style.fontSize = "12px";
            div.innerHTML = this.name;

            const pixel = this.map.pointToOverlayPixel(this.position);
            div.style.left = pixel.x + "px";
            div.style.top = pixel.y + "px";

            this.map.getPanes().labelPane.appendChild(div);

            this.div = div;
          }
        }
        // 获取矩形的四个顶点坐标
        const bounds = rectangle.getBounds();
        const sw = bounds.getSouthWest(); // 西南角
        const ne = bounds.getNorthEast(); // 东北角
        const nw = new BMap.Point(sw.lng, ne.lat); // 西北角
        const se = new BMap.Point(ne.lng, sw.lat); // 东南角

        // 构造确认消息
        const confirmMessage = `是否确认绘制该围栏？\n\n西南角坐标：${sw.lng}, ${sw.lat}\n东北角坐标：${ne.lng}, ${ne.lat}\n西北角坐标：${nw.lng}, ${nw.lat}\n东南角坐标：${se.lng}, ${se.lat}`;

        // 弹出确认框
        const isConfirmed = window.confirm(confirmMessage);

        if (isConfirmed) {
          // 用户确认操作，执行绘制逻辑

          // 返回矩形的四个顶点坐标
          const vertices = [sw, ne, nw, se];
          const input = window.prompt("请输入围栏名称：");

          if (input) {
            // 用户点击了确定，并输入了内容


            this.form.point1X=sw.lng
            this.form.point1Y=sw.lat
            this.form.point2X=ne.lng
            this.form.point2Y=ne.lat
            this.form.point3X=nw.lng
            this.form.point3Y=nw.lat
            this.form.point4X=se.lng
            this.form.point4Y=se.lat
            this.form.fenceName=input
            this.putFence()
            const center = new BMap.Point((sw.lng + ne.lng) / 2, (sw.lat + ne.lat) / 2);

            // 创建自定义覆盖物
            const customOverlay = new CustomOverlay(map, center, input);
            // 添加自定义覆盖物到地图上
            customOverlay.addToMap();
            map.addOverlay(rectangle);
            // 进行相应的处理
          } else {
            // 用户点击了取消或没有输入内容
            map.removeOverlay(rectangle);
            // 可进行相应的处理
          }

          console.log(vertices); // 可根据实际需求进行处理
        } else {
          // 用户取消操作，不进行绘制
          map.removeOverlay(rectangle);
        }
      });


      this.drawingManager.addEventListener("overlaycomplete", (e) => {
        if (e.drawingMode === BMAP_DRAWING_MARKER) {
          const marker = e.overlay;

          // 弹出确认框
          const point = marker.getPosition();

          // 构造确认消息
          const confirmMessage = `是否确认在该点投放车辆？\n经度：${point.lng}\n纬度：${point.lat}`;
          const isConfirmed = window.confirm(confirmMessage);
          const distance = this.getDistance(point.lat, point.lng, 39.957902, 116.34974);

          const isInside = distance <= radius;
          if (isConfirmed) {
            // 用户确认操作，执行绘制逻辑
            if(isInside){
              map.addOverlay(marker);
              this.putCar(point.lng,point.lat);
            }else
            {
              alert("超出投放范围！！！")
              map.removeOverlay(marker);
            }


          } else {
            // 用户取消操作，不进行绘制
            map.removeOverlay(marker);
          }
        }
      });



    },
     getDistance(lat1, lng1, lat2, lng2) {
      const EARTH_RADIUS = 6378137; // 地球半径，单位为米
      const radLat1 = (lat1 * Math.PI) / 180.0;
      const radLat2 = (lat2 * Math.PI) / 180.0;
      const a = radLat1 - radLat2;
      const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
      let s =
          2 *
          Math.asin(
              Math.sqrt(
                  Math.pow(Math.sin(a / 2), 2) +
                  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
              )
          );
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000; // 保留小数点后四位
      return s;
}

  },



}
</script>

<style scoped>
.bmap {
  margin:50px;
  padding:50px;
  width: 1400px;
  height: 600px;
  border: 1px solid #000;
}
.drawing-panel {
  z-index: 999;
  position: absolute;
  top: 14rem;
  margin-left: 2.5rem;
  padding-left: 0;
  border-radius: .25rem;
  height: 47px;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.bmap-btn {
  border-right: 1px solid #d2d2d2;
  float: left;
  width: 64px;
  height: 100%;
  background-image: url("@/assets/img_1.png");
  cursor: pointer;
}


.drawing-panel .bmap-rectangle {
  background-position: -325px 0;
}

.drawing-panel .bmap-polygon {
  background-position: -65px 0;
}

.drawing-panel .bmap-circle {
  background-position: 0px 0;
}

</style>

