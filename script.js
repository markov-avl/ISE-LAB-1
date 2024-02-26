import * as d3 from "d3";

d3.csv("resource/countries.csv")
    .then(data => {
        console.log(data)
    });