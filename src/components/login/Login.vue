<template>
  <!-- <div class="loginWrapper"> -->
    <!-- layout布局 -->
    <el-row type="flex" class="loginForm" justify="center" align="middle">
      <el-col :span="6" class="loginContent" :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
        <el-form label-position="top" :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  <!-- </div> -->
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$http
        .post("/login", this.loginForm)
        .then(res => {
          var { data, meta } = res.data;
          if (meta.status === 200) {
            //登录成功,需要存储token并跳转路由
            console.log(data);

            localStorage.setItem('token',data.token)
            this.$router.push("/home");
          } else {
            this.$message.error({
              type: "error",
              message: meta.msg
              // duration: 2000
            });
          }
        });
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          //成功调用登录接口
          // console.log(this.loginForm);
          this.login();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
  .loginWrapper,.loginForm{
    height: 100%;
    background-color: #2D434C;
  }
  .loginContent {
    background-color: #fff;
    min-width: 240px;
    padding: 20px;
    border-radius: 10px;
  }
</style>
