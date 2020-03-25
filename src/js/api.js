let express = require("express");
let app = express();
let cors = require("cors");
let axios = require("axios");
let cheerio = require("cheerio");
let coordinates = require('./coordinates')
console.log(coordinates);
// let db = require("quick.db");
// Imports the Google Cloud client library
const { Datastore } = require("@google-cloud/datastore");

// Creates a client
const datastore = new Datastore();


coordinates.forEach(item => {
  if (item.country === "Peru") {
    console.log({ countries: { lat: item.lat, lon: item.lon } });
  }
});
// The Cloud Datastore key for the new entity
const allKey = datastore.key(["all", "id"]);
// The Cloud Datastore key for the new entity
const countryKey = datastore.key(["countries", "id"]);

(async () => {
  const data = await datastore.get(allKey);
  console.log(data[0]);
})();

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
  // Prepares the new entity
  const task = {
    key: allKey,
    data: result
  };
  // Saves the entity
  await datastore.save(task);
  // db.set("all", result);
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
  const totalColumns = 10;
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
      let country
      try {
        country =
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
      } catch (error) {
        console.log(
          error, 'Juan CArlos error', country
        );
      }
      if (coordinates.country === country.trim()) {
        resultAll[resultAll.length - 1].coordinates = {
          lat: item.lat,
          lon: item.lon
        };
      }else{
        new Error('There is an error in ', country)
      }
    }
    // get cases
    if (i % totalColumns === casesColIndex) {
      let cases;
      try {
        if (cell.children[0]) {
          cases = cell.children[0].data || "";
        } else {
          cases = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].cases = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get today cases
    if (i % totalColumns === todayCasesColIndex) {
      let todayCases;
      try {
        if (cell.children[0]) {
          todayCases = cell.children[0].data || "";
        } else {
          todayCases = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].todayCases = parseInt(
        todayCases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get deaths
    if (i % totalColumns === deathsColIndex) {
      let deaths;
      try {
        if (cell.children[0]) {
          deaths = cell.children[0].data || "";
        } else {
          deaths = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].deaths = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get today deaths
    if (i % totalColumns === todayDeathsColIndex) {
      let deaths;
      try {
        if (cell.children[0]) {
          deaths = cell.children[0].data || "";
        } else {
          deaths = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].todayDeaths = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // get cured
    if (i % totalColumns === curedColIndex) {
      let cured;
      try {
        if (cell.children[0]) {
          cured = cell.children[0].data || "";
        } else {
          cured = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].recovered = parseInt(
        cured.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // get critical
    if (i % totalColumns === criticalColIndex) {
      let critical;
      try {
        if (cell.children[0]) {
          critical = cell.children[0].data || "";
        } else {
          critical = "";
        }
      } catch (error) {
        console.log("Error", error);
      }
      resultAll[resultAll.length - 1].critical = parseInt(
        critical.trim().replace(/,/g, "") || "0",
        10
      );
    }
  }

  // Prepares the new entity
  const countries = {
    key: countryKey,
    data: {
      countries: resultAll
    }
  };
  console.log(countries);
  // Saves the entity
  await datastore.save(countries);
  //  const countryKey = datastore.key(['Company', 123]);

  // db.set("countries", resultAll);
  console.log("Updated The Countries");
}, 6000);

let listener = app.listen(8081, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

app.use(cors());
app.use("/", express.static("public"));
app.get("/all/", async function(req, res) {
  const data = await datastore.get(allKey);
  let all = data[0];
  res.send(all);
});

app.get("/countries/", async function(req, res) {
  const data = await datastore.get(countryKey);
  let countries = data[0].countries;
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
