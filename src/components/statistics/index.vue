<template>
  <div>
    <loading v-if="!meta.ready" />

    <div class="row" v-if="meta.ready">
      <div class="col-md-12">
        <h4 class="mb-3">Task Cancellation Statistics</h4>
        <div class="row">
            <form @submit.prevent="loadBetween">
              <div class="col-md-12 mb-3">Between <datetime type="date" v-model="from" placeholder="Select date"></datetime>
              & <datetime type="date" v-model="to" placeholder="Select date"></datetime>
              <input type="submit" value="Update" class="btn btn-primary"></div>
            </form>
        </div>
        <div class="row">
          <div class="col-md-12 mb-3">
            <line-chart :data="entries" :download="true" :messages="{empty: 'We didn\'t find anything - just empty space.'}" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Chartkick from "vue-chartkick";
import Chart from "chart.js";

Vue.use(Chartkick.use(Chart));

export default {
  data() {
    return {
      entries: [],
      from: '',
      to: ''
    };
  },
  created() {
    this.loadData();

    window.Echo.private(`company.${this.getUserInfo().company_id}.info`).listen(".cancelled", data => {
        let i = this.entries.findIndex(elm => elm.name == data.cancellation.reason);

        let date = data.cancellation.created_at;

        if (i != -1) {
          if (this.entries[i].data[date] != undefined) {
            this.entries[i].data[date]++;
          } else {
            this.entries[i].data[date] = 1;
          }
        } else {
          this.entries.push({
            name: data.cancellation.reason,
            data: {
              [date]: 1
            }
          });
        }

        let tmp = this.entries;
        this.entries = [];
        this.entries = tmp;
      }
    );
  },
  methods: {
    async loadData() {
      this.meta.ready = false;

      try {
        let res = await this.$axios.get("companies/statistics/tasks");
        this.entries = res.data;

        this.meta.ready = true;
      } catch (error) {
        this.$toast.error("Sorry an error occurred");
      }
    },
    async loadBetween() {
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.get(`companies/statistics/tasks?from=${this.from}&to=${this.to}`);
        this.entries = res.data;

        this.$toast.clear(loading)
      } catch (error) {
        this.$toast.clear(loading)
        this.$toast.error("Sorry an error occurred");
      }
    }
  }
};
</script>
