// overall project api management
import request from "./request";


//request left side table data
 export default{
    getTableData(){
        return request({
            url:'/home/getTableData',
            // url:'https://apifoxmock.com/m1/4068509-0-default/api/home/getTable',
            method:"get",
        });
    },
    getCountData(){
        return request({
            url:'/home/getCountData',
            method:"get",
        });
    },
    getChartData(){
        return request({
            url:'/home/getChartData',
            method:"get",
        });
    },
    getUserData(data){
        return request({
            url:'/home/getUserData',
            method:"get",
            data,
        });
    },
    deleteUser(data){
        return request({
            url:'/user/deleteUser',
            method:"get",
            data,
        });
    },
    addUser(data){
        return request({
            url:'/user/addUser',
            method:"post",
            data,
        });
    },
    editUser(data){
        return request({
            url:'/user/editUser',
            method:"post",
            data,
        });
    },
    getMenu(params){
        return request({
            url:'/permission/getMenu',
            method:"post",
            data:params,
        });
    },
 };