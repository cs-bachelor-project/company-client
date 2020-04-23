<template>
  <div class="row float-left sticky-top">
    <div class="col col-md">
      <div class="alert" role="alert" :class="`alert-${type}`" v-if="type != 'validation'">{{data}}</div>

      <div class="alert alert-danger" role="alert" v-if="type == 'validation'">
        <div v-for="(data, index) in data" :key="index">{{data[0]}}</div>
        <a href @click.prevent="$store.commit('clearAlerting')">Clear</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type", "data"],
  mounted() {
    if (this.type == "success") {
      setTimeout(() => this.$store.commit("clearAlerting"), 3000);
    }
  }
};
</script>