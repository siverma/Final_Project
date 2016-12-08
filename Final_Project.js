var margin = {top: 25, right: 150, bottom: 40, left: 5},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0,2e6])
    .range([height, 0]);


var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .innerTickSize(-height)
    .tickPadding(10);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width) //Draws inner horizontal grid lines 
    .tickPadding(10); //sets padding for the values on the y axis

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {return x(d.date); })
    .y(function(d) {return y(d.population); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right + 270)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left+ 250) + "," + margin.top + ")");


d3.csv("China_India_Data.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
      
    var parseDate = d3.time.format("%Y").parse;
    d.date = parseDate(d.date);
    
  });

    
  var Series = color.domain().map(function(SeriesName) {
    return {
      name: SeriesName,
      values: data.map(function(d) {
        return {date: +d.date, population: (+d[SeriesName]/1000000)};
      })
    };
  });
    
  x.domain(d3.extent(data, function(d) { return d.date; }));

    //Defines min and max data points for domain
  y.domain([
    d3.min(Series, function(c) { return d3.min(c.values, function(v) { return (v.population); }); }),
    d3.max(Series, function(c) { return d3.max(c.values, function(v) { return (v.population); }); })
  ]);

    //Modifications to the xAxis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width + 40)
      .attr("y", 20)
      .text("Year")
  
  //Modifications to the yAxis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -20)
      .attr("x", -(height/2))
      .attr("dy", "-3em")
      .text("million people")
      .style("text-anchor", "middle")

    
  var SeriesLine = svg.selectAll(".Series")
      .data(Series)
      .enter().append("g")
      .attr("class", "so");

  var path = SeriesLine.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("fill", "none")
        var path = SeriesLine.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("fill", "none")
      .style("stroke", function(d) 
             {if (d.name != ("India: Urban" || "China: Urban")){return color(d.name)} 
                  else{
                    return "purple"
                  }});
    
    var totalLength = path.node().getTotalLength();
    
    //Adapted from example in class
    path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition().ease("exp").duration(3200).attr("stroke-dashoffset", 0)
    

    SeriesLine.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.population) + ")"; })
      .attr("x", 3)
      .attr("dy", ".3em")
      .text(function(d) { return d.name; });

});
