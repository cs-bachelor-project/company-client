<template>
  <div>
    <h4 class="mb-3">
      <a href="" @click.prevent="loadData(true)" v-if="status != 'all'">All Tasks</a>
      <span v-else>All Tasks</span> |

      <a href="" @click.prevent="loadUncompleted" v-if="status != 'uncompleted'">Uncompleted Tasks</a>
      <span v-else>Uncompleted Tasks</span> |
      
      <a href="" @click.prevent="loadCompleted" v-if="status != 'completed'">Completed Tasks</a>
      <span v-else>Completed Tasks</span> |
      
      <a href="" @click.prevent="loadCancelled" v-if="status != 'cancelled'">Cancelled Tasks</a>
      <span v-else>Cancelled Tasks</span>
      

      <span class="float-right">
        <router-link :to="{name: 'statistics'}"><svg class="bi bi-bar-chart" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/></svg></router-link> |
        <router-link :to="{name: 'task-new'}">New Task</router-link>
      </span>
    </h4>

    <table class="table">
      <tr>
        <td colspan="6"><input type="text" @keyup="search" class="form-control" placeholder="Search by passenger name, note, postal code, city, street or phone number" v-model="q"></td>
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
            <th scope="col">Driver</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <th scope="row">{{entry.id}}</th>
            <td>{{entry.person_name}}</td>
            <td :title="utcToLocal(entry.details[0].scheduled_at)">{{utcToLocal(entry.details[0].scheduled_at).fromNow()}}</td>
            <td :title="utcToLocal(entry.details[1].scheduled_at)">{{utcToLocal(entry.details[1].scheduled_at).fromNow()}}</td>
            <td>{{subNote(entry.note)}}</td>
            <td v-if="entry.user_name" style="color: green; font-weight: bold;">{{entry.user_name}}</td> <td v-else style="color: red; font-weight: bold;">Not assigned</td>
            <td><router-link :to="{name: 'task-preview', params: {id: entry.id}}" class="nav-link">View</router-link></td>
          </tr>
          <tr>
            <td colspan="7" class="text-center card-bg-secondary py-1"><button type="button" class="btn btn-link" v-on:click.prevent="loadMore()" :disabled="meta.currentPage >= meta.totalPages">Load Older Entries</button></td>
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
          status: 'uncompleted',
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
        this.status = 'all'
      }

      try {
        let res = await this.$axios.get(`companies/tasks?include=details&status=${this.status}`)

        this.entries = res.data.data
        this.meta.totalPages = res.data.meta.last_page
        this.meta.nextPageUrl = res.data.links.next

        this.meta.ready = true
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    async loadMore() {
      try {
        let res = await this.$axios.get(this.meta.nextPageUrl)

        this.entries = this.entries.concat(res.data.data)
        this.meta.currentPage = res.data.meta.current_page
        this.meta.nextPageUrl = res.data.links.next
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    async search() {
      try {
        this.meta.ready = false

        if(this.q == '') {
          return this.loadData()
        }

        let res = await this.$axios.get(`companies/tasks/search?include=details&status=${this.status}&q=${this.q}`)

        this.entries = res.data.data
        this.meta.totalPages = res.data.meta.last_page
        this.meta.nextPageUrl = res.data.links.next
        
        this.meta.ready = true
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    loadCompleted() {
      this.status = 'completed'
      this.loadData()
    },
    loadUncompleted() {
      this.status = 'uncompleted'
      this.loadData()
    },
    loadCancelled() {
      this.status = 'cancelled'
      this.loadData()
    },
    subNote(note, limit=75) {
      if (!note) {
        return
      }

      if (note.length > limit) {
        return note.substring(0, limit) + '...'
      }

      return note
    },
  }
}
</script>