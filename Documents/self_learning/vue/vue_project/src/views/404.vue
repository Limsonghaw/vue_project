<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()

const getImageUrl = (img) =>{
    return new URL(`../assets/images/${img}.png`,import.meta.url).href;
}

const goHome=()=>{

    router.go(-2)
}
</script>
<template>
<div class="exeption">
    <img :src="getImageUrl(404)" class="img"/>
    <el-button class="btn-home" @click="goHome">Go to last page</el-button>
</div>
</template>

<style scoped lang="less">
.exeption{
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .img{
        width: 100% !important  ;
        height: 100%;
        object-fit: cover; /* 确保图片覆盖整个容器，同时保持比例 */
        position: absolute; /* 使图片绝对定位，以便覆盖容器 */
        top: 0;
        left: 0;
    }
}
.btn-home {
    position: absolute;
    bottom: 20px; /* 距离底部 20px */
    right: 20px; /* 距离右侧 20px */
    z-index: 10; /* 确保按钮位于图片之上 */
}

</style>