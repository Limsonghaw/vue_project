<script setup>
import { ref,getCurrentInstance,onMounted,reactive } from 'vue'
import * as echarts from 'echarts'
// import axios from 'axios'
const {proxy} = getCurrentInstance()


const getImageUrl = (user) =>{
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
} 

//这个tableData是假数据，等会我们使用axios请求mock数据  
const tableData = ref([])
const countData = ref([])
const chartData = ref([])
const observer = ref(null)
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
//这个是折线图和柱状图 两个图表共用的公共配置
//echart 官網
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {},
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})
// axios({
//     url:'/api/home/getTableData',
//     method:'get'
// }).then(res=>{
//     // console.log(res.data)
//     // learn write fake data
//     if(res.data.code == 200){
//         // console.log(res.data.data.tableData)
//         tableData.value = res.data.data.tableData
//     }
// })

const getTableData = async() =>{
    const data = await proxy.$api.getTableData()
    // console.log(data)
    tableData.value = data.tableData
}
const getCountData = async() =>{
    const data = await proxy.$api.getCountData()
    // console.log(data)
    countData.value = data
}
const getChartData = async() =>{
    const {orderData,userData, videoData} = await proxy.$api.getChartData()
    // console.log(orderData)

    //對第一個圖標進行x軸 和series 賦值
    xOptions.xAxis.data = orderData.date;
    xOptions.series = Object.keys(orderData.data[0]).map(val =>{
        return {
            name:val,
            data:orderData.data.map(item => item[val]),
            type:'line'
        }
    })
    // console.log(Object.keys(orderData.data[0]))
    const oneEchart = echarts.init(proxy.$refs['echart'])
    oneEchart.setOption(xOptions)

    // 對第二個表格進行渲染
    xOptions.xAxis.data = userData.map(item=> item.date)
    xOptions.series = [
        {
            name:'new user',
            data:userData.map(item => item.new),
            type:'bar'
        },
        {
            name:'active user',
            data:userData.map(item => item.active),
            type:'bar'
        },
    ]

    const twoChart = echarts.init(proxy.$refs['userEchart'])
    twoChart.setOption(xOptions)


    //對piechart進行渲染
    pieOptions.series = [
        {
            data:videoData,
            type:'pie'
        }
    ]

    const threeEChart = echarts.init(proxy.$refs['videoEChart'])
    threeEChart.setOption(pieOptions)

    //監聽頁面的變化
    //如果監聽的容器大小發生了變化
     observer.value = new ResizeObserver(() =>{
        oneEchart.resize()
        twoChart.resize()
        threeEChart.resize()
     })

     //容器存在
     if(proxy.$refs['echart']){
        observer.value.observe(proxy.$refs['echart'])
     }

}
onMounted(()=>{
    getTableData()
    getCountData()
    getChartData()
})
</script>
<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 20px">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="getImageUrl('user')" class="user">
                    <div class="user-info">
                        <p class="user-info-admin">Admin</p>
                        <p class="user-info-p">super admin</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>last time login: <span>2024-8-31</span></p>
                    <p>last time location: <span>Malaysia</span></p>
                </div>
            </el-card>

            <el-card shadow="hover" class="user-table">
                <el-table :data="tableData">
                    <el-table-column
                        v-for="(val,key) in tableLabel"
                        :key="key"
                        :prop="key"
                        :label="val"
                    >
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
        <el-col :span="16" style="margin-top: 20px;">
            <div class="num"> 
                <el-card
                    :body-style="{display:'flex',padding:0}"
                    v-for="item in countData"
                    :key="item.name">
                    <component :is="item.icon" class="icons" :style="{background:item.color}"></component>
                    <div class="detail">
                        <p class="num">${{ item.value }}</p>
                        <p class="txt">${{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card class="top-echart">
                <div ref="echart" style="height: 280px;"></div>
            </el-card>
            <div class="graph">
                <el-card>
                    <div ref="userEchart" style="height:240px"></div>
                </el-card>
                <el-card>
                    <div ref="videoEChart" style="height:240px"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<style scoped lang="less">
.home{
    height: 100%;
    overflow: hidden;
    .user{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        .user-info{
            p{
                line-height: 40px;
            }
            .user-info-p{
                color: #999;
            }
            .user-info-admin{
                font-size: 35px;
            }
        }
        img{
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }
    }
    .login-info{
        p{
            line-height: 30px;
            font-size: 14px;
            color:#999;
            span{
                color: #666;
                margin-left: 60px;
            }
        }
    }
    .user-table{
        margin-top: 20px;
    }
    .num{
        display:flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-card{
            width: 32%;
            margin-bottom: 20px;
        }
        .icons{
            width: 80px;
            height: 80px;
            font-size: 30px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }
        .detail{
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .num{
                font-size: 30px;
                margin-bottom: 10px;
            }
            .txt{
                font-size: 15px;
                text-align: center;
                color: #999;
            }
        }
    }
    .graph{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .el-card{
            width:48%;
            height: 260px;
        }
    }
}
</style>