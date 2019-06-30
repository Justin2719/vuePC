<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="userBreadCrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询输入框和添加按钮 -->
    <el-row :gutter="20" style="margin-bottom:10px">
      <el-col :span="8">
        <el-input placeholder="请输入用户名" v-model="queryStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="showUserAddDialog">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格组件 -->
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row.id, scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="showUserEditDailog(scope.row)"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="curPage"
      @current-change="changePage" class="pagColor">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="userEditDialog" @close="closeUserEditDialog">
      <el-form :model="userEditForm" :rules="userEditRules" ref="userEditForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input disabled :value="userEditForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userEditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userEditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    //发送请求，获取数据
    this.getUserList();
  },
  data() {
    return {
      userList: [],
      queryStr: "",
      pageSize: 3,
      curPage: 1,
      total: 0,
      // 控制用户添加对话框的展示和隐藏
      userAddDialog: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userAddRules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '用户名长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '密码长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 控制编辑用户对话框的展示和隐藏
      userEditDialog: false,
      userEditForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      userEditRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            // 如果需要在值改变或者失去焦点的时候，都触发验证，可以传递两个
            // trigger: 'change, blur'

            // 当前值改变，就会触发
            trigger: 'change'
          }
        ]
      }
    };  //return
  },
  methods: {
    async getUserList(curPage = 1) {
      let res = await this.$http
        .get("/users", {
          params: {
            pagenum: curPage,
            pagesize: 3,
            query: this.queryStr || ""
          }
          //将token传递给服务器，这样才能调用接口 （公共main.js已配置）
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        const { data, meta } = res.data;
        if (meta.status === 200) {
          //获取数据
          this.userList = data.users;
          this.total = data.total;
          this.curPage = data.pagenum;
        }
    },
    //页码改变
    changePage(curPage) {
      this.getUserList(curPage);
    },
    // 查询
    queryUserList() {
      // console.log(this.queryStr)
      this.curPage = 1;
      this.getUserList();
    },
    // 启用和禁用用户
    changeUserState(id, curState) {
      this.$http.put(`/users/${id}/state/${curState}`)
      .then(res => {
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            type: "success",
            message: data.mg_state === 0 ? "禁用成功" : "启用成功",
            duration: 1000
          });
        } else {
          this.$message({
            type: "error",
            message: meta.msg,
            duration: 1000
          });
        }
      });
    },
    // 展示用户添加对话框
    showUserAddDialog() {
      this.userAddDialog = true
    },

    // 关闭对话框重置表单
    closeUserAddDialog() {
      // console.log('对话框关闭了')
      this.$refs.userAddForm.resetFields()
    },

    // 添加用户
    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // 成功
          // console.log('验证成功')
          this.$http.post('/users', this.userAddForm).then(res => {
            // console.log(res)
            const { meta } = res.data
            if (meta.status === 201) {
              // 1 关闭对话框
              // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
              this.userAddDialog = false

              // 3 重新获取列表数据
              this.getUserList()
              // this.curPage = 1
            }
          })
        } else {
          // console.log('验证失败')
          return false
        }
      })
    },

    showUserEditDailog(curUser) {
    // 先获取到当前用户的数据
    // 数据交给 userEditForm 后，就会展示在编辑对话框中
      for (const key in this.userEditForm) {
        this.userEditForm[key] = curUser[key]
      }

    // 打开用户编辑对话框
      this.userEditDialog = true
    },

    // 关闭用户编辑对话框
    closeUserEditDialog() {
      this.$refs.userEditForm.resetFields()
    },

    // 点击确定按钮，修改用户数据
    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.userEditForm
          // console.log('表单验证成功')
          this.$http
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              // console.log(res)
              const { data, meta } = res.data
              if (meta.status === 200) {
                // 更新该用户的数据
                const editUser = this.userList.find(item => item.id === id)
                editUser.email = data.email
                editUser.mobile = data.mobile

                // 关闭对话
                this.userEditDialog = false
              }
            })
        } else {
          // console.log('表单验证失败')
          return false
        }
      })
    },
    // 根据用户id删除用户
    delUserById(id) {
      // console.log(id)
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            // console.log(res)
            const { meta } = res.data
            if (meta.status === 200) {
              this.$message({
                type: 'success',
                message: meta.msg
              })

              // this.getUserList()
              // this.curPage = 1

              const index = this.userList.findIndex(item => item.id === id)
              this.userList.splice(index, 1)
              const totalPage = Math.ceil(this.userList.length / this.pageSize)
              if (this.curPage > totalPage) {
                this.getUserList(--this.curPage)
              }
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
  }
};
</script>

<style>
.userBreadCrumb {
  background-color: #fff;
  line-height: 40px;
  padding: 0 10px;
  margin-bottom: 10px;
}
.pagColor {
  margin-top: 10px;
}
</style>
