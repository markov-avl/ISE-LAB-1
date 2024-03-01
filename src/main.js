import * as d3 from "d3";


d3.csv("./res/countries.csv")
    .then(data => {
        console.log(data)
    });
