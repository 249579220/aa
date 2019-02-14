<template>
  <div id="login-bg">
    <div id="login-box">
      <div id="login-logo">
        <img src="../assets/img/logo.png">
      </div>
      <el-form ref="loginformref" :model="loginform" :rules="loginrules">
        <el-form-item prop="username">
          <el-input v-model="loginform.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginform.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="cz">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginform: {
        username: '',
        password: ''
      },
     loginrules: {
          username: [
            { required: true, message: '请输入名字', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
     }
    }
  },
  methods:{
     login() {
       this.$refs.loginformref.validate(async vali => {
         if(vali == true) {
           const {data:res} = await this.$http.post('login',this.loginform) 
           if(res.meta.status !== 200) {
            return this.$message.error('用户名或密码错误')
           }
           window.sessionStorage.setItem('token',res.data.token)
           this.$router.push('/home')
         }
       })
     },
     cz() {
       this.$refs.loginformref.resetFields()
     }
  }
}
</script>
<style lang="less" scoped>
#login-bg {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0px;
      padding: 20px;
      box-sizing: border-box;
    }
    #login-logo {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      background-color: #fff;
      padding: 8px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>