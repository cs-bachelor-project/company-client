<template>
  <div>
    <div class="row mb-5">
      <div class="col-md-12">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API;
    let map = new mapboxgl.Map({
      container: "map",
      center: [12.1617903, 55.45188],
      zoom: 11.15,
      style: "mapbox://styles/mapbox/streets-v11"
    });

    map.addControl(new mapboxgl.FullscreenControl());

    var self = this;
    map.on("load", function() {
      window.Echo.private(`company.${self.getUserInfo().company_id}.info`).listen(".location", (data) => {
        if (map.getSource(data.user_id)) {
          map.getSource(data.user_id).setData({
            geometry: {
              type: "Point",
              coordinates: [data.location[0], data.location[1]]
            },
            type: "Feature",
            properties: {}
          });
        } else {
          map.addSource(data.user_id, {
            type: "geojson",
            data: {
              geometry: {
                type: "Point",
                coordinates: [12.1617903, 55.45188]
              },
              type: "Feature",
              properties: {}
            }
          });
          map.addLayer({
            id: data.user_id,
            type: "circle",
            source: data.user_id,
            paint: {
              "circle-radius": 10,
              "circle-color": "#223b53",
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
              "circle-opacity": 0.7
            }
          });
        }
      });

      self.$axios.get("http://localhost:5000").then(res => {
        Object.values(res.data).forEach(elm => {
          map.addSource(elm._id, {
            type: "geojson",
            data: {
              geometry: {
                type: "Point",
                coordinates: [elm.location[0], elm.location[1]]
              },
              type: "Feature",
              properties: {}
            }
          });
          map.addLayer({
            id: elm._id,
            type: "circle",
            source: elm._id,
            paint: {
              "circle-radius": 10,
              "circle-color": "#223b53",
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
              "circle-opacity": 0.7
            }
          });
        });
      });
    });
  }
};
</script>

<style>
#map {
  height: 700px;
  width: 100%;
}
</style>