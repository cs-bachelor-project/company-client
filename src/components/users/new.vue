<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <h4 class="mb-3">New User</h4>
      <form @submit.prevent="createUser">
        <div class="row">
          <div class="col-md-6 mb-3">
            <input type="text" class="form-control" placeholder="Full Name" v-model="entry.name" required />
          </div>

          <div class="col-md-6 mb-3">
            <input type="email" class="form-control" placeholder="Email address" v-model="entry.email" required />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <input type="password" class="form-control" placeholder="Password" v-model="entry.password" required />
          </div>

          <div class="col-md-6 mb-3">
            <input type="password" class="form-control" placeholder="Password Confirmation" v-model="entry.password_confirmation" required />
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-12 mb-3">
            <select class="custom-select" multiple v-model="entry.roles" required>
              <option :value="role.id" v-for="(role, index) in roles" :key="index">{{role.title}}</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary btn-lg btn-block" type="submit">Create User</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
      },
      roles: {},
    };
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.meta.ready = false;

      try {
        let res = await this.$axios.get('roles');
        this.roles = res.data.data;

        this.meta.ready = true;
      } catch (error) {
        console.log(error.response.data);
        this.$store.commit("alerting", { type: "danger", data: error.response.data.message });
      }
    },
    async createUser() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.post('users', this.entry);

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})

        this.$router.push({name: 'users'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit("alerting", { type: "validation", data: error.response.data.errors });
      }
    }
  }
};
</script>