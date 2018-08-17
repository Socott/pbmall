<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition md-show" v-show="mdShow">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">Login in</div>
            <button class="md-close" @click="closeShow()">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
              </div>
              <ul>
                <li class="regi_form_input">
                  <i class="icon IconPeople"></i>
                  <input type="text" tabindex="1" name="loginname" placeholder="User Name" v-model="userName" data-type="loginname" class="regi_login_input regi_login_input_left">
                </li>
                <li class="regi_form_input noMargin">
                  <i class="icon IconPwd"></i>
                  <input type="password" tabindex="2" name="password" placeholder="Password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text">
                </li>
              </ul>
            </div>
            <div class="login-wrap"><a href="javascript:;" class="btn-login" @click="login()">登  录</a></div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overlay" @click="closeShow()"></div>
    </div>
</template>

<script>
    export default {
        name: "Model"
    }
</script>

<style scoped>

</style>
