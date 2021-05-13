<template>
<!-- 登录login -->
  <div class="login-container">
    <!-- 左侧bg -->
    <img src="../../assets/images/index/login.png" alt="">
    <!-- 右侧登录表单 -->
    <div class="right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="off"
        label-position="right"
      >
        <!-- 登录头部logo+txt  chengjiezhang -->
        <div class="title-container">
          <div class="logo">
            <img src="@/assets/slideLogo.png" alt="">
            <div>
              <p style="font-size:1.6rem">海洋石油工程股份有限公司</p>
              <p style="font-size:1.2rem">Offshore oil Engineering Co.Ltd</p>
            </div>
          </div>
          <!-- <h3 class="title" style="letter-spacing: 0.2em">登录</h3> -->
        </div>

        <el-form-item prop="userid">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="userid"
            v-model="loginForm.userid"
            placeholder="请输入账号"
            name="userid"
            type="text"
            tabindex="1"
            clearable
            autocomplete="off"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              clearable
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <!-- 用户登录按钮 -->
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%;"
            @click.native.prevent="handleLogin"
          >登录
          </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userid: '0001',
        password: '123456'
      },
      loginRules: {
        userid: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.userid === '') {
      this.$refs.userid.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
          // this.$store
          //   .dispatch('/api/Account/LogIn', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container{
      position: absolute;
      top:0;
      bottom:0;
      left:0;
      right:0;
  }
  @import  './index.scss';
</style>
