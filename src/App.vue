<template>

  <div id="app">
    
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
		  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			  <span class="navbar-toggler-icon"></span>
		  </button>
      
      <div class="navbar-collapse collapse dual-collapse2" id="navbarNav">
        <div class="navbar-collapse w-100 order-1 order-md-0">
          <img src="@/assets/profileowl.jpg" class="responsive-img" width="100" height="60" alt="EduConnect Logo">
          <div v-if="!isLoggedIn" class="navbar-nav">
            <!-- <router-link to="/home"><a class="nav-item nav-link"><i class="fas fa-home fa-fw " style="color:white"></i> Home</a></router-link> -->
            <a href="/career" class="nav-link"><i class="far fa-calendar fa-fw " style="color:white"></i> Career</a>
            <a href="/timeseries" class="nav-link"><i class="far fa-newspaper fa-fw" style="color:white"></i> Time Series Charts</a>
          </div>
        </div>

        <div v-if="isLoggedIn" class="navbar-collapse w-100 order-3">
          <ul class="navbar-nav ml-auto">
            <router-link to="/"><li class="nav-item"><a class="nav-link" @click="logout()" ><i class="fas fa-sign-in-alt" style="color:white"></i> Logout</a></li></router-link>
          </ul>
        </div>
		  </div>
	</nav>
  <br><br><br><br>
  
    <router-view/>
  </div>
</template>


<script>
  export default {
    name: 'app',
    methods: {
      logout() {
        this.$store.dispatch('logout');
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      }
    }
  }
</script>




<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    #content {
        margin: auto;
        width: 1024px;
        background-color: #FFFFFF;
        padding: 20px;
    }
</style>




