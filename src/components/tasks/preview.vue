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
          <tr v-if="entry.details.find(elm => elm.task == 'pick').completed_at != null">
            <th>Picked up at</th>
            <td>{{entry.details.find(elm => elm.task == 'pick').completed_at}}</td>
          </tr>
          <tr v-if="entry.details.find(elm => elm.task == 'drop').completed_at != null">
            <th>Dropped off at</th>
            <td>{{entry.details.find(elm => elm.task == 'drop').completed_at}}</td>
          </tr>
          <tr>
            <th scope="col">#</th>
            <td><input type="text" class="form-control" :value="entry.id" disabled></td>
          </tr>
          <tr>
            <th scope="col">Passenger Name</th>
            <td><input type="text" class="form-control" v-model="entry.person_name"></td>
          </tr>
          <tr>
            <th scope="col">Note</th>
            <td><input type="text" class="form-control" v-model="entry.note" maxlength="255"></td>
          </tr>
          <tr>
            <th scope="col">Driver</th>
            <td>
              <select class="custom-select" required v-model="entry.user_id">
                <option :value="driver.id" v-for="driver in drivers" :key="driver.id">{{driver.name}}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th scope="col">Pick up details</th>
            <td>
              <div class="row">
                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" :value="entry.details.find(elm => elm.task == 'pick').country" disabled>
                </div>

                <div class="col-md-3 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'pick').city" placeholder="City" required>
                </div>

                <div class="col-md-5 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'pick').street" placeholder="Street" required>
                </div>

                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'pick').street_number" placeholder="Street number" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-2 mb-3"><strong>Time</strong></div>
                <div class="col-md-10 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'pick').scheduled_at" title="Time in UTC" required>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="col">Drop off details</th>
            <td>
              <div class="row">
                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" :value="entry.details.find(elm => elm.task == 'drop').country" disabled>
                </div>

                <div class="col-md-3 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'drop').city" placeholder="City" required>
                </div>

                <div class="col-md-5 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'drop').street" placeholder="Street" required>
                </div>

                <div class="col-md-2 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'drop').street_number" placeholder="Street number" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-2 mb-3"><strong>Time</strong></div>
                <div class="col-md-10 mb-3">
                  <input type="text" class="form-control" v-model="entry.details.find(elm => elm.task == 'drop').scheduled_at" title="Time in UTC" required>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <button class="btn btn-primary btn-lg btn-block" type="submit">Update Task</button>
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
        let res = await this.$axios.get(`companies/tasks/${this.$route.params.id}?include=details`)
        this.entry = res.data

        let driverRes = await this.$axios.get('companies/drivers')
        this.drivers = driverRes.data

        this.meta.ready = true
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
        this.$router.push({name: 'tasks'})
      }
    },
    async updateTask() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.patch(`companies/tasks/${this.$route.params.id}`, this.entry)

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})

        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
    async deleteTask() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.delete(`companies/tasks/${this.$route.params.id}`)

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})

        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
  },
}
</script>