<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <form class="needs-validation" @submit.prevent="register">
          <h4 class="mb-0">Choose a subscription plan</h4>
          <div class="row">
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Freemium</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title">Free</h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 5 drivers</li>
                  </ul>
                  <button type="button" class="btn btn-lg btn-block btn-primary">Choose</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Lite</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title">
                    $15
                    <small class="text-muted">/ mo</small>
                  </h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 15 drivers</li>
                  </ul>
                  <button type="button" class="btn btn-lg btn-block btn-primary">Choose</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Premium</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">
                    $29
                    <small class="text-muted">/ mo</small>
                  </h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 50 drivers</li>
                  </ul>
                  <button type="button" class="btn btn-lg btn-block btn-primary">Choose</button>
                </div>
              </div>
            </div>
          </div>

          <h4 class="mb-3">Company Information</h4>
          <div class="row">
            <div class="col-md-12 mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Company Name"
                required
                v-model="data.company.name" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <select class="custom-select" required v-model="data.company.country">
                <option value disabled  >Country</option>
                <option>Denmark</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <select class="custom-select" required v-model="data.company.city">
                <option value disabled>City</option>
                <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Street" required v-model="data.company.street" />
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Street No." required v-model="data.company.street_number" />
            </div>
          </div>

          <h4 class="mb-3">Personal Information</h4>
          <div class="row">
            <div class="col-md-6 mb-3">
              <input type="text" class="form-control" placeholder="Full Name" required v-model="data.user.name" />
            </div>

            <div class="col-md-6 mb-3">
              <input type="email" class="form-control" placeholder="Email address" required v-model="data.user.email" />
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

          <hr class="mb-3" />
          <button class="btn btn-primary btn-lg btn-block" type="submit">Create an account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import cityData from "../assets/city.json"
export default {
  data() {
    return {
      cities: {},
      errors: {},
      data: {
        company: {
          name: "",
          country: "",
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
    }
  },
  created() {
    this.cities = cityData
  }
}
</script>
