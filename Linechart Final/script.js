d3.csv("./data/hate_crime_summary.csv").then(function(data) {

    console.log(data);

    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 150};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /*
    CREATE DATA SLICES 
    */

    const data_south = data.filter(function(d) {
        return d.Region == "South"; 
    });

    console.log(data_south); 

    const data_west = data.filter(function(d) {
        return d.Region == "West"; 
    });

    console.log(data_west); 

    const data_northeast = data.filter(function(d) {
        return d.Region == "Northeast"; 
    })

    console.log(data_northeast);

    const data_midwest = data.filter(function(d) {
        return d.Region == "Midwest"; 
    })

    console.log(data_midwest); 

    /*
    DETERMINE MIN AND MAX VALUES OF VARIABLES
    */
    // const years = {
    //     minSouth: d3.min(data_south, function(d) { return +d.Year}),
    //     maxSouth: d3.max(data_south, function(d) { return +d.Year}),
    //     minWest: d3.min(data_west, function(d) { return +d.Year}),
    //     maxWest: d3.max(data_west, function(d) {return +d.Year}),
    //     minNortheast: d3.min(data_northeast, function(d) { return +d.Year}),
    //     maxNortheast: d3.max(data_northeast, function(d) {return +d.Year}),
    //     minMidwest: d3.min(data_midwest, function(d) { return +d.Year}),
    //     maxMidwest: d3.max(data_midwest, function(d) {return +d.Year})
    // };

    // const victims = {
    //     minSouth: d3.min(data_south, function(d) { return +d.VictimCount}),
    //     maxSouth: d3.max(data_south, function(d) {return +d.VictimCount}),
    //     minWest: d3.min(data_west, function(d) { return +d.VictimCount}),
    //     maxWest: d3.max(data_west, function(d) {return +d.VictimCount}),
    //     minNortheast: d3.min(data_northeast, function(d) { return +d.VictimCount}),
    //     maxNortheast: d3.max(data_northeast, function(d) {return +d.VictimCount}),
    //     minMidwest: d3.min(data_midwest, function(d) { return +d.VictimCount}),
    //     maxMidwest: d3.max(data_midwest, function(d) {return +d.VictimCount})
    // }

    const years = {
        min: d3.min(data, function(d) {return +d.Year}), 
        max: d3.max(data, function(d) {return +d.Year}) 
    };

    const victims = {
        min: d3.min(data, function(d) {return +d.VictimCount}),
        max: d3.max(data, function(d) {return +d.VictimCount})
    };

    console.log(years);

    /*
    CREATE SCALES
    */

    // const xScale = d3.scaleLinear()
    //     .domain([years.minSouth, years.maxSouth])
    //     .range([margin.left, width-margin.right]);

    // const yScale = d3.scaleLinear()
    //     .domain([victims.minSouth, victims.maxSouth])
    //     .range([height-margin.bottom, margin.top]); 

    const xScale = d3.scaleLinear()
        .domain([years.min, years.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([victims.min, victims.max])
        .range([height-margin.bottom, margin.top]); 

    /*
    DRAW AXES
    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("")));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    /*
    CREATE LINE GENERATOR
    */

    const line = d3.line()
    .x(function(d) { return xScale(d.Year); })
    .y(function(d) { return yScale(d.VictimCount); })
    .curve(d3.curveLinear);

    /*
    DRAW LINE
    */

    let path = svg.append("path")
        .datum(data_south)
            .attr("d", function(d) { return line(d); })
            .attr("stroke", "#01FDF6")
            .attr("stroke-width", 2)
            .attr("fill", "none");

    /*
    DRAW THE POINTS
    */

    let points = svg.selectAll("circle")
        .data(data_south)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 8)
                .attr("fill","#01FDF6");

    /*
    DRAW AXIS LABELS
    */

    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Year")
        .attr("fill", "white");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Total Victims")
        .attr("fill", "white");

    /*
    TOOLTIP
    */

    let tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

        svg.selectAll("circle").on("mouseover", function (e,d) {
    
            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");

            tooltip.style("visibility", "visible")
                .style("left", `${cx}px`)
                .style("top", `${cy}px`)
                .html(`<b>Year</b>: ${d.Year}<br><b>Total Victims</b>: ${d.VictimCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);

            d3.select(this)
                .attr("stroke", "white")
                .attr("stroke-width", 3);

            }).on("mouseout", function (){

            tooltip.style("visibility", "hidden");

            d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
        });

    /*
    DATA UPDATE WITH TRANSITION
    */

        /* South data slice */

        d3.select("#South").on("click", function() {

            xScale.domain([years.min, years.max]);
            yScale.domain([victims.min, victims.max]);

            path.datum(data_south)
                .transition()
                .duration(1500)
                .attr("d", function(d) { return line(d); });

            let enterPoints = svg.selectAll("circle")
                .data(data_south, function(d) {return d.Region; });

            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 0)
                .attr("fill","#01FDF6")
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 8)
                .attr("fill","#01FDF6");

            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();

            /* Update tooltip for South data slice */

            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");

                svg.selectAll("circle").on("mouseover", function (e,d) {
    
                let cx = +d3.select(this).attr("cx");
                let cy = +d3.select(this).attr("cy");

                tooltip.style("visibility", "visible")
                    .style("left", `${cx}px`)
                    .style("top", `${cy}px`)
                    .html(`<b>Year</b>: ${d.Year}<br><b>Total Victims</b>: ${d.VictimCount}`)

                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 3);

                }).on("mouseout", function (){

                tooltip.style("visibility", "hidden");

                d3.select(this)
                    .attr("stroke", "none")
                    .attr("stroke-width", 0);
            });
        });

        /* West data slice */

        d3.select("#West").on("click", function() {

            xScale.domain([years.min, years.max]);
            yScale.domain([victims.min, victims.max]);

            path.datum(data_west)
                .transition()
                .duration(1500)
                .attr("d", function(d) { return line(d); });

            let enterPoints = svg.selectAll("circle")
                .data(data_west, function(d) {return d.Region; });

            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 0)
                .attr("fill","#01FDF6")
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 8)

            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();

            /* Update tooltip for West data slice */

            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");

                svg.selectAll("circle").on("mouseover", function (e,d) {
    
                let cx = +d3.select(this).attr("cx");
                let cy = +d3.select(this).attr("cy");

                tooltip.style("visibility", "visible")
                    .style("left", `${cx}px`)
                    .style("top", `${cy}px`)
                    .html(`<b>Year</b>: ${d.Year}<br><b>Total Victims</b>: ${d.VictimCount}`)

                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 3);

                }).on("mouseout", function (){

                tooltip.style("visibility", "hidden");

                d3.select(this)
                    .attr("stroke", "none")
                    .attr("stroke-width", 0);
            });
        });

        /* Northeast data slice */

        d3.select("#Northeast").on("click", function() {

            xScale.domain([years.min, years.max]);
            yScale.domain([victims.min, victims.max]);

            path.datum(data_northeast)
                .transition()
                .duration(1500)
                .attr("d", function(d) { return line(d); });
    
            let enterPoints = svg.selectAll("circle")
                .data(data_northeast, function(d) {return d.Region; });
    
            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 0)
                .attr("fill","#01FDF6")
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 8)
    
            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();

            /* Update tooltip for Northeast data slice */
    
            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");
    
            svg.selectAll("circle").on("mouseover", function (e,d) {
        
                let cx = +d3.select(this).attr("cx");
                let cy = +d3.select(this).attr("cy");
    
                tooltip.style("visibility", "visible")
                    .style("left", `${cx}px`)
                    .style("top", `${cy}px`)
                    .html(`<b>Year</b>: ${d.Year}<br><b>Total Victims</b>: ${d.VictimCount}`)
    
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 3);
    
                }).on("mouseout", function (){
    
                tooltip.style("visibility", "hidden");
    
                d3.select(this)
                    .attr("stroke", "none")
                    .attr("stroke-width", 0);
            });
        });

        /* Midwest data slice */

        d3.select("#Midwest").on("click", function() {

            xScale.domain([years.min, years.max]);
            yScale.domain([victims.min, victims.max]);
        
            path.datum(data_midwest)
                .transition()
                .duration(1500)
                .attr("d", function(d) { return line(d); });

            let enterPoints = svg.selectAll("circle")
                .data(data_midwest, function(d) {return d.Region; });
        
            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 0)
                .attr("fill","#01FDF6")
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return xScale(d.Year); })
                .attr("cy", function(d) { return yScale(d.VictimCount); })
                .attr("r", 8)
        
            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();
        
            /* Update tooltip for Midwest data slice */

            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");
        
            svg.selectAll("circle").on("mouseover", function (e,d) {
            
                let cx = +d3.select(this).attr("cx");
                let cy = +d3.select(this).attr("cy");
        
                tooltip.style("visibility", "visible")
                    .style("left", `${cx}px`)
                    .style("top", `${cy}px`)
                    .html(`<b>Year</b>: ${d.Year}<br><b>Total Victims</b>: ${d.VictimCount}`)
        
                d3.select(this)
                    .attr("stroke", "white")
                    .attr("stroke-width", 3);
        
                }).on("mouseout", function (){
        
                tooltip.style("visibility", "hidden");
        
                d3.select(this)
                    .attr("stroke", "none")
                    .attr("stroke-width", 0);
            });
        });









});

