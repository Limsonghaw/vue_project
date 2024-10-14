<script setup>
import CommonAside from '@/components/CommonAside.vue'
import commonHeader from '@/components/CommonHeader.vue'
import commonTab from '@/components/commonTab.vue'
// export default{
//     components:{
//         'common-aside':CommonAside
//     }
// } 

</script>
<template>

<div class="common-layout">
    <el-container class="lay-container">
        <!-- Customise the components on the left side -->
         <common-aside/>
         <el-container>
            <el-header class="el-header">
                <common-header/>
            </el-header>
            <commonTab/>
            <el-main class="right-main">
                <Router-view></Router-view>
            </el-main>
         </el-container>
    </el-container>
</div>
</template>

<style scoped lang="less">
.common-layout,.lay-container{
    height: 100%;
}

.el-header{
    background-color: #333;
}
</style>