<template>
    <el-aside :width="width">
        <el-menu background-color="#545c64" text-color="#fff" :collapse="isCollapse" :collapse-transition="false" :default-active="activeMenu">
            <h3 v-show="!isCollapse">Universal backend Management_System</h3>
            <h3 v-show="isCollapse">UBMS</h3>
            <el-menu-item v-for="item in noChildren" :index="item.path" :key="item.path" @click="handleMenu(item)">
                <component :is="item.icon" class="icons"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu v-for="item in hasChildren" :index="item.path" :key="item.path">
                <template #title>
                    <component :is="item.icon" class="icons"></component>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(subItem, subIndex) in item.children" :index="subItem.path"
                        :key="subIndex.path" @click="handleMenu(subItem)">
                        <component :is="subItem.icon" class="icons"></component>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>
<script setup>
import { ref, computed } from 'vue'
import {useAllDataStore} from '@/stores'
import {useRouter,useRoute} from 'vue-router'
// const list = ref([
//     {
//         path: '/home',
//         name: 'home',
//         label: 'Home',
//         icon: 'house',
//         url: 'Home'
//     },
//     {
//         path: '/mall',
//         name: 'mall',
//         label: 'Mall',
//         icon: 'video-play',
//         url: 'Mall'
//     },
//     {
//         path: '/user',
//         name: 'user',
//         label: 'User',
//         icon: 'user',
//         url: 'User'
//     },
//     {
//         path: 'other',
//         label: 'Other',
//         icon: 'location',
//         children: [
//             {
//                 path: '/page1',
//                 name: 'page1',
//                 label: 'Page 1',
//                 icon: 'setting',
//                 url: 'Page1'
//             },
//             {
//                 path: '/page2',
//                 name: 'page2',
//                 label: 'Page 2',
//                 icon: 'setting',
//                 url: 'Page2'
//             }
//         ]
//     }
// ])

const list = computed(()=>store.state.menuList)
const noChildren = computed(() => list.value.filter(item => !item.children))
// console.log(noChildren);
const hasChildren = computed(() => list.value.filter(item => item.children))
// console.log(hasChildren);
const store = useAllDataStore()
const isCollapse = computed(()=> store.state.isCollapse)
//width
const width = computed(() => store.state.isCollapse ? '64px' : '180px' )
//router use for handleMenu
const router = useRouter()
//route use for activeMenu
const route = useRoute()
const activeMenu = computed(() => route.path)
const handleMenu = (item) =>{
    router.push(item.path)
    store.selectMenu(item)
}
</script>

<style lang="less" scoped>
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-menu {
    border-right: none;

    h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}

.el-aside {
    height: 100vh;
    background-color: #545c64;
}
</style>