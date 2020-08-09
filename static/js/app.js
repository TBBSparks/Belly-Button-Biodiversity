function getPlot(id) {
    // Using D3 can pull json data
    d3.json("Data/samples.json").then((data)=> {
        
        
        //Having trouble with the washing frequency for now but looking for solutions
        var wfreq = data.metadata.map(d => d.wfreq)
        //var wfreq = data.metadata.filter(d )
        //console.log(`Washing Freq: ${wfreq}`)
        //console.log(wfreq)

        // Sample by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        //console.log(samples);
  
        // .slice 0 to 9 not after 10 and reversing for bar chart
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // .slice 0 to 9 plus reverse to get top10 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        // Bar plot we want is horizontal so including "orientation: "h"
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(69,69,69)'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        // Layout with title and padding for viewability (is that a word?)
        var LayoutForBar = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // Plot the bar plot
        Plotly.newPlot("bar", data, LayoutForBar);
  
        // Bubble plot we are coloring based on the otu_id which is bacteria
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
  
        // layout out for the bubble plot I'm not quite satisfied yet and plan to manipulate
        var LayoutForBubble = {
            xaxis:{title: "OTU ID (Bacteria)"},
            height: 1000,
            width: 1000
        };
  
        var data1 = [trace1];
  
        // Plot out the bubble
        Plotly.newPlot("bubble", data1, LayoutForBubble); 
  
        // My gauge chart is not quite currently working (variable issues)
  
        var trace2 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: 6,
          title: { text: `Wash Freq` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9], tickcolor: "darkblue" },bar: {'color': "darkblue"},

                   steps: [
                    { range: [0, 2], color: "cyan" },
                    { range: [2, 4], color: "teal" },
                    { range: [4, 6], color: "royalblue" },
                    { range: [6, 8], color: "RebeccaPurple" },
                    { range: [8, 9], color: "red" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };

        // Plot out the gauge
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

        //#sample-metadata from index.html (showing relationship here)
        // <h3 class="panel-title">Demographic Info</h3>
          //</div>
          //<div id="sample-metadata" class="panel-body"></div>
        //</div>
        var demographicInfo = d3.select("#sample-metadata");

        //console.log(demographicInfo)
        
        // Clear the panel out
        demographicInfo.html("");

        // Getting the data for the ID and append
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Function for initial data
function init() {
    // #selectDataset from index.html id="selDataset"
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