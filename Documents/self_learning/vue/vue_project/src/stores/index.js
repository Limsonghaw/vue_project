import {defineStore} from 'pinia';
import { ref,watch } from 'vue';
function iniState(){
    return{
        isCollapse:false,
        tags:[
            {
                path:'/home',
                name:'home',
                label:'Home',
                icon:'home',
            },
        ],
        currentMenu:null,
        menuList:[],
        token:"",
        routerList:[],
    }
}
export const useAllDataStore = defineStore('allData', () => {
    // ref state attribute
    // computed getters
    //function actions

    const state = ref(iniState());

    watch(state,
        (newObj)=>{
        if(!newObj.token) return;
        localStorage.setItem("store", JSON.stringify(newObj));
    },
    {deep: true})

    function selectMenu(val){
        // console.log(val);
        
        if(val.name === 'home'){
            state.value.currentMenu = null;
        }else{
            state.value.currentMenu = val;
            let index = state.value.tags.findIndex(item=>item.name === val.name);
            index === -1 ? state.value.tags.push(val) : "";
        }
    }

    function updateTags(tag){
        let index = state.value.tags.findIndex(item => item.name === tag.name)
        state.value.tags.splice(index,1)
    }

    function updateMenuList(val){
        state.value.menuList = val;
    }

    function addMenu(router,type){
        if(type === 'refresh'){
            if(JSON.parse(localStorage.getItem('store'))){
                state.value =JSON.parse(localStorage.getItem('store'))
                //
                state.value.routerList = [];
            }else{
                return;
            }
        }
        const menu = state.value.menuList;
        const module = import.meta.glob('../views/**/*.vue');
        const routeArr = [];
        menu.forEach((item)=>{
            if(item.children){
                item.children.forEach(val=>{
                    let url = `../views/${val.url}.vue`;
                    val.component = module[url];
                    routeArr.push(...item.children);
                });
            }else{
                let url = `../views/${item.url}.vue`;
                item.component = module[url];
                routeArr.push(item);

            }
        });

        // console.log(router.getRoutes());
        let routers = router.getRoutes()
        routers.forEach(item =>{
            if(item.name == 'main' || item.name == 'login' || item.name == "404"){
                return;
            }else{
                router.removeRoute(item.name);
            }
        })
        routeArr.forEach(item=>{
            state.value.routerList.push(router.addRoute("main",item));
        })
    }
    // console.log(state)
    function clean(){
        state.value.routerList.forEach((item)=>{
            console.log(item);
            if(item) item();
        });
        state.value = iniState();
        //delete the localstorage
        localStorage.removeItem('store');
    }
    return { state,selectMenu,updateTags,updateMenuList,addMenu ,clean};
  })