<template>
  <div class="Login">
    <h4 class="mb-4">Login</h4>

    <form @submit.prevent="login">
      <div class="form-group">
        <input type="email" class="form-control" placeholder="Email address" required v-model="data.email" />
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Password" required v-model="data.password" />
      </div>

      <button type="submit" class="btn btn-lg btn-block btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: {},
      data: {
        email: '',
        password: '',
        type: 'management',
      },
    }
  },
  methods: {
    async login() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.post('auth/login', this.data)

        this.setAuthToken(res.data.access_token)

        this.$store.state.loading = false
        this.$router.push({name: 'index'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    }
  },
}
</script>