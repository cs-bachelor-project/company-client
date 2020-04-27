<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <h4 class="mb-3">{{entry.name}} <span class="float-right" v-if="hasAnyRole(['admin'])"><a href="" @click.prevent="deleteUser">Delete User</a></span></h4>
      
      <table class="table text-center" v-if="!entry">
        <tr>
          <td>We didn't find anything - just empty space.</td>
        </tr>
      </table>

      <table class="table table-hover" v-if="entry">
        <tr>
          <th scope="col">#</th>
          <td><input type="text" class="form-control" :value="entry.id" disabled></td>
        </tr>
        <tr>
          <th scope="col">Name</th>
          <td><input type="text" class="form-control" v-model="entry.name" @change="changeName" :disabled="!hasAnyRole(['admin'])"></td>
        </tr>
        <tr>
          <th scope="col">Email</th>
          <td><input type="text" class="form-control" v-model="entry.email" @change="changeEmail" :disabled="!hasAnyRole(['admin'])"></td>
        </tr>
        <tr>
          <th scope="col">Roles</th>
          <td>
            <select class="custom-select" multiple rows="5" v-model="selectedRoles" @change="changeRoles" :disabled="!hasAnyRole(['admin'])">
              <option :value="role.id" v-for="(role, index) in roles" :key="index">{{role.title}}</option>
            </select>
          </td>
        </tr>
        <tr v-if="entry.tasks.length">
          <th scope="col">Tasks</th>
          <td>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Passenger Name</th>
                  <th scope="col">Note</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in entry.tasks" :key="task.id">
                  <th scope="row">{{task.id}}</th>
                  <td>{{task.person_name}}</td>
                  <td>{{task.note}}</td>
                  <td><router-link :to="{name: 'task-preview', params: {id: task.id}}" class="nav-link">View</router-link></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {},
      roles: [],
      selectedRoles: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.meta.ready = false

      try {
        let res = await this.$axios.get(`companies/users/${this.$route.params.id}?include=roles,tasks`)
        this.entry = res.data

        let rolesRes = await this.$axios.get('auth/roles')
        this.roles = rolesRes.data.data

        this.entry.roles.forEach(role => this.selectedRoles.push(role.id))
        this.meta.ready = true
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
        this.$router.push({name: 'users'})
      }
    },
    async changeName() {
      if (this.entry.name == ''){
        return
      }

      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`companies/users/${this.$route.params.id}`, {
          name: this.entry.name,
        })

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'validation', data: error.response.data.errors})
      }
    },
    async changeEmail() {
      if (this.entry.email == ''){
        return
      }

      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`companies/users/${this.$route.params.id}`, {
          email: this.entry.email,
        })

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'validation', data: error.response.data.errors})
      }
    },
    async changeRoles() {
      if (this.selectedRoles.length == 0){
        return
      }

      this.$store.state.loading = true

      try {
        let res = await this.$axios.post(`companies/users/${this.$route.params.id}/roles`, {
          roles: this.selectedRoles,
        })

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'validation', data: error.response.data.errors})
      }
    },
    async deleteUser() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.delete(`companies/users/${this.$route.params.id}`)

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})

        this.$router.push({name: 'users'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
  }
}
</script>