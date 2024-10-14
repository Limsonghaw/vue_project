import mock from "mockjs";
import homeApi from './MockData/home'
import userApi from "./MockData/user"
import menuApi from './MockData/permission'
//1攔截的路徑 2方法 3製造出假數據
mock.mock(/api\/home\/getTableData/,'get',homeApi.getTableData);
mock.mock(/api\/home\/getCountData/,'get',homeApi.getCountData);
mock.mock(/api\/home\/getChartData/,'get',homeApi.getChartData);

mock.mock(/api\/home\/getUserData/,'get',userApi.getUserList);
mock.mock(/api\/user\/deleteUser/,'get',userApi.deleteUser);
mock.mock(/api\/user\/addUser/,'post',userApi.createUser);
mock.mock(/api\/user\/editUser/,'post',userApi.updateUser);

mock.mock(/api\/permission\/getMenu/,'post',menuApi.getMenu);