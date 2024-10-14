<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'


const tableData = ref([])

const { proxy } = getCurrentInstance()
const getUserData = async () => {
    let data = await proxy.$api.getUserData(config)
    // console.log(data)
    tableData.value = data.list.map(item => ({
        ...item,
        sexLabel: item.sex === '1' ? 'Male' : 'Female'
    }))
    config.total = data.count
}

const tableLabel = reactive([
    {
        prop: 'name',
        label: 'name'
    },
    {
        prop: 'age',
        label: 'age'
    },
    {
        prop: 'sexLabel',
        label: 'sex'
    },
    {
        prop: 'birth',
        label: 'birth',
        width: 200
    },
    {
        prop: 'addr',
        label: 'addr',
        width: 200

    },
])

const formInline = reactive({
    keyWord: '',
})

const config = reactive({
    name: '',
    total: 0,
    page: 1
})

const handleSearch = () => {
    config.name = formInline.keyWord
    getUserData()
}

const handleChange = (page) => {
    config.page = page
    getUserData()
}

const handleDelete = (val) => {
    ElMessageBox.confirm("Are you comfirm to delete this data?").then(async () => {
        
        await proxy.$api.deleteUser({ id: val.id })
        ElMessage({
            showClose: true,
            message: 'Successfully delete',
            type: 'success'
        })
        getUserData();
    })
}

const action = ref('add')
const dialogVisible =ref(false)
const formUser = reactive({
    sex:'1' 
})
const rules = reactive({
    name: [{ required: true, message: "Please fill in the name", trigger: "blur" }],
  age: [
    { required: true, message: "Please fill in the age", trigger: "blur" },
    { type: "number", message: "Please fill in the number" },
  ],
  sex: [{ required: true, message: "Choose the sex", trigger: "change" }],
  birth: [{ required: true, message: "Choose the birth date" }],
  addr:[{ required: true, message: 'Please fill in the address' }]

})

const handleClose = () =>{
    //獲取表單重置表單
    dialogVisible.value = false;
    proxy.$refs['userForm'].resetFields()

}

const handleCancel =() =>{
    dialogVisible.value = false;
    proxy.$refs['userForm'].resetFields()

}
const handleAdd = () =>{
    dialogVisible.value = true;
    action.value = 'add'
    
}

const timeFormat = (time) =>{
    var time = new Date(time)
    var year = time.getFullYear()
    var month = time.getMonth()+1
    var date = time.getDate()
    function add(m) {
        return m < 10 ? "0" +m :m
    }
}
const onSubmit = () =>{
    //validation
    proxy.$refs['userForm'].validate(async(valid) =>{
        if(valid){
            let res = null;
            formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth :
            timeFormat(formUser.birth)
            if(action.value === 'add'){
                res = await proxy.$api.addUser(formUser)
                console.log(formUser)
            }else{
                res = await proxy.$api.editUser(formUser)
                console.log(formUser)
            }
            if(res){
                dialogVisible.value = false
                proxy.$refs['userForm'].resetFields()
                getUserData()
            }
        }else{
            ElMessage({
                showClose:true,
                message:'Please fill in correct words',
                type:'error'
            })
        }
    })
}

const handleEdit = (val) =>{
    action.value = 'edit'
    dialogVisible.value = true
    //click the edit first then click the new button , the form already fill in by edit value, so need use nextTick
    nextTick(()=>{
        Object.assign(formUser,{...val,sex:''+val.sex})
    })
}

onMounted(() => {
    getUserData()
})
</script>
<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">New</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="Please Enter">
                <el-input placeholder="Please enter username" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">Search</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="item in tableLabel" :key="item.prop" :width="item.minWidth || 'auto'"
                :prop="item.prop" :label="item.label" />

            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        Edit
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pager" background layout="prev, pager, next" size="small" :total="config.total"
            @current-change="handleChange" />
    </div>
    <el-dialog 
    v-model="dialogVisible" 
    :title="action == 'add' ? 'Add User' : 'Edit User'" 
    width="35%"
    :before-close="handleClose"
    >
        <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
        <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="Name" prop="name">
                        <el-input v-model="formUser.name" placeholder="Fill in the name" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Age" prop="age">
                        <el-input v-model.number="formUser.age" placeholder="Fill in the age" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item class="select-clearn" label="Sex" prop="sex">
                        <el-select v-model="formUser.sex" placeholder="Please select">
                            <el-option label="Male" value="1" />
                            <el-option label="Female" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Birth" prop="birth">
                        <el-date-picker 
                        v-model="formUser.birth" 
                        type="date"     
                        placeholder="Please select" 
                        style="width: 100%"    
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="Addr" prop="addr">
                    <el-input v-model="formUser.addr" placeholder="Fill in the address" />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="danger" @click="handleCancel">Cancel</el-button>
                    <el-button type="primary" @click="onSubmit">Comfirm</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>

</template>

<style scoped lang="less">
.user-header {
    display: flex;
    justify-content: space-between;
}

.table {
    position: relative;
    height: 520px;

    .pager {
        position: absolute;
        right: 10px;
        bottom: 30px;
    }

    .el-table {
        width: 100%;
        height: 500px;
    }
    
}

.select-clearn{
    display: flex;
}
</style>