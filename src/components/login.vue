<template>
  <div class="login">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px">
      <img src="../assets/QQ图片20191025202658.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" type="password" v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="result">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '用户名长度在3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '密码长度在3-12位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    result () {
      this.$refs.form.resetFields()
    },
    // 点击登录
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        console.log(meta, data)

        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message.success(meta.msg)
          this.$router.push('/index')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}

</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #2d434c;
  overflow: hidden;
  .el-form{
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    background: #fff;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;
    img{
      width: 120px;
      height: 120px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -60px;
      transform: translateX(-50%);
    }
    .el-button:first-child{
      margin-right: 80px;
    }
  }
}
</style>
