<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <h4 class="mb-3">{{entry.person_name}} <span class="float-right"><a href="" @click.prevent="deleteTask">Delete Task</a></span></h4>
      
      <table class="table text-center" v-if="!entry">
        <tr>
          <td>We didn't find anything - just empty space.</td>
        </tr>
      </table>

      <form @submit.prevent="updateTask">
        <table class="table table-hover" v-if="entry">
          <tr v-if="entry.cancellation != null">
            <th>The driver cancelled this task</th>
            <td>{{entry.cancellation.reason}}</td>
          </tr>
          <tr v-if="entry.details.find(elm => elm.action == 'pick').completed_at != null">
            <th>Picked up at</th>
            <td>{{entry.details.find(elm => elm.action == 'pick').completed_at}}</td>
          </tr>
          <tr v-if="entry.details.find(elm => elm.action == 'drop').completed_at != null">
            <th>Dropped off at</th>
            <td>{{entry.details.find(elm => elm.action == 'drop').completed_at}}</td>
          </tr>
          <tr>
            <th scope="col">#</th>
            <td><input type="text" class="form-control" :value="entry.id" disabled></td>
          </tr>
          <tr>
            <th scope="col">Passenger Name</th>
            <td><input type="text" class="form-control" v-model="entry.person_name" required :disabled="isDisabled"></td>
          </tr>
          <tr>
            <th scope="col">Note</th>
            <td><input type="text" class="form-control" v-model="entry.note" maxlength="255" :disabled="isDisabled"></td>
          </tr>
          <tr>
            <th scope="col">Driver</th>
            <td>
              <select class="custom-select" v-model="entry.user_id" :disabled="isDisabled">
                <option value="">Choose Driver</option>
                <option :value="driver.id" v-for="driver in drivers" :key="driver.id">{{driver.name}}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th scope="col">Pick up details</th>
            <td>
              <div class="row">
                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" :value="entry.details.find(elm => elm.action == 'pick').country" disabled>
                </div>

                <div class="col-md-2 mb-3">
                  <input type="number" class="form-control" placeholder="Postal code" required v-model="entry.details.find(elm => elm.action == 'pick').postal" @keyup="entry.details.find(elm => elm.action == 'pick').city = getCity($event.target.value)" :disabled="isDisabled"/>
                </div>

                <div class="col-md-2 mb-3">
                  <select class="custom-select" required v-model="entry.details.find(elm => elm.action == 'pick').city" @change="entry.details.find(elm => elm.action == 'pick').postal = getPostal($event.target.value)" :disabled="isDisabled">
                    <option value disabled>City</option>
                    <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
                  </select>
                </div>

                <div class="col-md-4 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'pick').street" placeholder="Street" required :disabled="isDisabled">
                </div>

                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'pick').street_number" placeholder="Street number" required :disabled="isDisabled">
                </div>
              </div>

              <div class="row">
                <div class="col-md-5 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'pick').phone" placeholder="Phone" :disabled="isDisabled">
                </div>
                <div class="col-md-7 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'pick').scheduled_at" title="Time in UTC" placeholder="Time" required :disabled="isDisabled">
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="col">Drop off details</th>
            <td>
              <div class="row">
                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" :value="entry.details.find(elm => elm.action == 'drop').country" disabled>
                </div>

                <div class="col-md-2 mb-3">
                  <input type="number" class="form-control" placeholder="Postal code" required v-model="entry.details.find(elm => elm.action == 'drop').postal" @keyup="entry.details.find(elm => elm.action == 'drop').city = getCity($event.target.value)" :disabled="isDisabled"/>
                </div>

                <div class="col-md-2 mb-3">
                  <select class="custom-select" required v-model="entry.details.find(elm => elm.action == 'drop').city" @change="entry.details.find(elm => elm.action == 'drop').postal = getPostal($event.target.value)" :disabled="isDisabled">
                    <option value disabled>City</option>
                    <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
                  </select>
                </div>

                <div class="col-md-4 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'drop').street" placeholder="Street" required :disabled="isDisabled">
                </div>

                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'drop').street_number" placeholder="Street number" required :disabled="isDisabled">
                </div>
              </div>

              <div class="row">
                <div class="col-md-5 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'drop').phone" placeholder="Phone" :disabled="isDisabled">
                </div>
                <div class="col-md-7 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.action == 'drop').scheduled_at" title="Time in UTC" placeholder="Time" required :disabled="isDisabled">
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <button class="btn btn-primary btn-lg btn-block" type="submit" :disabled="isDisabled">Update Task</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {},
      drivers: {},
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.meta.ready = false

      try {
        let res = await this.$axios.get(`companies/tasks/${this.$route.params.id}?include=details,cancellation`)
        this.entry = res.data

        let driverRes = await this.$axios.get('companies/drivers')
        this.drivers = driverRes.data

        this.meta.ready = true
      } catch (error) {
        this.$toast.error('Sorry an error occurred')
        this.$router.push({name: 'tasks'})
      }
    },
    async updateTask() {
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.patch(`companies/tasks/${this.$route.params.id}`, this.entry)

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)

        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$toast.clear(loading)
        error.response.data.errors.forEach(e => this.$toast.error(e, {timeout: false}))
      }
    },
    async deleteTask() {
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.delete(`companies/tasks/${this.$route.params.id}`)

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)

        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$toast.clear(loading)
        this.$toast.error('Sorry an error occurred')
      }
    },
  },
  computed: {
    isDisabled() {
      return this.entry.cancellation != null || (this.entry.details[0].completed_at != null && this.entry.details[1].completed_at != null)
    }
  }
}
</script>