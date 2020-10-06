/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

var width  = 960;
var height = 500;
var margin = 20;
var pad = margin / 2;

function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");
    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");
    var offset = tooltip.node().getBBox().width / 2;
    if ((x - offset) < 0) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (width - margin)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}

function tick(e) {
  // Push different nodes in different directions for clustering. Alogorithm to direct nodes- even spacing
  var k = 6 * e.alpha;
  graph.nodes.forEach(function(o, i) {
    o.y += i & 1 ? k : -k;
    o.x += i & 2 ? k : -k;
  });
  node.attr("cx", function(test2) { return test2.x; })
      .attr("cy", function(test2) { return test2.y; })
      
      ;
}

// Draws nodes on plot
function drawNodes(nodes) {
    // used to assign nodes color by group. check the .on "mouseover" event. can change to relation
    var color = d3.scale.category20();
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-nodes
    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("id", function(test2, i) { return test2.name; })
        .attr("cx", function(test2, i) { return test2.x; })
        .attr("cy", function(test2, i) { return test2.y; })
        .attr("r",  function(test2, i) { return 4; })
        .style("fill",   function(test2, i) { return color(test2.group); })
  			.on("mouseover", function(test2, i) { 
          var element = d3.select(this)
          addTooltip(element)
    		})
        .on("mouseout",  function(test2, i) { d3.select("#tooltip").remove(); });        
}

// Draws edges between nodes

function drawLinks(links) {
    var scale = d3.scale.linear()
        .domain(d3.extent(links, function(test2, i) {
           return test2.value;
        }))
        .range([1, 6]);
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-links
    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return test2.source.x; })
        .attr("y1", function(d) { return test2.source.y; })
        .attr("x2", function(d) { return test2.target.x; })
        .attr("y2", function(d) { return test2.target.y; })
        .style("stroke-width", function(test2, i) {
            return scale(d.value) + "px";
        })
        .style("stroke-dasharray", function(test2, i) {
            return (d.value <= 1) ? "2, 2" : "none";
        })
  			.style("stroke", function(test2, i) {
    				return "#ccc"
    		});
}

const visObject = {
 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  options: {
   first_option: {
    	type: "string",
      label: "My First Option",
      default: "Default Value"
    },
    second_option: {
    	type: "number",
      label: "My Second Option",
      default: 42
    }},
 
 /**
  * The create function gets called when the visualization is mounted but before any
  * data is passed to it.
  **/
	create: function(element, config){
		element.innerHTML = "<h1>Ready to render!</h1>";
	},

 /**
  * UpdateAsync is the function that gets called (potentially) multiple times. It receives
  * the data and should update the visualization with the new data.
  **/
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    var color = d3.scale.category20();
    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height);
    // draw plot background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#eeeeee");
    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", " + pad + ")");
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-force
    var layout = d3.layout.force()
        .size([width - margin, height - margin])
        .charge(-120)
        .linkDistance(function(test2, i) {
            return (test2.source.group == test2.target.group) ? 50 : 100;
        })
        .nodes["test2.data.nodes"]
        .links["test2.data.links"]
        .start();
    drawLinks["test2.data.links"];
    drawNodes["test2.data.nodes"];
    // add ability to drag and update layout
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-drag
    d3.selectAll(".node").call(layout.drag);
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-on
    layout.on("tick", function() {
        d3.selectAll(".link")
            .attr("x1", function(test2) { return test2.source.x; })
            .attr("y1", function(test2) { return test2.source.y; })
            .attr("x2", function(test2) { return test2.target.x; })
            .attr("y2", function(test2) { return test2.target.y; });
        d3.selectAll(".node")
            .attr("cx", function(test2) { return test2.x; })
            .attr("cy", function(test2) { return test2.y; });
    });

		doneRendering()
	}
};

looker.plugins.visualizations.add(visObject);
