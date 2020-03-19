let express = require("express");
let app = express();
let cors = require("cors");
let axios = require("axios");
let cheerio = require("cheerio");
let db = require("quick.db");
const coordinates = [
  { country: "Japan", lat: 35.685, lon: 139.7514 },
  { country: "USA", lat: 40.6943, lon: -73.9249 },
  { country: "Palestine", lat: 31.947351, lon: 35.227163 },
  { country: "Mexico", lat: 19.4424, lon: -99.131 },
  { country: "India", lat: 19.017, lon: 72.857 },
  { country: "Brazil", lat: -23.5587, lon: -46.625 },
  { country: "China", lat: 31.2165, lon: 121.4365 },
  { country: "Bangladesh", lat: 23.7231, lon: 90.4086 },
  { country: "Argentina", lat: -34.6025, lon: -58.3975 },
  { country: "Pakistan", lat: 24.87, lon: 66.99 },
  { country: "Egypt", lat: 30.05, lon: 31.25 },
  { country: "Philippines", lat: 14.6042, lon: 120.9822 },
  { country: "Russia", lat: 55.7522, lon: 37.6155 },
  { country: "Turkey", lat: 41.105, lon: 29.01 },
  { country: "France", lat: 48.8667, lon: 2.3333 },
  { country: "Bahamas", lat: 25.0834, lon: -77.35 },
  { country: "Nigeria", lat: 13.4539, lon: -16.5917 },
  { country: "Indonesia", lat: 39.0194, lon: 125.7547 },
  { country: "UK", lat: 51.5, lon: -0.1167 },
  { country: "Peru", lat: -12.048, lon: -77.0501 },
  { country: "Iran", lat: 35.6719, lon: 51.4243 },
  { country: "Congo (Kinshasa)", lat: -4.3297, lon: 15.315 },
  { country: "Colombia", lat: 4.5964, lon: -74.0833 },
  { country: "Hong Kong", lat: 22.305, lon: 114.185 },
  { country: "Taiwan", lat: 25.0358, lon: 121.5683 },
  { country: "Thailand", lat: 13.75, lon: 100.5166 },
  { country: "Chile", lat: -33.45, lon: -70.667 },
  { country: "Spain", lat: 40.4, lon: -3.6834 },
  { country: "Vietnam", lat: 10.78, lon: 106.695 },
  { country: "Canada", lat: 43.7, lon: -79.42 },
  { country: "Singapore", lat: 1.293, lon: 103.8558 },
  { country: "Angola", lat: -8.8383, lon: 13.2344 },
  { country: "Iraq", lat: 33.3386, lon: 44.3939 },
  { country: "Sudan", lat: 15.5881, lon: 32.5342 },
  { country: "Australia", lat: -33.92, lon: 151.1852 },
  { country: "Saudi Arabia", lat: 24.6408, lon: 46.7727 },
  { country: "Burma", lat: 16.7834, lon: 96.1667 },
  { country: "Ivory Coast", lat: 7.545511, lon: -5.547545},
  { country: "South Africa", lat: -26.17, lon: 28.03 },
  { country: "Germany", lat: 52.5218, lon: 13.4015 },
  { country: "Algeria", lat: 36.7631, lon: 3.0506 },
  { country: "Italy", lat: 41.896, lon: 12.4833 },
  { country: "Gambia", lat: 13.4539, lon: -16.5917 },
  { country: "Vatican City", lat: 41.902360, lon: 12.453320 },
  { country: "Afghanistan", lat: 37.5663, lon: 126.9997 },
  { country: "Greece", lat: 6.9166, lon: 158.15 },
  { country: "Morocco", lat: 33.6, lon: -7.6164 },
  { country: "Israel", lat: 32.08, lon: 34.77 },
  { country: "Ethiopia", lat: 9.0333, lon: 38.7 },
  { country: "Kenya", lat: -1.2833, lon: 36.8167 },
  { country: "Venezuela", lat: 10.501, lon: -66.917 },
  { country: "Tanzania", lat: -6.8, lon: 39.2683 },
  { country: "Portugal", lat: 38.7227, lon: -9.1449 },
  { country: "Poland", lat: 50.2604, lon: 19.02 },
  { country: "Syria", lat: 36.23, lon: 37.17 },
  { country: "Ukraine", lat: 50.4334, lon: 30.5166 },
  { country: "Senegal", lat: 14.7158, lon: -17.4731 },
  { country: "Ecuador", lat: -2.22, lon: -79.92 },
  { country: "Malaysia", lat: 5.4136, lon: 100.3294 },
  { country: "S. Korea", lat: 35.8668, lon: 128.607 },
  { country: "Tunisia", lat: 36.8028, lon: 10.1797 },
  { country: "Austria", lat: 48.2, lon: 16.3666 },
  { country: "Libya", lat: 32.8925, lon: 13.18 },
  { country: "Uzbekistan", lat: 41.3117, lon: 69.2949 },
  { country: "Cuba", lat: 23.132, lon: -82.3642 },
  { country: "Dominican Republic", lat: 18.4701, lon: -69.9001 },
  { country: "Azerbaijan", lat: 40.3953, lon: 49.8622 },
  { country: "Ghana", lat: 5.55, lon: -0.2167 },
  { country: "Bolivia", lat: -17.7539, lon: -63.226 },
  { country: "Kuwait", lat: 29.3697, lon: 47.9783 },
  { country: "Yemen", lat: 15.3547, lon: 44.2066 },
  { country: "Haiti", lat: 18.541, lon: -72.336 },
  { country: "Romania", lat: 44.4334, lon: 26.0999 },
  { country: "Cameroon", lat: 4.0604, lon: 9.71 },
  { country: "Paraguay", lat: -25.2964, lon: -57.6415 },
  { country: "Lebanon", lat: 33.872, lon: 35.5097 },
  { country: "Belarus", lat: 53.9, lon: 27.5666 },
  { country: "Belgium", lat: 50.8333, lon: 4.3333 },
  { country: "Madagascar", lat: -18.9166, lon: 47.5166 },
  { country: "Hungary", lat: 47.5, lon: 19.0833 },
  { country: "Zimbabwe", lat: -17.8178, lon: 31.0447 },
  { country: "Uruguay", lat: -34.858, lon: -56.1711 },
  { country: "Mali", lat: 12.65, lon: -8 },
  { country: "Guinea", lat: 9.5315, lon: -13.6802 },
  { country: "Diamond Princess", lat: 35.45582, lon: 139.68188 },
  { country: "Cambodia", lat: 11.55, lon: 104.9166 },
  { country: "Togo", lat: 6.1319, lon: 1.2228 },
  { country: "Qatar", lat: 25.2866, lon: 51.533 },
  { country: "Mozambique", lat: -25.9553, lon: 32.5892 },
  { country: "El Salvador", lat: 13.71, lon: -89.203 },
  { country: "Uganda", lat: 0.3167, lon: 32.5833 },
  { country: "Netherlands", lat: 52.08, lon: 4.27 },
  { country: "UAE", lat: 25.23, lon: 55.28 },
  { country: "New Zealand", lat: -36.8481, lon: 174.763 },
  { country: "Congo", lat: -4.2592, lon: 15.2847 },
  { country: "Zambia", lat: -15.4166, lon: 28.2833 },
  { country: "Costa Rica", lat: 9.935, lon: -84.0841 },
  { country: "Panama", lat: 8.968, lon: -79.533 },
  { country: "Sweden", lat: 59.3508, lon: 18.0973 },
  { country: "Switzerland", lat: 46.21, lon: 6.14 },
  { country: "Kazakhstan", lat: 43.325, lon: 76.915 },
  { country: "Bulgaria", lat: 42.6833, lon: 23.3167 },
  { country: "Czechia", lat: 50.0833, lon: 14.466 },
  { country: "Burkina Faso", lat: 12.3703, lon: -1.5247 },
  { country: "Finland", lat: 60.1756, lon: 24.9341 },
  { country: "Armenia", lat: 40.1812, lon: 44.5136 },
  { country: "Somalia", lat: 2.0667, lon: 45.3667 },
  { country: "Georgia", lat: 41.725, lon: 44.7908 },
  { country: "Serbia", lat: 44.8186, lon: 20.468 },
  { country: "Tajikistan", lat: 38.56, lon: 68.7739 },
  { country: "Denmark", lat: 55.6786, lon: 12.5635 },
  { country: "Jordan", lat: 31.95, lon: 35.9333 },
  { country: "Ireland", lat: 53.3331, lon: -6.2489 },
  { country: "Liberia", lat: 6.3106, lon: -10.8048 },
  { country: "Guatemala", lat: 14.6211, lon: -90.527 },
  { country: "Chad", lat: 12.1131, lon: 15.0491 },
  { country: "Honduras", lat: 14.102, lon: -87.2175 },
  { country: "Jamaica", lat: 17.9771, lon: -76.7674 },
  { country: "Djibouti", lat: 11.595, lon: 43.148 },
  { country: "Nicaragua", lat: 12.153, lon: -86.2685 },
  { country: "Niger", lat: 13.5167, lon: 2.1167 },
  { country: "Albania", lat: 41.3275, lon: 19.8189 },
  { country: "Nepal", lat: 27.7167, lon: 85.3166 },
  { country: "Mongolia", lat: 47.9167, lon: 106.9166 },
  { country: "Montserrat", lat: 16.7494365 , lon:-62.1927489 },
  { country: "Rwanda", lat: -1.9536, lon: 30.0605 },
  { country: "DRC", lat: 	-4.322447, lon: 	15.307045 },
  { country: "Kyrgyzstan", lat: 42.8731, lon: 74.5852 },
  { country: "Norway", lat: 59.9167, lon: 10.75 },
  { country: "CAR", lat: 4.3666, lon: 18.5583 },
  { country: "Sierra Leone", lat: 8.47, lon: -13.2342 },
  { country: "Benin", lat: 6.4, lon: 2.52 },
  { country: "Laos", lat: 17.9667, lon: 102.6 },
  { country: "Latvia", lat: 56.95, lon: 24.1 },
  { country: "Mauritania", lat: 18.0864, lon: -15.9753 },
  { country: "Oman", lat: 23.6133, lon: 58.5933 },
  { country: "Turkmenistan", lat: 37.95, lon: 58.3833 },
  { country: "Croatia", lat: 45.8, lon: 16 },
  { country: "Bosnia and Herzegovina", lat: 43.85, lon: 18.383 },
  { country: "Moldova", lat: 47.005, lon: 28.8577 },
  { country: "Malawi", lat: -13.9833, lon: 33.7833 },
  { country: "Eritrea", lat: 15.3333, lon: 38.9333 },
  { country: "Mauritius", lat: -20.1666, lon: 57.5 },
  { country: "Gabon", lat: 0.3854, lon: 9.458 },
  { country: "Bahrain", lat: 26.2361, lon: 50.5831 },
  { country: "Lithuania", lat: 54.6834, lon: 25.3166 },
  { country: "North Macedonia", lat: 42, lon: 21.4335 },
  { country: "Slovakia", lat: 48.15, lon: 17.117 },
  { country: "Guinea-Bissau", lat: 11.865, lon: -15.5984 },
  { country: "Estonia", lat: 59.4339, lon: 24.728 },
  { country: "Malta", lat: 35.8997, lon: 14.5147 },
  { country: "Lesotho", lat: -29.3167, lon: 27.4833 },
  { country: "Burundi", lat: -3.3761, lon: 29.36 },
  { country: "Slovenia", lat: 46.0553, lon: 14.515 },
  { country: "Brunei", lat: 4.8833, lon: 114.9333 },
  { country: "Trinidad and Tobago", lat: 10.652, lon: -61.517 },
  { country: "Papua New Guinea", lat: -9.4647, lon: 147.1925 },
  { country: "Namibia", lat: -22.57, lon: 17.0835 },
  { country: "Guyana", lat: 6.802, lon: -58.167 },
  { country: "Suriname", lat: 5.835, lon: -55.167 },
  { country: "Timor-Leste", lat: -8.5594, lon: 125.5795 },
  { country: "Korea North", lat: 39.0194, lon: 125.7547 },
  { country: "Cyprus", lat: 6.9166, lon: 158.15 },
  { country: "Sri Lanka", lat: 6.932, lon: 79.8578 },
  { country: "Botswana", lat: -24.6463, lon: 25.9119 },
  { country: "St. Barth", lat: 17.8961800, lon:-62.849780},
  { country: "Barbados", lat: 13.102, lon: -59.6165 },
  { country: "Fiji", lat: -18.133, lon: 178.4417 },
  { country: "Iceland", lat: 64.15, lon: -21.95 },
  { country: "Equatorial Guinea", lat: 3.75, lon: 8.7833 },
  { country: "Curaçao", lat: 12.2004, lon: -69.02 },
  { country: "Montenegro", lat: 42.466, lon: 19.2663 },
  { country: "Comoros", lat: -11.7042, lon: 43.2402 },
  { country: "Cabo Verde", lat: 14.9167, lon: -23.5167 },
  { country: "Maldives", lat: 4.1667, lon: 73.4999 },
  { country: "South Sudan", lat: 4.83, lon: 31.58 },
  { country: "Luxembourg", lat: 49.6117, lon: 6.13 },
  { country: "Bhutan", lat: 27.473, lon: 89.639 },
  { country: "Swaziland", lat: -26.3167, lon: 31.1333 },
  { country: "Sao Tome And Principe", lat: 0.3334, lon: 6.7333 },
  { country: "Solomon Islands", lat: -9.438, lon: 159.9498 },
  { country: "Aruba", lat: 12.5304, lon: -70.029 },
  { country: "Samoa", lat: -13.8415, lon: -171.7386 },
  { country: "Andorra", lat: 42.5, lon: 1.5165 },
  { country: "St. Vincent Grenadines", lat: 13.1483, lon: -61.2121 },
  { country: "Vanuatu", lat: -17.7334, lon: 168.3166 },
  { country: "U.S. Virgin Islands", lat: 17.72751, lon: 18.3419 },
  { country: "Tonga", lat: -21.1385, lon: -175.2206 },
  { country: "Saint Lucia", lat: 14.002, lon: -61 },
  { country: "Saint Martin", lat: 	18.073099, lon: -63.082199 },
  { country: "Monaco", lat: 43.7396, lon: 7.4069 },
  { country: "Liechtenstein", lat: 47.1337, lon: 9.5167 },
  { country: "Antigua and Barbuda", lat: 17.118, lon: -61.85 },
  { country: "Grenada", lat: 12.0526, lon: -61.7416 },
  { country: "Seychelles", lat: -4.6166, lon: 55.45 },
  { country: "San Marino", lat: 43.9172, lon: 12.4667 },
  { country: "Kiribati", lat: 1.3382, lon: 173.0176 },
  { country: "Marshall Islands", lat: 7.103, lon: 171.38 },
  { country: "Dominica", lat: 15.301, lon: -61.387 },
  { country: "Saint Kitts And Nevis", lat: 17.302, lon: -62.717 },
  { country: "Belize", lat: 17.252, lon: -88.7671 },
  { country: "American Samoa", lat: -14.274, lon: -170.7046 },
  { country: "Tuvalu", lat: -8.5167, lon: 179.2166 },
  { country: "Northern Mariana Islands", lat: 15.2137, lon: 145.7546 },
  { country: "Guam", lat: 13.4745, lon: 144.7504 },
  { country: "West Bank", lat: 31.7764, lon: 35.2269 },
  { country: "Sint Maarten", lat: 18.0255, lon: -63.045 },
  { country: "Kosovo", lat: 42.6666, lon: 21.1724 },
  { country: "Palau", lat: 7.5, lon: 134.6242 },
  { country: "Macao", lat: 22.203, lon: 113.545 },
  { country: "Puerto Rico", lat: 18.4037, lon: -66.0636 },
  { country: "Martinique", lat: 14.6104, lon: -61.08 },
  { country: "Eswatini", lat: -26.342143, lon: 31.151493 },
  { country: "Réunion", lat: -20.8789, lon: 55.4481 },
  { country: "Gibraltar", lat: 36.1324, lon: -5.3781 },
  { country: "Guadeloupe", lat: 16.2415, lon: -61.533 },
  { country: "French Polynesia", lat: -17.5334, lon: -149.5667 },
  { country: "New Caledonia", lat: -22.2625, lon: 166.4443 },
  { country: "French Guiana", lat: 4.933, lon: -52.33 },
  { country: "Mayotte", lat: -12.7871, lon: 45.275 },
  { country: "Greenland", lat: 66.95, lon: -53.6666 },
  { country: "Faeroe Islands", lat: 62.2375, lon: -6.539 },
  { country: "Wallis And Futuna", lat: -14.2933, lon: -178.1583 },
  { country: "Bermuda", lat: 32.2942, lon: -64.7839 },
  { country: "Isle Of Man", lat: 54.1504, lon: -4.48 },
  { country: "Micronesia  Federated", lat: 6.9166, lon: 158.15 },
  { country: "Turks And Caicos Islands", lat: 21.4664, lon: -71.136 },
  { country: "Cayman Islands", lat: 19.2804, lon: -81.33 },
  { country: "Cook Islands", lat: -21.25, lon: -159.75 },
  { country: "Saint Helena", lat: -7.9286, lon: -14.4119 },
  { country: "Falkland Islands (Islas Malvinas)", lat: -51.7, lon: -57.85 },
  { country: "Channel Islands", lat: 49.372284, lon: -2.364351 },
  {
    country: "South Georgia And South Sandwich Islands",
    lat: -54.2806,
    lon: -36.508
  }
];


coordinates.forEach(item => {
  if (item.country === "Peru") {
    console.log({ countries: { lat: item.lat, lon: item.lon } });
  }
});
let getall = setInterval(async () => {
  let response;
  try {
    response = await axios.get("https://www.worldometers.info/coronavirus/");
    // response = await axios.get("http://127.0.0.1:5500/index2.html");
  } catch (error) {
    console.log(error);
  }

  // to store parsed data
  const result = {};

  // get HTML and parse death rates
  const html = cheerio.load(response.data);
  html(".maincounter-number").filter((i, el) => {
    let count = el.children[0].next.children[0].data || "0";
    count = parseInt(count.replace(/,/g, "") || "0", 10);
    // first one is
    if (i === 0) {
      result.cases = count;
    } else if (i === 1) {
      result.deaths = count;
    } else {
      result.recovered = count;
    }
  });
  result.updated = Date.now();
  db.set("all", result);
  console.log("Updated The Cases", result);

  const resultAll = [];
  // console.log(response);
  // get HTML and parse death rates
  // const html = cheerio.load(response.data);
  const countriesTable = html("table#main_table_countries_today");
  const countriesTableCells = countriesTable
    .children("tbody")
    .children("tr")
    .children("td");

  // NOTE: this will change when table format change in website
  const totalColumns = 9;
  const countryColIndex = 0;
  const casesColIndex = 1;
  const todayCasesColIndex = 2;
  const deathsColIndex = 3;
  const todayDeathsColIndex = 4;
  const curedColIndex = 5;
  const criticalColIndex = 7;

  // minus totalColumns to skip last row, which is total
  for (let i = 0; i < countriesTableCells.length - totalColumns; i += 1) {
    const cell = countriesTableCells[i];
    // get country
    if (i % totalColumns === countryColIndex) {
      let country =
        cell.children[0].data ||
        cell.children[0].children[0].data ||
        // country name with link has another level
        cell.children[0].children[0].children[0].data ||
        cell.children[0].children[0].children[0].children[0].data ||
        "";
      country = country.trim();
      if (country.length === 0) {
        // parse with hyperlink
        country = cell.children[0].next.children[0].data || "";
      }
      resultAll.push({
        country: country.trim() || ""
      });
      coordinates.map(item => {
        if (item.country === country.trim()) {
          resultAll[resultAll.length - 1].coordinates = {
            lat: item.lat,
            lon: item.lon
          };
        }
      });
    }
    // get cases
    if (i % totalColumns === casesColIndex) {
      
      let cases = cell.children[0].data || "";
      resultAll[resultAll.length - 1].cases = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get today cases
    if (i % totalColumns === todayCasesColIndex) {
      let cases
      try {
        if (cell.children[0]) {
          
          cases = cell.children[0].data || "";
        }else{
          cases = ""
        }
      } catch (error) {
        console.log('Error',error);
      }
      resultAll[resultAll.length - 1].todayCases = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get deaths
    if (i % totalColumns === deathsColIndex) {
      let deaths = cell.children[0].data || "";
      resultAll[resultAll.length - 1].deaths = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get today deaths
    if (i % totalColumns === todayDeathsColIndex) {
      let deaths 
      try {
        if (cell.children[0]) {
          
          deaths = cell.children[0].data || "";
        }else{
          deaths = ""
        }
      } catch (error) {
        console.log('Error',error);
      }
      resultAll[resultAll.length - 1].todayDeaths = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get cured
    if (i % totalColumns === curedColIndex) {
      let cured
      try {
        if (cell.children[0]) {
          cured = cell.children[0].data || "";
        }else{
          cured = ""
        }
      } catch (error) {
        console.log('Error',error);
      }
      resultAll[resultAll.length - 1].recovered = parseInt(
        cured.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // get critical
    if (i % totalColumns === criticalColIndex) {
      let critical 
      try {
        if (cell.children[0]) {
          
          critical = cell.children[0].data || "";
        }else{
          critical = ""
        }
      } catch (error) {
        console.log('Error',error);
      }
      resultAll[resultAll.length - 1].critical = parseInt(
        critical.trim().replace(/,/g, "") || "0",
        10
      );
    }
  }
  db.set("countries", resultAll);
  console.log("Updated The Countries", resultAll);
}, 60000);

// app.get("/", async function(request, response) {
//   let a = await db.fetch("all");
//   response.send(
//     `${a.cases} cases are reported of the COVID-19 Novel Coronavirus strain<br> ${a.deaths} have died from it <br>\n${a.recovered} have recovered from it <br> Get the endpoint /all to get information for all cases <br> get the endpoint /countries for getting the data sorted country wise <br>get the endpoint /countries/[country-name] for getting the data for a specific country`
//   );
// });

let listener = app.listen(8081, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

app.use(cors());
app.use('/', express.static('public'))
app.get("/all/", async function(req, res) {
  let all = await db.fetch("all");
  res.send(all);
});
app.get('/index', (req, res) => {
  res.sendFile('index.html', {
    root: './public/'
  });
});
app.get('/js/index.js', (req, res) => {
  res.sendFile('index.js', {
    root: './public/js/'
  });
});
app.get('/js/Api.js', (req, res) => {
  res.sendFile('Api.js', {
    root: './public/js/'
  });
});

app.get("/countries/", async function(req, res) {
  let countries = await db.fetch("countries");
  if (req.query["sort"]) {
    try {
      const sortProp = req.query["sort"];
      countries.sort((a, b) => {
        if (a[sortProp] < b[sortProp]) {
          return -1;
        } else if (a[sortProp] > b[sortProp]) {
          return 1;
        }
        return 0;
      });
    } catch (e) {
      console.error("ERROR while sorting", e);
      res.status(422).send(e);
      return;
    }
  }
  res.send(countries);
});

app.get("/countries/:country", async function(req, res) {
  let countries = await db.fetch("countries");
  let country = countries.find(
    e => e.country.toLowerCase().includes(req.params.country.toLowerCase()) // Added this so people dnt have to put the whole country name :)
  );
  if (!country) {
    res.send("Country not found");
    return;
  }
  res.send(country);
});
