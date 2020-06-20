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

        <div class="row">
          <div class="col-md-12 mb-3">
            <ul>
              <li v-for="(elm, index) in calculations" :key="index"><strong>{{elm.name}}</strong>: {{elm.action}} with {{elm.difference}} ({{elm.percentage}}%)</li>
            </ul>
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
      calculations: [],
      from: null,
      to: null
    };
  },
  created() {
    this.loadData();

    window.Echo.private(`company.${this.getUserInfo().company_id}.info`).listen(".cancelled", data => {
        let date = data.cancellation.created_at;

        if (this.from && this.to) {
          if (!this.moment(date).isBetween(this.from, this.to)) {
            return
          }
        }

        let i = -1;
        
        if (this.entries.length){
          i = this.entries.findIndex(elm => elm.name == data.cancellation.reason);
        }

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

        this.calcPercentage();
      }
    );
  },
  methods: {
    async loadData() {
      this.meta.ready = false;

      try {
        let res = await this.$axios.get("companies/statistics/tasks");
        this.entries = res.data;

        this.calcPercentage();

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
        
        this.calcPercentage();

        this.$toast.clear(loading)
      } catch (error) {
        this.$toast.clear(loading)
        this.$toast.error("Sorry an error occurred");
      }
    },
    calcPercentage() {
        this.calculations = [];
        
        this.entries.forEach(elm => {
            let k = Object.keys(elm.data)
            let second = k[k.length - 2]
            let last = k[k.length - 1]

            if (k.length > 1 && elm.data[second] != 0) {
                let diff = elm.data[second] - elm.data[last]
                let act = 'Stable';
                let difference = 0;
                let percentage = 0;
                if (diff < 0) {
                    act = 'Increase'
                    difference = '+' + Math.abs(diff)
                    percentage = '+' + Math.round((Math.abs(((elm.data[second] - elm.data[last]) / elm.data[second] * 100)) + Number.EPSILON) * 100) / 100
                }
                if (diff > 0) {
                    act = 'Decrease'
                    difference = '-' + Math.abs(diff)
                    percentage = '-' + Math.round((Math.abs(((elm.data[second] - elm.data[last]) / elm.data[second] * 100)) + Number.EPSILON) * 100) / 100
                }

                this.calculations.push({
                    name: elm.name,
                    action: act,
                    difference: difference,
                    percentage: percentage
                })
            }
        });
    }
  }
};
</script>
