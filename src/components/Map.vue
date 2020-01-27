<template>
  <div id="map"></div>
</template>

<script>
import axios from 'axios'

const gmap_api_src = 'https://maps.googleapis.com/maps/api/js?language=ja&region=JP&callback=initMap'
let world_heritage_data

export default {
  name: 'Map',

  props: {
    selected_category: Array
  },

  data () {
    return {
      markers: [],
      info_windows: []
    }
  },

  mounted: function() {
    const gmap_api_key = process.env.VUE_APP_GOOGLE_MAP_API_KEY
    const gmap_element = document.createElement('script')

    gmap_element.type = 'text/javascript'
    gmap_element.src = `${gmap_api_src}&key=${gmap_api_key}`

    document.getElementsByTagName('head')[0].appendChild(gmap_element)

    axios
    .get("/world_heritage_list.xml", {
      responseType: 'document',
    })
    .then(function(response) {
      world_heritage_data = response.data.getElementsByTagName('row')

      this.put_marker_on_map(world_heritage_data)
    }.bind(this))
  },

  methods: {
    put_marker_on_map: function(records) {
      for (const record of records) {
        const lat = Number(record.getElementsByTagName('latitude').item(0).textContent)
        const lng = Number(record.getElementsByTagName('longitude').item(0).textContent)
        const site_name = record.getElementsByTagName('site').item(0).textContent
        const site_description = record.getElementsByTagName('short_description').item(0).textContent
        const site_id = record.getElementsByTagName('id_number').item(0).textContent
        const site_url = record.getElementsByTagName('http_url').item(0).textContent
        const image_url = record.getElementsByTagName('image_url').item(0).textContent
        const category = record.getElementsByTagName('category').item(0).textContent

        let info_window = new google.maps.InfoWindow({
          content: `
          <div>
            <table>
              <tbody>
              <tr>
                <td>
                  <a name="site_url" href="${site_url}" alt="${site_name}" target="_blank">
                    <img src="${image_url}">
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="${site_url}" title="${site_name}">${site_name}</a>
                </td>
              </tr>
              <tr>
                <td><p>${site_description}</p></td>
              </tr>
              </tbody>
            </table>
          </div>
          `
        })

        let marker = new google.maps.Marker({
          position: {lat, lng},
          title: site_name,
          map: map,
          site_id: site_id,
          category: category,
        })

        marker.addListener('click', () => {
          for (const other_window of this.info_windows) {
            other_window.close()
          }
          info_window.open(map, marker)
        })

        this.info_windows.push(info_window)
        this.markers.push(marker)
      }
    }
  },

  watch: {
    'selected_category': function(new_values, old_values) {
      let selected = []
      for (const new_obj of new_values) {
        selected.push(new_obj.value)
      }

      for (const marker of this.markers) {
        marker.setVisible(selected.includes(marker.category))
      }
    }
  },
}
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>