
const url = "https://api.spacexdata.com/v2/launchpads";

//d3.json(url).then(receivedData => console.log(receivedData));

/*d3.json("samples.json").then(function(data){
    console.log(data);
});*/

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubbleCharts(newSample);
  buildGaugeCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: "+result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " +result.age);
    PANEL.append("h6").text("LOCATION: " +result.location);
    PANEL.append("h6").text("BBTYPE: " +result.bbtype);
    PANEL.append("h6").text("WFREQ: " +result.wfreq);

  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var topTensamples = result.sample_values.slice(0,10).reverse();
    
    var topTenOTU  = result.otu_ids.slice(0,10).reverse();
    var topTenLabel = result.otu_labels.slice(0,10).reverse();

    topTenOTU = topTenOTU.map(item =>  ('OTU ' + item.toString()));
    
    
    var trace1 = {
      x: topTensamples,
      y: topTenOTU,
      text: topTenLabel,
      type: "bar",
      orientation: "h"
    };
    // data
    var data = [trace1];

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", data);
  });
}

function buildBubbleCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var topTensamples = result.sample_values.slice(0,10).reverse();
    
    var topTenOTU  = result.otu_ids.slice(0,10).reverse();
    var topTenLabel = result.otu_labels.slice(0,10).reverse();

    topTenOTU = topTenOTU.map(item =>  ('OTU ' + item.toString()));
    
    

    var trace1 = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: 'markers',
      marker: {
        color: result.otu_ids,
        //opacity: [1, 0.8, 0.6, 0.4],
        text: result.otu_labels,
        size: result.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      //title: 'Marker Size and Color',
      //showlegend: false,
      xaxis: {
        title :'OTU ID'
      }/*,
      height: 600,
      width: 600*/
    };
    
    Plotly.newPlot('bubble', data, layout);
  });
}

function buildGaugeCharts(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    /*define x and y position of pointer tip*/
	var degrees = (9-result.wfreq)*20,
  radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

/*create a triangle to represent a pointer*/
var mainPath = 'M .0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);
/*define data for dot (scatter) and pie chart*/
var datagauge = [
{ type: 'scatter',
  x: [0,], y:[0],
 marker: {size: 28, color:'850000'},
 showlegend: false,
 name: 'scrubs',
 text: result.wfreq,
 hoverinfo: 'text+name'},
 
 { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50/9, 50],
 rotation: 90,
 text: ['8-9', '7-8', '6-7','5-6', '4-5', '3-4', '2-3',
         '1-2', '0-1', ''],
 textinfo: 'text',
 textposition:'inside',
 marker: {colors:['rgba(30,120,30, .5)', 'rgba(55,135,55, .5)','rgba(80,150,80, .5)',
         'rgba(105,165,105, .5)', 'rgba(130,180,130, .5)','rgba(155,195,155, .5)',
          'rgba(180,210,180, .5)','rgba(205,225,205, .5)', 'rgba(230,240,230, .5)',
                      'rgba(255, 255, 255, 0)']},
 hoverinfo: 'none',
 hole: .5,
 type: 'pie',
 showlegend: false}
];
/*define the layout, shape and path*/
var layout = {
   shapes:[{
     type: 'path',
     path: path,
     fillcolor: '850000',
     line: { color: '850000' }
   }],
   title: '<b>Belly Button Washing Frequency</b><br>Scrups per Week',
   height: 600,
   width: 600,
   /*move the zero point to the middle of the pie chart*/
   xaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]},
   yaxis: {zeroline:false, showticklabels:false,
          showgrid: false, range: [-1, 1]}
 };

Plotly.newPlot('gauge', datagauge, layout);

     
  });
}


function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })
  optionChanged("940");  
}
  
  init();

// Sort the data array using the greekSearchResults value
/*data.sort(function(a, b) {
  return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
});

// Slice the first 10 objects for plotting
data = data.slice(0, 10);

// Reverse the array due to Plotly's defaults
data = data.reverse();

// Trace1 for the Greek Data
var trace1 = {
  x: data.map(row => row.greekSearchResults),
  y: data.map(row => row.greekName),
  text: data.map(row => row.greekName),
  name: "Greek",
  type: "bar",
  orientation: "h"
};

// data
var data = [trace1];

// Apply the group bar mode to the layout
var layout = {
  title: "Greek gods search results",
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", data, layout);*/
