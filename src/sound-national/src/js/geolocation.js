export function getGeoLocation () {
  if (window.navigator.geolocation) {
    console.log("Geolocation available!")
  }
  else {
    console.warn("Geolocation not available!")
  }
}


