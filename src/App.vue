<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link :to="{name: 'index'}" class="navbar-brand">Bachelor Project</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link :to="{name: 'users'}" class="nav-link">Users</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link :to="{name: 'tasks'}" class="nav-link">Tasks</router-link>
            </li>
          </ul>

          <form class="w-100 px-1" @submit.prevent="sendMsg" v-if="isLoggedIn()">
            <input type="text" class="form-control" placeholder="Send a message to all online drivers" v-model="msg" />
          </form>

          <ul class="navbar-nav float-lg-right">
            <li class="nav-item" v-if="!isLoggedIn()">
              <router-link :to="{name: 'pricing'}" class="nav-link">Pricing</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn()">
              <router-link :to="{name: 'register'}" class="nav-link">Register</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn()">
              <router-link :to="{name: 'login'}" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link :to="{name: 'settings'}" class="nav-link">Settings</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link :to="{name: 'subscriptions'}" class="nav-link">Subscription</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <a href class="nav-link" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main role="main" class="container">
      <div class="card">
        <div class="card-body">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
    };
  },
  created() {
    if (this.isLoggedIn()) {
      if (!this.hasAnyRole(['admin', 'manager'])) {
        this.logout()
      }

      window.Echo.private(`company.${this.getUserInfo().company_id}.info`).listen('.task-detail-completed', data => {
        let action = data.action == 'pick' ? 'picked up' : 'dropped off'

        this.$toast.success(`${data.person_name} ${action}`)
      }).listen('.cancelled', data => {
        this.$toast.info(`${data.person_name} was cancelled`)
      }).listen('.new', data => {
        this.$toast.info(`New task by ${data.person_name}`)
      })
    }
  },
  methods: {
    async sendMsg () {
      if (this.msg == '') {
        return
      }

      try {
        await this.$axios.post('companies/messages', {msg: this.msg})

        this.$toast.success('Message sent successfully')
        this.msg = ''
      } catch (error) {
        this.$toast.error('Sorry an error occurred')
      }
    },
  }
};
</script>

<style lang="scss">
.card {
  top: 50px;
}
.progress,
.progress-bar {
  position: fixed;
  width: 100%;
  height: 7px !important;
  z-index: 9999;
  border-radius: 0;
}
</style>