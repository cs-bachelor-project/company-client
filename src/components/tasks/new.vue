<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <h4 class="mb-3">New Task</h4>
      <form @submit.prevent="createTask">
        <div class="row">
          <div class="col-md-6 mb-3">
            <input type="text" class="form-control" placeholder="Passenger Name" v-model="entry.person_name" required />
          </div>

          <div class="col-md-6 mb-3">
            <select class="custom-select" required v-model="entry.user_id">
              <option value="" disabled>Choose Driver</option>
                <option :value="driver.id" v-for="driver in drivers" :key="driver.id">{{driver.name}}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-1 mb-3">
            <input type="text" class="form-control" value="Denmark" disabled>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].city" placeholder="Pick up City" required>
          </div>

          <div class="col-md-4 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].street" placeholder="Pick up Street" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].street_number" placeholder="Pick up Street number" required>
          </div>

          <div class="col-md-3 mb-3">
            <datetime type="datetime" format="yyyy-LL-dd hh:mm:ss" v-model="entry.details[0].scheduled_at" required></datetime>
          </div>
        </div>

        <div class="row">
          <div class="col-md-1 mb-3">
            <input type="text" class="form-control" value="Denmark" disabled>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].city" placeholder="Drop off City" required>
          </div>

          <div class="col-md-4 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].street" placeholder="Drop off Street" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].street_number" placeholder="Drop off Street number" required>
          </div>

          <div class="col-md-3 mb-3">
            <datetime type="datetime" format="yyyy-LL-dd hh:mm:ss" v-model="entry.details[1].scheduled_at" required></datetime>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 mb-3">
            <input type="text" class="form-control" v-model="entry.note" placeholder="Note (optional)" maxlength="255">
          </div>
        </div>

        <button class="btn btn-primary btn-lg btn-block" type="submit">Create Task</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {
        person_name: '',
        note: '',
        user_id: '',
        details: [
          {
            city: '',
            street: '',
            street_number: '',
            task: 'pick',
            scheduled_at: '',
          },
          {
            city: '',
            street: '',
            street_number: '',
            task: 'drop',
            scheduled_at: '',
          }
        ],
      },
      drivers: {},
    };
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.meta.ready = false;

      try {
        let res = await this.$axios.get('drivers');
        this.drivers = res.data;

        this.meta.ready = true;
      } catch (error) {
        console.log(error.response.data);
        this.$store.commit("alerting", { type: "danger", data: error.response.data.message });
      }
    },
    async createTask() {
      this.$store.state.loading = true

      try {
        let res = await this.$axios.post('tasks', this.entry);

        this.$store.state.loading = false
        this.$store.commit('alerting', {type: 'success', data: res.data.message})

        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$store.state.loading = false
        this.$store.commit("alerting", { type: "validation", data: error.response.data.errors });
      }
    }
  }
};
</script>