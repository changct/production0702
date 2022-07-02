let scatterLeft = 0, scatterTop = 0;
let scatterTotalWidth = 500, scatterTotalHeight = 400;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 100},
    scatterWidth = scatterTotalWidth  - scatterMargin.left - scatterMargin.right,
    scatterHeight = scatterTotalHeight - scatterMargin.top - scatterMargin.bottom;

let lineLeft = 0, lineTop = 400;
let lineTotalWidth = 600, lineTotalHeight = 100;
let lineMargin = {top: 10, right: 30, bottom: 30, left: 100},
        lineWidth = lineTotalWidth  - lineMargin.left - lineMargin.right,
        lineHeight = lineTotalHeight - lineMargin.top - lineMargin.bottom;
    

let barLeft = 0, barTop = 500;
let barTotalWidth = 1000, barTotalHeight = 150;
let barMargin = {top: 30, right: 30, bottom: 40, left: 100},
        barWidth = barTotalWidth  - barMargin.left - barMargin.right,
        barHeight = barTotalHeight - barMargin.top - barMargin.bottom;

let mapLeft = 500-200, mapTop = 0-150;
let mapTotalWidth = 1000, mapTotalHeight = 800;
let mapMargin = {top: 10, right: 10, bottom: 10, left: 10},
    mapWidth = mapTotalWidth  - mapMargin.left - mapMargin.right,
    mapHeight = mapTotalHeight - mapMargin.top - mapMargin.bottom;
//practice 1=======================================
d3.csv("highPollution.csv").then(data =>{
    data.forEach(function(d){
        d.day = Number(d.day);
        d.hour = Number(d.hour);
        d.year = Number(d.year);
        d.month = Number(d.hour);
        d.weekday = Number(d.weekday);
        d.gps_lat = Number(d.gps_lat);
        d.gps_lon = Number(d.gps_lon);
        d.umapX = Number(d.umapX);
        d.umapY = Number(d.umapY);
        d.value  = d.value.replace("[", "");
        d.value  = d.value.replace("]", "");
        d.value = d.value.split(',');
        for (i = 0; i < d.value.length; i++) {
            d.value[i] = parseFloat(d.value[i]);
            //d.value[i] = parseInt(d.value[i]);
        }
        //d.will = 0;

    });
    console.log(data);
    
    var data_n =0;

    // map background
    let svg_map = d3.select("#area").append("svg")
    .attr("width", mapTotalWidth)
    .attr("height", mapTotalHeight)
    .attr("transform", `translate(${mapLeft}, ${mapTop})`);
    let g_map = svg_map.append("g")
   .attr("transform", `translate(${mapMargin.left}, ${mapMargin.top})`);


   //practice 2 ==================
  let svg_scatter = d3.select("#area").append("svg")
                    .attr("width", scatterTotalWidth)
                    .attr("height", scatterTotalHeight)
                    .attr("transform", `translate(${scatterLeft}, ${scatterTop})`);


  let g_scatter = svg_scatter.append("g")
              .attr("transform", `translate(${scatterLeft+ scatterMargin.left }, ${scatterTop + scatterMargin.top })`)

  let tip = d3.tip()
              .attr('class','d3-tip')
              .html(function(d){
                  return "Day: " +d.day+"<br>" +"Hour: " + d.hour+"<br>" + d.value
                     });

  

  g_scatter.call(tip);
 

  var small =  d3.mean(data[0].value);;
  var big =  d3.mean(data[0].value);;
    for(var j=1; j<data.length ; j++){
         var cc = d3.mean(data[j].value);
         if (small > cc){
           small = cc;
         }
         if(big < cc){
           big =cc;
         }
     }
 

  let min_umapX = d3.min(data, d=>d.umapX);
  let max_umapX = d3.max(data, d=>d.umapX);
  let min_umapY = d3.min(data, d=>d.umapY);
  let max_umapY = d3.max(data, d=>d.umapY);
  console.log("min_valueAvg: " + min_umapX);


  let x = d3.scaleLinear()
            .domain([min_umapX, max_umapX])
            .range([0, scatterWidth])

  let xAxisCall = d3.axisBottom(x)
                    .ticks(9)
                    .tickFormat("")
              
  g_scatter.append("g").attr("transform", `translate(${scatterLeft}, ${scatterHeight})`).call(xAxisCall)




  let y = d3.scaleLinear()
            .domain([min_umapY, max_umapY])
            .range([scatterHeight, 0])

  let yAxisCall = d3.axisLeft(y)
                    .ticks(11)
                    .tickFormat("")
              
  g_scatter.append("g").call(yAxisCall)

  
  

  let color_scatter = d3.scaleSequential().domain([small, big])
                        .interpolator(d3.interpolateReds);
  


  let circle_brush = d3.brush()
    .extent([[0, 0], [scatterWidth, scatterHeight]])
    .on("start", circle_brushed)
    .on("brush", circle_brushed)
    .on("end", circle_endbrushed);

  g_scatter.call(circle_brush);
  
 

 var gscatter = g_scatter.append("g").selectAll("circle").data(data)
                          .enter().append("circle")
                          .attr("cx", function(d, i){
                                             return  x(d.umapX);
                                })
                          .attr("cy", function(d, i){
                                             return   y(d.umapY);
                               })
                          .attr("r", 2)
                          .attr("fill", (d)=>color_scatter(d3.mean(d.value)))
                          .on('mouseover', tip.show)
                          .on('mouseout', tip.hide);



                 
   // practice 3 ======================
   let svg_line = d3.select("#area").append("svg")
                   .attr("width", lineTotalWidth)
                   .attr("height", lineTotalHeight)
                   .attr("transform", `translate(${lineLeft}, ${lineTop})`);

   let g_line = svg_line.append("g")
                   .attr("transform", `translate(${lineMargin.left}, ${lineMargin.top})`);
   
   //X lable
   g_line.append("text")
         .attr("x", lineWidth / 2)
         .attr("y", lineHeight + 30)
         .attr("font-size", "12px")
         .attr("text-anchor", "middle")
         .text("Local Time(hour)")
   //Y lable
   g_line.append("text")
         .attr("x", -(lineHeight / 2))
         .attr("y", -40)
         .attr("font-size", "12px")
         .attr("text-anchor", "middle")
         .attr("transform", "rotate(-90)")
         .text("PM2.5")
    
    
 
   let line_data = []
   let all = []

   for(let j = 0; j<data.length; j++){
       let line_set = []
  
       for(let g = 0; g<data[j].value.length; g++){  
        line_set.push([g-3,data[j].value[g]]);
          all.push(data[j].value[g]);
        }  
      
       line_data.push(line_set);
    }

    let max_value = d3.max(all, d=>d);
    console.log(max_value);
    let x_line = d3.scaleLinear()
                .domain([-3, 3])
                .range([0,lineWidth]);

    let xAxisCall_line = d3.axisBottom(x_line)
                .ticks(7);
                
    g_line.append("g")
            .attr("transform", `translate(0, ${lineHeight})`)
            .call(xAxisCall_line);
                
    let y_line = d3.scaleLinear()
                .domain([0,max_value])
                .range([lineHeight, 0]);
                
    let yAxisCall_line = d3.axisLeft(y_line);
                
    g_line.append("g").call(yAxisCall_line);

    var lineGenerator = d3.line().x(function(d) { return x_line(d[0]);  })
                                 .y(function(d) { return y_line(d[1]);});
   let lines = drawLines(line_data);
   function drawLines(line_data){
    return g_line.selectAll("path")
          .data(line_data)
          .enter().append("path")
          .attr("d", lineGenerator)
         .attr("fill", "none")
         .attr("stroke", "black")
         .attr("opacity", 0.1)
         .attr("stroke-width", 1);
    }


  // practice 4 ======================
  let svg_bar = d3.select("#area").append("svg")
  .attr("width", barTotalWidth)
  .attr("height", barTotalHeight)
  .attr("transform", `translate(${barLeft}, ${barTop})`);

  let g_bar = svg_bar.append("g")
  .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`);

  //X lable
  g_bar.append("text")
  .attr("x", barWidth / 2)
  .attr("y", barHeight + 40)
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .text("Time")
  //Y lable
   g_bar.append("text")
  .attr("x", -(barHeight / 2))
  .attr("y", -40)
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Number of Devices")
  
  //data

  let counts = data_counts(data);
  

  function data_counts(data){
    let time_temp = [];
     data.forEach(function(d){
        hour = String(d.hour).padStart(2, '0');
        time_temp.push(`${d.day}-${hour}`);
     });

     let counts_temp = {};
     time_temp.forEach(function(d){
        counts_temp[d] = (counts_temp[d] || 0) + 1;
     })

     let counts = [];
  
    for (var key in counts_temp){
      record = new Object();
      record["time"] = key;
      record["hour"] = parseInt(key.split("-")[1], 10);
      record["number"] = counts_temp[key];
      counts.push(record);
    }

    function compare( a, b ) {
      if ( a.time < b.time ){
        return -1;
      }
      if ( a.time > b.time ){
        return 1;
      }
      return 0;
    }
    counts.sort(compare);
    return counts;
  }
  let xScale_bar = d3.scaleBand()
  .domain(counts.map(d => d.time))
  .range([0,barWidth])
  .paddingInner(0.3)
  .paddingOuter(0.2);

  //Bar X ticks
  let xAxis_bar = d3.axisBottom(xScale_bar)
                  .tickFormat(function(d,i){
                      if( i%2 != 0 ) {return d;}
                  });
  g_bar.append("g")
      .attr("transform", `translate(0, ${barHeight})`)
      .call(xAxis_bar)
      .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("font-size", "8px")

  

  let yScale_bar = d3.scaleLinear()
     .domain([0,120])
      .range([barHeight, 0]);
  
  //Bar Y ticks
  let yAxis_bar = d3.axisLeft(yScale_bar).ticks(7);
  let y_bar = g_bar.append("g").call(yAxis_bar);

  let color_bar = d3.scaleSequential().domain([0,23])
  .interpolator(d3.interpolateBuGn);
  
  let bars = g_bar.selectAll("rect").data(counts)
        .enter().append("rect")
        .attr("y", d => yScale_bar(d.number))
        .attr("x", (d) => xScale_bar(d.time))
        .attr("width", xScale_bar.bandwidth)
        .attr("height", d => barHeight - yScale_bar(d.number))
        .attr("stroke", "black")
        .attr("fill", (d)=>color_bar(d.hour));

    let bar_brush = d3.brushX()
        .extent([[0, 0], [barWidth, barHeight]])
        .on("start", bar_brushed)
        .on("brush", bar_brushed)
        .on("end", bar_endbrushed)
        ;
    g_bar.call(bar_brush);
//practice 5 =======================

let marks;
let pathData ="m 0 0 l 12 0 l -2 4 l 5 3 l -4 5 l -4 -3 l -3 4 z ";
let projection;
d3.json("taiwan.json").then(drawTaiwan);


function drawTaiwan(taiwan) {
    var width = mapWidth;
    var height = mapHeight;
  
    projection = d3.geoMercator()
          .fitExtent([[0,0], [mapWidth, mapHeight]], taiwan);
    
    var geoGenerator = d3.geoPath()
          .projection(projection);
  
    var paths = g_map.selectAll('path')
          .data(taiwan.features)
          .enter()
          .append('path')
          .attr('stroke', "black")
          .attr('fill', 'white')
          .attr('d', geoGenerator);
     
      marks = drawMarks(data);
  
  }

  function drawMarks(data) {
    return g_map.selectAll('path').data(data)
    .enter().append('path').attr('d', pathData)
    .attr('transform', function(d) {
        let x = projection([d.gps_lon, d.gps_lat])[0];
        let y = projection([d.gps_lon, d.gps_lat])[1];
        return 'translate(' + x + ',' + y + ')';
    })
    .attr('fill', 'orange')
    .attr('stroke', 'black')
    .attr('stroke-width',1 ) 
}


  let data_selected = [];
  function circle_brushed() {
      var extent = d3.event.selection;
      data_selected = [];
      gscatter
      .classed("circle-selected", function(d) {
          selected = x(d.umapX) >= extent[0][0] && 
          x(d.umapX) <= extent[1][0] && 
          y(d.umapY) >= extent[0][1] && 
          y(d.umapY) <= extent[1][1];
          if(selected) data_selected.push(d);
          return selected;
      });
      
  }
  let t= d3.transition().duration(4000)
  let new_counts = counts.map(a => {return {...a}})
  function circle_endbrushed() {
    if(data_selected.length != 0) {
        //更新Map圖的標記
        marks.remove();
        marks = drawMarks(data_selected);

        //更新Line圖
        let line_dataset_selected = [];
        let value_temp = [];
        data_selected.forEach(function(d){
            let line_dataset = [];
            d.value.forEach(function(d,i){ 
                line_dataset.push([i-3, d]);
                value_temp.push(d);
            });
            line_dataset_selected.push(line_dataset);
        });
        lines.remove();
        lines = drawLines(line_dataset_selected);

        //更新bar圖
        let counts_selected = data_counts(data_selected);
        //用counts_selected來更新new_counts資料，沒對應到的資料，其number設為0。
        //number會影響bar的高低。
        new_counts.forEach(function(d){
            d.number = 0;
            for(let i=0; i < counts_selected.length; i++) {
                if(d.time === counts_selected[i].time) {
                    d.number = counts_selected[i].number;
                }
            }
        });

        bars.data(new_counts)
        .attr("x", (d) => xScale_bar(d.time))
        .attr("width", xScale_bar.bandwidth)
        .attr("stroke", "black")
        .attr("fill", (d)=>color_bar(d.hour))
        .transition().duration(2000)
        .attr("y", d => yScale_bar(d.number))
        .attr("height", d => barHeight - yScale_bar(d.number))
        ;
        let new_yScale_bar = d3.scaleLinear()
                        .domain([0,d3.max(new_counts, d => d.number )])
                        .range([barHeight, 0]);
        let new_yAxis_bar = d3.axisLeft(new_yScale_bar).ticks(7);
        y_bar.transition().duration(2000).call(new_yAxis_bar);
    } else {
        //復原
        marks.remove();
        marks = drawMarks(data);
    
        lines.remove();
        lines = drawLines(line_data);

        bars.data(counts)
        .attr("x", (d) => xScale_bar(d.time))
        .attr("width", xScale_bar.bandwidth)
        .attr("stroke", "black")
        .attr("fill", (d)=>color_bar(d.hour))
        .transition().duration(2000)
        .attr("y", d => yScale_bar(d.number))
        .attr("height", d => barHeight - yScale_bar(d.number))
        ;
        let new_yScale_bar = d3.scaleLinear()
                        .domain([0,d3.max(counts, d => d.number )])
                        .range([barHeight, 0]);
        let new_yAxis_bar = d3.axisLeft(new_yScale_bar).ticks(7);
        y_bar.transition().duration(2000).call(new_yAxis_bar);
    }
 }
 let data_selected_bar = [];
 function bar_brushed() {
     var extent = d3.event.selection;
     
     data_selected_bar = [];
     bars.classed("bar-selected", function(d) {
         let selected = xScale_bar(d.time) >= extent[0] && 
         xScale_bar(d.time) <= extent[1] 
         if(selected) data_selected_bar.push(d);
         return selected;
     });
 }

 let data_selected2 = [];
 function sett(input) {
     input.forEach(function(d){
         let hour = String(d.hour).padStart(2, '0');
         let time = `${d.day}-${hour}`;
         for(let i=0; i < data_selected_bar.length; i++) {
             if(time === data_selected_bar[i].time) data_selected2.push(d);
         }
     });
 }
 function bar_endbrushed() {
     data_selected2 = [];
     if(data_selected_bar.length != 0) {          
         if(data_selected.length != 0) {
             sett(data_selected);
         } else {
             sett(data);
         }
         //更新Map圖的標記
         marks.remove();
         marks = drawMarks(data_selected2);
     } else {
         //復原
         marks.remove();
         if(data_selected.length == 0 ) {
             marks = drawMarks(data);
         } else {
             marks = drawMarks(data_selected);
         }
         
     }
 }






  
});

