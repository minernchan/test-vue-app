<template>
  <div class="login">
    <img alt="EduConnect logo" src="../assets/profileowl.jpg" width="350"> <br><br>
    <h2>Please Log in to EduConnect with your Facebook account</h2> <br>

    <facebook-login class="button"
      appId="275263693320314"
      @login="onLogin"
      @logout="onLogout"
      @sdk-loaded="sdkLoaded">
    </facebook-login>
  </div>
</template>

<script>
import facebookLogin from 'facebook-login-vuejs';
export default {
  name: 'login',
  data() {
    return {
      idImage, loginImage, mailImage, faceImage,
      isConnected: false,
      name: '',
      email: '',
      personalID: '',
      FB: undefined
    }
  },
  components: { facebookLogin },
  methods: {
    getUserData() {
      this.FB.api('/me', 'GET', { fields: 'id,name,email' },
        userInformation => {
          this.personalID = userInformation.id;
          this.email = userInformation.email;
          this.name = userInformation.name;
        }
      )
    },
    sdkLoaded(payload) {
      this.isConnected = payload.isConnected
      this.FB = payload.FB
      if (this.isConnected) this.getUserData()
    },
    onLogin() {
      this.isConnected = true
      this.getUserData()
      this.$store.dispatch("login", this.getUserData()) // need to test this function with the vuex state
      this.$router.push(this.$route.query.redirect || '/career') // this as well
    },
    onLogout() {
      this.isConnected = false;
    },
  }
}
</script>

