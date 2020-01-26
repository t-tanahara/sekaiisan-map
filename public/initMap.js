var map

function initMap() {
  const tokyo = {lat: 35.681167, lng: 139.767052}
  const opts = {
    streetViewControl: false,
    zoom: 5,
    minZoom : 3,
    center: tokyo,
  }
  map = new google.maps.Map(document.getElementById("map"), opts)
}