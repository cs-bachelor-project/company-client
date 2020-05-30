<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <form class="needs-validation" @submit.prevent="register">
          <h4 class="mb-3">Company Information</h4>
          <div class="row">
            <div class="col-md-3 mb-3">
              <input type="number" class="form-control" placeholder="CVR" required v-model="data.company.cvr" @keyup="getCompanyInfo"/>
            </div>
            <div class="col-md-9 mb-3">
              <input type="text" class="form-control" placeholder="Company Name" required v-model="data.company.name" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <select class="custom-select" required v-model="data.company.country">
                <option value disabled  >Country</option>
                <option>Denmark</option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <input type="number" class="form-control" placeholder="Postal code" required v-model="data.company.postal" @keyup="data.company.city = getCity($event.target.value)"/>
            </div>
            <div class="col-md-2 mb-3">
              <select class="custom-select" required v-model="data.company.city" @change="data.company.postal = getPostal($event.target.value)">
                <option value disabled>City</option>
                <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Street" required v-model="data.company.street" />
            </div>
            <div class="col-md-2 mb-3">
              <input type="text" class="form-control" placeholder="Street No." required v-model="data.company.street_number" />
            </div>
          </div>

          <h4 class="mb-3">Personal Information</h4>
          <div class="row">
            <div class="col-md-6 mb-3">
              <input type="text" class="form-control" placeholder="Full Name" required v-model="data.user.name" />
            </div>

            <div class="col-md-6 mb-3">
              <input type="email" class="form-control" placeholder="Email address (company's primary email address)" required v-model="data.user.email" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <input type="password" class="form-control" placeholder="Password" required v-model="data.user.password" />
            </div>

            <div class="col-md-6 mb-1">
              <input type="password" class="form-control" placeholder="Password Confirmation" required v-model="data.user.password_confirmation" />
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 my-3">
              <input type="checkbox" v-model="agreed"> I agree to the terms of service and privacy policy
            </div>
          </div>

          <hr class="mb-3" />
          <button class="btn btn-primary btn-lg btn-block" type="submit" :disabled="!agreed">Create an account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agreed: false,
      cities: {},
      errors: {},
      data: {
        company: {
          name: "",
          country: "Denmark",
          postal: "",
          city: "",
          street: "",
          street_number: ""
        },
        user: {
          name: "",
          email: "",
          password: "",
          password_confirmation: ""
        }
      }
    }
  },
  methods: {
    async register() {
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.post("auth/register", this.data)

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)

        this.$router.push({name: 'login'})
      } catch (error) {
        this.$toast.clear(loading)
        error.response.data.errors.forEach(e => this.$toast.error(e, {timeout: false}))
      }
    },
    async getCompanyInfo() {
      if (this.data.company.cvr.length != 8) {
        return
      }

      try {
        let res = await this.$axios.get(`https://cvrapi.dk/api?search=${this.data.company.cvr}&country=dk`)

        this.data.company.name = res.data.name
        this.data.company.postal = res.data.zipcode
        this.data.company.city = res.data.city
        this.data.company.street = res.data.address.split(/^(\D*)(.*)/)[1]
        this.data.company.street_number = res.data.address.split(/^(\D*)(.*)/)[2]

      } catch (error) {
        return 
      }
    },
  }
}
</script>
