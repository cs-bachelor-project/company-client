<template>
  <div>
    <h4 class="mb-3">All Users <span class="float-right"><router-link :to="{name: 'user-new'}">New User</router-link></span></h4>

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
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Roles</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <th scope="row">{{entry.id}}</th>
            <td>{{entry.name}}</td>
            <td>{{entry.email}}</td>
            <td>{{entry.roles.map(a => a.name)}}</td>
            <td><router-link :to="{name: 'user-preview', params: {id: entry.id}}" class="nav-link">View</router-link></td>
          </tr>
          <tr>
            <td colspan="5" class="text-center card-bg-secondary py-1"><button type="button" class="btn btn-link" v-on:click.prevent="loadMore()" :disabled="meta.currentPage >= meta.totalPages">Load Older Entries</button></td>
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
        }
    },
    created() {
        this.loadData()
    },
    methods: {
      async loadData() {
        this.meta.ready = false

        try {
          let res = await this.$axios.get('companies/users?include=roles')

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
      }
    }
}
</script>