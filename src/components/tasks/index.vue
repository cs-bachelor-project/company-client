<template>
  <div>
    <h4 class="mb-3">
      <a href="" @click.prevent="loadData(true)" v-if="completed != 'all'">All Tasks</a>
      <span v-else>All Tasks</span> |

      <a href="" @click.prevent="loadUncompleted" v-if="completed != 'uncompleted'">Uncompleted Tasks</a>
      <span v-else>Uncompleted Tasks</span> |
      
      <a href="" @click.prevent="loadCompleted" v-if="completed != 'completed'">Completed Tasks</a>
      <span v-else>Completed Tasks</span>

      <span class="float-right"><router-link :to="{name: 'task-new'}">New Task</router-link></span>
    </h4>

    <table class="table">
      <tr>
        <td colspan="6"><input type="text" @keyup="search" class="form-control" placeholder="Search by Passenger name or Note" v-model="q"></td>
      </tr>
    </table>

    <loading v-if="!meta.ready" />

    <div v-if="meta.ready">
      <table class="table text-center" v-if="!entries.length">
        <tr>
          <td>We didn't find anything - just empty space.</td>
        </tr>
      </table>

      <table class="table table-hover" v-if="entries.length">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Passenger Name</th>
            <th scope="col">Pick Up</th>
            <th scope="col">Drop Off</th>
            <th scope="col">Note</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <th scope="row">{{entry.id}}</th>
            <td>{{entry.person_name}}</td>
            <td :title="utcToLocal(entry.details[0].scheduled_at)">{{utcToLocal(entry.details[0].scheduled_at).fromNow()}}</td>
            <td :title="utcToLocal(entry.details[1].scheduled_at)">{{utcToLocal(entry.details[1].scheduled_at).fromNow()}}</td>
            <td>{{entry.note}}</td>
            <td><router-link :to="{name: 'task-preview', params: {id: entry.id}}" class="nav-link">View</router-link></td>
          </tr>
          <tr>
            <td colspan="6" class="text-center card-bg-secondary py-1"><button type="button" class="btn btn-link" v-on:click.prevent="loadMore()" :disabled="meta.currentPage >= meta.totalPages">Load Older Entries</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
          entries: [],
          q: '',
          completed: 'uncompleted',
      }
  },
  created() {
      this.loadData()
  },
  methods: {
    async loadData(all=false) {
      this.meta.ready = false
      this.q = ''

      if(all == true) {
        this.completed = 'all'
      }

      try {
        let res = await this.$axios.get(`tasks?include=details&status=${this.completed}`)

        this.entries = res.data.data
        this.meta.totalPages = res.data.meta.last_page
        this.meta.nextPageUrl = res.data.links.next

        this.meta.ready = true
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
    async loadMore() {
      try {
        let res = await this.$axios.get(this.meta.nextPageUrl)

        this.entries = this.entries.concat(res.data.data)
        this.meta.currentPage = res.data.meta.current_page
        this.meta.nextPageUrl = res.data.links.next
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
    async search() {
      try {
        this.meta.ready = false

        if(this.q == '') {
          return this.loadData()
        }

        let res = await this.$axios.get(`tasks/search?include=details&status=${this.completed}&q=${this.q}`)

        this.entries = res.data.data
        this.meta.totalPages = res.data.meta.last_page
        this.meta.nextPageUrl = res.data.links.next
        
        this.meta.ready = true
      } catch (error) {
        this.$store.commit('alerting', {type: 'danger', data: error.response.data.message})
      }
    },
    loadCompleted() {
      this.completed = 'completed'
      this.loadData()
    },
    loadUncompleted() {
      this.completed = 'uncompleted'
      this.loadData()
    },
  }
}
</script>