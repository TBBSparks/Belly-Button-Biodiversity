function getPlot(id) {
    // Using D3 can pull json data
    d3.json("Data/samples.json").then((data)=> {
        
        //Credit to my friend "https://github.com/philstark" aka "Potato" for helping me understand this wfreq issue for the gauge Plotly plot.
        //He taught me a great deal with this homework and is a wonderful person.
        //in the variable definition I was not initially putting the ".wfreq" on the end to do the read of it properly 
        var wfreq = data.metadata.filter(s => s.id.toString() === id)[0].wfreq;

        // Sample by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
  
        // .slice 0 to 9 not after 10 and reversing for bar chart
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // .slice 0 to 9 plus reverse to get top10 
        var Top_OTU = (samples.otu_ids.slice(0, 10)).reverse();
        var otuID = Top_OTU.map(d => "OTU " + d)
  
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        // Bar plot we want is horizontal so including "orientation: "h". 
        var trace = {
            x: samplevalues,
            y: otuID,
            text: labels,
            marker: {
              color: 'rgb(69,69,69)'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        // Layout with title and padding for viewability (is that a word?)
        var LayoutForBar = {
            title: "OTU top 10",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 50,
                t: 100,
                b: 50
            }
        };

        // Plot the bar plot (not a bar plot of bars, can't go there during COVID)
        Plotly.newPlot("bar", data, LayoutForBar);
  
        // Bubble plot we are coloring based on the otu_id which is bacteria, which is gross
        // Bubble plotting for plotly visited https://plotly.com/python/bubble-charts/ for some help and sanity checks
        
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // layout out for the bubble plot
        var LayoutForBubble = {
            xaxis:{title: "OTU ID (Bacteria)"},
            height: 1000,
            width: 1000
        };
  
        var data1 = [trace1];
  
        // Plot out the bubble
        Plotly.newPlot("bubble", data1, LayoutForBubble); 
  
        // Guage chart basic design. Played with colors a bit
        // Plotly colours list found at https://community.plotly.com/t/plotly-colours-list/11730 was helpful to play with the look
        // Plotly gauge code researched here and manipulated https://plotly.com/python/gauge-charts/
        
        var trace2 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: `Wash Freq` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9], tickcolor: "darkblue" },bar: {'color': "darkblue"},

                   steps: [
                    { range: [0, 1], color: "lightgray" },
                    { range: [1, 2], color: "lightgray" },
                    { range: [2, 3], color: "darkgray" },   
                    { range: [3, 4], color: "darkgray" },
                    { range: [4, 5], color: "gray" },
                    { range: [5, 6], color: "gray" },
                    { range: [6, 7], color: "lightslategray" },
                    { range: [7, 8], color: "lightslategray" },
                    { range: [8, 9], color: "darkslategray" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };

        // Plot out the gauge
        console.log(wfreq)
        Plotly.newPlot("gauge", trace2, layout_g);
      });
  }  

// Function to get data
function getInfo(id) {
   
    d3.json("Data/samples.json").then((data)=> {
        
        // getting data for the panel
        var metadata = data.metadata;

        // Filtering on id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        console.log(result)

        //#sample-metadata (showing relationship for my own sanity)
        // <h3 class="panel-title">Demographic Info</h3>
          //</div>
          //<div id="sample-metadata" class="panel-body"></div>
        //</div>
        //I found this helpful in understanding this concept in d3.select https://bost.ocks.org/mike/selection/
        var demographicInfo = d3.select("#sample-metadata");
        
        // Clear
        demographicInfo.html("");

        // Data for the ID
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Function for init data
function init() {
    // #selectDataset (again for my own sanity)
    // <h5>Test Subject ID No.:</h5>
    // <select id="selDataset" onchange="optionChanged(this.value)"></select>
    var dropdown = d3.select("#selDataset");

    // d3.json reads the jason data  
    d3.json("Data/samples.json").then((data)=> {
        //console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();
