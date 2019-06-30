<template>
  <!-- 首页布局 -->
  <el-container class="homeWrapper">
    <el-header>
      <el-row>
        <el-col :span="8" class="logo">
          <img src="@/assets/logo.png" alt="黑马logo">
        </el-col>
        <el-col :span="8">
          <h1 class="title">电商后台管理系统</h1>
        </el-col>
        <el-col :span="8">
          <div class="welcome">
            <span>欢迎上海前端25期星曜会员</span>
            <a href="javascript:;" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 左侧导航 -->
        <el-menu :router="true" default-active="2" class="navMenu" @open="handleOpen" @close="handleClose"
          background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
         <!-- el-submenu菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home/users">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">用户列表</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
         <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      //弹出确认对话框，然后清除token
      this.$confirm("您是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //清除token，并跳转至登录页
        localStorage.removeItem("token");
        this.$router.push("/login");
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped lang="less">
// scoped表示只在此作用域生效
.homeWrapper {
  height: 100%;
  .el-header {
    padding: 0;
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    // line-height: 60px;

    .logo {
      text-align: left;
    }

    .title {
      margin: 0;
      line-height: 60px;
      color: #fff;
      font-size: 32px;
    }

    .welcome {
      line-height: 60px;
      font-weight: bold;
      text-align: right;
      padding-right: 30px;

      a {
        color: #b07a17;
        text-decoration: none;
      }
    }
  }

  .el-aside {
    background-color: #545c64;
    color: #333;
    line-height: 200px;
    .navMenu {
      width: 100%;
    }
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}
</style>
