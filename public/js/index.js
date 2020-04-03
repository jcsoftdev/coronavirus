import Api from "./Api.js";
let loading = true;
async function renderMap() {
  L.mapbox.accessToken =
    "pk.eyJ1IjoiamNzb2Z0aWEiLCJhIjoiY2s3cjBsbzk5MDFvcTNlbXBpeHVhN3B4dSJ9.e8U2_Nao4uub_Qa7gtSoIA";
  var map = L.mapbox
    .map("map")
    .setView([-12.048, -77.0501], 3)
    .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/dark-v10"));
  const markers = await renderData();
  map.addLayer(markers);
  renderTotalCases();
}
function createTeampleTotalCases({ deaths, cases, recovered, updated }) {
  return `
    <h1 style="text-align:center">All cases in the world</h1>
    <p style="text-align:center"><b>Note:</b> At 7:00 PM EST</p>
    <p><strong>Cases:</strong> ${cases}</p>
    <p><strong>Deaths:</strong> ${deaths}</p>
    <p><strong>Recovered:</strong> ${recovered}</p>
    <p><strong>Updated:</strong> ${Date(updated)}</p>
  `;
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
    <p> Confirmed: ${cases} </p>
    <p> Confirmed (today): ${todayCases} </p>
    <p style="color:red"> Deaths: ${deaths} </p>
    <p style="color:red"> Deaths (today): ${todayDeaths} </p>
    <p style="color:green"> Recovered: ${recovered} </p>
    <p style="color:orange"> Critical: ${critical} </p>
  </div>
`;
}
const API = new Api();
async function renderData() {
  const myIcon = L.icon({
    iconRetinaUrl:
      "../img/covid-2.svg",
    iconSize: [55, 55]
  });
  let markers = null;
  try {
    loading = true;
    const countries = await API.getCasesByCountry();
    loading = false;
    markers = await renderMarkers(countries, myIcon);
    console.log(countries.locations);
  } catch (error) {
    console.log(error);
  }
  return markers;
}
async function renderTotalCases() {
  const $total = document.querySelector("#total");
  const data = await API.getTotalCases();
  $total.innerHTML = createTeampleTotalCases(data);
}
async function renderMarkers(data, myIcon) {
  var markers = new L.MarkerClusterGroup();
  data.map(item => {
    console.log(item);
    var title = renderExtractData(item);
    var marker = L.marker(
      new L.LatLng(item.coordinates.lat, item.coordinates.lon),
      {
        icon: myIcon,
        title: item.country
      }
    );
    marker.bindPopup(title);
    markers.addLayer(marker);
  });

  return markers;
}
(function() {
  const $modal = document.querySelector("#total");
  $modal.style.display = "flex";
  const $btn = document.querySelector("#btn");
  $btn.addEventListener("click", e => {
    $modal.style.display == "flex"
      ? ((e) => {
          $btn.innerHTML='⭕'
          $btn.style.borderRadius='1rem'
          $modal.style.display = "none";
        })()
        : (() => {
          $btn.style.borderRadius='1rem 1rem 0 0'
          $btn.innerHTML='❌'
        $modal.style.display = "flex";

        })();
    console.log(e, $modal.style.display);
  });
})();
renderMap();
