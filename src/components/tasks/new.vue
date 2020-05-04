<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <h4 class="mb-3">New Task</h4>
      <form @submit.prevent="createTask">
        <div class="row">
          <div class="col-md-3 mb-3">
            <input type="text" class="form-control" placeholder="Passenger Name" v-model="entry.person_name" required />
          </div>

          <div class="col-md-3 mb-3">
            <select class="custom-select" v-model="entry.user_id">
                <option value="">Choose Driver</option>
                <option :value="driver.id" v-for="driver in drivers" :key="driver.id">{{driver.name}}</option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <input type="text" class="form-control" v-model="entry.note" placeholder="Note (optional)" maxlength="255">
          </div>
        </div>

        <div class="row">
          <div class="col-md-2 mb-3">
            <input type="number" class="form-control" placeholder="Pick up Postal code" required v-model="entry.details[0].postal" @keyup="entry.details[0].city = getCity($event.target.value)"/>
          </div>

          <div class="col-md-2 mb-3">
            <select class="custom-select" required v-model="entry.details[0].city" @change="entry.details[0].postal = getPostal($event.target.value)">
              <option value disabled>Pick Up City</option>
              <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
            </select>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].street" placeholder="Pick up Street" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].street_number" placeholder="Pick up Street number" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[0].phone" placeholder="Pick up Phone (Optional)">
          </div>

          <div class="col-md-2 mb-3">
            <datetime type="datetime" placeholder="Pick up time" input-class="form-control" format="yyyy-LL-dd hh:mm:ss" v-model="entry.details[0].scheduled_at" required></datetime>
          </div>
        </div>

        <div class="row">
          <div class="col-md-2 mb-3">
            <input type="number" class="form-control" placeholder="Pick up Postal code" required v-model="entry.details[1].postal" @keyup="entry.details[1].city = getCity($event.target.value)"/>
          </div>

          <div class="col-md-2 mb-3">
            <select class="custom-select" required v-model="entry.details[1].city" @change="entry.details[1].postal = getPostal($event.target.value)">
              <option value disabled>Pick Up City</option>
              <option :value="city" v-for="(zip, city) in cities" :key="zip">{{city}}</option>
            </select>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].street" placeholder="Drop off Street" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].street_number" placeholder="Drop off Street number" required>
          </div>

          <div class="col-md-2 mb-3">
            <input type="text" class="form-control" v-model="entry.details[1].phone" placeholder="Drop off Phone (Optional)">
          </div>

          <div class="col-md-2 mb-3">
            <datetime type="datetime" placeholder="Drop off time" input-class="form-control" format="yyyy-LL-dd hh:mm:ss" v-model="entry.details[1].scheduled_at" required></datetime>
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
            postal: '',
            city: '',
            street: '',
            street_number: '',
            phone: '',
            action: 'pick',
            scheduled_at: '',
          },
          {
            postal: '',
            city: '',
            street: '',
            street_number: '',
            phone: '',
            action: 'drop',
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
        let res = await this.$axios.get('companies/drivers');
        this.drivers = res.data;

        this.meta.ready = true;
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    async createTask() {
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.post('companies/tasks', this.entry);

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)
        this.$router.push({name: 'tasks'})
      } catch (error) {
        this.$toast.clear(loading)
        error.response.data.errors.forEach(e => this.$toast.error(e, {timeout: false}))
      }
    }
  }
};
</script>