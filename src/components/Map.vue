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
        const site_id = record.getElementsByTagName('id_number').item(0).textContent
        const category = record.getElementsByTagName('category').item(0).textContent

        let info_window = new google.maps.InfoWindow({
          content: this.info_window_content({
            site_url: record.getElementsByTagName('http_url').item(0).textContent,
            site_name: site_name,
            image_url: record.getElementsByTagName('image_url').item(0).textContent,
            category: category,
            criteria: record.getElementsByTagName('criteria_txt').item(0).textContent,
            inscription: Number(record.getElementsByTagName('date_inscribed').item(0).textContent),
            site_description: record.getElementsByTagName('short_description').item(0).textContent,
          }),
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
    },

    info_window_content: (params) => {
      const categories = {
        Cultural: '文化遺産',
        Natural: '自然遺産',
        Mixed: '複合遺産',
      }

      const site_name_td_element = params.site_name === '' ? '' : `
        <td colspan="2" style="padding:3px;">
          <a href="${params.site_url}">${params.site_name}</a>
        </td>
      `

      const description_td_element = params.site_description == '' ? '' : `
        <td colspan="2" style="padding:3px;">
          <p>${params.site_description}</p>
        </td>
      `

      const info_window = `
        <div>
          <table border="1" cellpadding="1" style="border-style:solid;">
            <tr style="border:1px black solid; padding:30px;">
              <td colspan="2" style="padding:3px;">
                <a href="${params.site_url}" alt="${params.site_name}" target="_blank">
                  <img src="${params.image_url}">
                </a>
              </td>
            </tr>
            <tr>${site_name_td_element}</tr>
            <tr>
              <th width="30%"">登録区分</th>
              <td style="padding:3px;">${categories[params.category]}</td>
            </tr>
            <tr>
              <th width="30%">登録基準</th>
              <td style="padding:3px;">${params.criteria}</td>
            </tr>
            <tr>
              <th width="30%">登録年</th>
              <td style="padding:3px;">${params.inscription} 年</td>
            </tr>
            </tr>${description_td_element}</tr>
          </table>
        </div>
      `
      return info_window
    },

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