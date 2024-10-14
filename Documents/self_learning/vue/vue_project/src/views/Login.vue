<script setup>
import {reactive,getCurrentInstance} from 'vue'
import {useAllDataStore} from '@/stores'
import {useRouter} from 'vue-router'

const loginForm = reactive({
    username:'',
    password:''
})
const {proxy} =getCurrentInstance()
const store = useAllDataStore()
const router = useRouter()
const handlelogin=async()=>{
    const res = await proxy.$api.getMenu(loginForm)
    // console.log(res)
    // 拿到菜單后 要在哪裏顯示？
    store.updateMenuList(res.menuList)
    store.state.token = res.token
    store.addMenu(router)
    router.push('/home')
}
</script>
<template>
    <div class="body-login">
        <el-form :model="loginForm" class="login-container">
            <h1>Welcome Login</h1>
            <el-form-item>
                <el-input type="input" placeholder="Enter the account number" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" placeholder="Enter the password" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handlelogin">Login</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="less">
.body-login{
    width: 100%;
    height: 100vh;
    background-image: url("../assets/images/background.png");
    background-size: 100%;
    overflow: hidden;
}
.login-container{
    width:700px;    
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius:15px;
    padding:35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    margin: 250px auto;
    h1{
        text-align:center;
        margin-bottom: 20px;
        color: #505450;
    }
    :deep(.el-form-item__content){
        justify-content: center;
    }
}
</style>