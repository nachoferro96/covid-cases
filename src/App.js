import "./App.css";
import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryinfo, setCountryinfo] = useState({});
  const [tableData, setTabledata] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryinfo(data);
      });
  }, []);

  useEffect(() => {
    const getcountriesdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sorteddata = sortData(data);
          setTabledata(sorteddata);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getcountriesdata();
  }, []);

  const oncountrychange = (event) => {
    const countrycode = event.target.value;

    setCountry(countrycode);

    const url =
      countrycode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countrycode}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countrycode);
        setCountryinfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app-left">
        <div className="app-header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app-dropdown">
            <Select
              variant="outlined"
              onChange={oncountrychange}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app-stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryinfo.todayCases)}
            total={prettyPrintStat(countryinfo.cases)}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryinfo.todayRecovered)}
            total={prettyPrintStat(countryinfo.todayRecovered)}
          />
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryinfo.todayDeaths)}
            total={prettyPrintStat(countryinfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app-right">
        <CardContent>
          <h3>Live Cases In every Country</h3>
          <Table countries={tableData} />
          <h3 className="app-title">WorldWide new cases {casesType}</h3>
          <LineGraph className="app-graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
