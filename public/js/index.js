import Api from "./Api.js";
let loading = true;
async function renderMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiamNzb2Z0aWEiLCJhIjoiY2s3cjBsbzk5MDFvcTNlbXBpeHVhN3B4dSJ9.e8U2_Nao4uub_Qa7gtSoIA";
  var map = L.mapbox
    .map("map")
    .setView([-12.048, -77.0501], 2)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/dark-v10"));
  const markers = await renderData()
    map.addLayer(markers);
 
}

function renderExtractData({
  country,
  cases,
  todayCases,
  deaths,
  todayDeaths,
  recovered,
  critical
}) {
  return `
  <div>
    <p> <strong>${country} </strong> </p>
    <p> confirmados: ${cases} </p>
    <p style="color:red"> muertes: ${deaths} </p>
    <p style="color:green"> recuperados: ${recovered} </p>
  </div>
`;
}
async function renderData() {
  const API = new Api();
  const myIcon = L.icon({
    iconRetinaUrl:
      "https://www.flaticon.com/premium-icon/icons/svg/2667/2667578.svg",
    iconSize: [35, 35]
  });
  let markers = null;
  try {
    loading = true;
    const countries = await API.getCasesByCountry();
    loading = false;
    markers = await renderMarkers(countries, myIcon)
    console.log(countries.locations);
  } catch (error) {
    console.log(error);
  }
  return markers
}
async function renderMarkers(data, myIcon){
  var markers = new L.MarkerClusterGroup();
  data.map((item)=>{
    console.log(item)
    var title = renderExtractData(item);
    var marker = L.marker(new L.LatLng(item.coordinates.lat, item.coordinates.lon), {
      icon: myIcon,
      title: title
    });
    marker.bindPopup(title);
    marker.bindPopup(title);
    markers.addLayer(marker);
  })

  return markers
}
renderMap()
