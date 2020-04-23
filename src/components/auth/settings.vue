<template>
  <div>
    <loading v-if="!meta.ready" />

    <div class="row" v-if="meta.ready">
      <div class="col-md-12">
        <h4 class="mb-3">Personal Information</h4>
        <div class="row">
          <div class="col-md-6 mb-3">
            <input type="text" class="form-control" required v-model="entry.name" @change="changeName" placeholder="Full Name" />
          </div>

          <div class="col-md-6 mb-3">
            <input type="email" class="form-control" v-model="entry.email" @change="changeEmail" placeholder="Email address" />
          </div>
        </div>

        <hr class="mb-3" />

        <h4 class="mb-3">Password</h4>
        <div class="row">
          <div class="col-md-4 mb-3">
            <input type="password" class="form-control" required v-model="password" placeholder="Password" />
          </div>

          <div class="col-md-4 mb-3">
            <input type="password" class="form-control" required v-model="password_confirmation" placeholder="Password confirmation" />
          </div>

          <div class="col-md-4 mb-3">
            <button class="btn btn-primary btn-block" type="button" @click="changePassword">Change Password</button>
          </div>
        </div>

        <hr class="mb-3" />

        <div>
          <h4 class="mb-3">Company Information</h4>
          <div class="row">
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Company Name" required v-model="entry.company.name" :disabled="!hasAnyRole(['admin'])" />
            </div>

            <div class="col-md-4 mb-3">
              <select class="custom-select" required v-model="entry.company.country" :disabled="!hasAnyRole(['admin'])" >
                <option value disabled>Country</option>
                <option>Denmark</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="City" required v-model="entry.company.city" :disabled="!hasAnyRole(['admin'])" />
            </div>
          </div>
            
          <div class="row">
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Street" required v-model="entry.company.street" :disabled="!hasAnyRole(['admin'])" />
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Street No." required v-model="entry.company.street_number" :disabled="!hasAnyRole(['admin'])" />
            </div>
            <div class="col-md-4 mb-3">
              <button class="btn btn-primary btn-block" type="button" @click="updateCompany()" :disabled="!hasAnyRole(['admin'])">Update Company Information</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {},
      password: '',
      password_confirmation: '',
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.meta.ready = false

      try {
        let res = await this.$axios.get('auth/me?include=company')
        this.entry = res.data

        this.meta.ready = true
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.errors})
      }
    },
    async changeName() {
      if (this.entry.name == ''){
        return
      }

      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`auth/me`, {
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
        let res = await this.$axios.patch(`auth/me`, {
          email: this.entry.email,
        })

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'validation', data: error.response.data.errors})
      }
    },
    async changePassword() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`auth/password`, {
          password: this.password,
          password_confirmation: this.password_confirmation,
        })

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'validation', data: error.response.data.errors})
      }
    },
    async updateCompany() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`auth/me/company`, this.entry.company)

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
  },
}
</script>
