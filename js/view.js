/**
 * @class
 * A View for a ShiViz graph. A View is responsible for drawing a single VisualGraph. It also collects transformations that 
 * generate new iterations of the model.
 * 
 * @constructor
 * @param {Graph} model
 * @param {Global} global
 * @param {String} label
 */
function View(model, global, label) {
    
    /** @private */
    this.label = label;
    
    /** @private */
    this.initialModel = model;
    
    /** @private */
    this.global = global;
    
    /** @private */
    this.transformations = [];
    
    /** @private */
    this.width = 500;
    
    /** @private */
    this.collapseSequentialNodesTransformation = new CollapseSequentialNodesTransformation(2);
    
    this.addTransformation(this.collapseSequentialNodesTransformation);
}

/**
 * Gets the Global that this view belongs to
 * 
 * @returns {Global} The global that this view belongs to
 */
View.prototype.getGlobal = function() {
    return this.global;
};

/**
 * Adds a transformation. The transformation is not applied until the draw method is invoked.
 * The difference between view.addTransformation and global.addTransformation is that the global version
 * adds applies the transformation to all views.
 * 
 * @param {Transform} transformation The new transformation
 */
View.prototype.addTransformation = function(transformation) {
    this.transformations.push(transformation);
};

/**
 * Gets the hosts as an array
 * 
 * @returns {Array<String>} The hosts
 */
View.prototype.getHosts = function() {
    return this.initialModel.getHosts();
};

/**
 * Sets the width of this view
 * 
 * @param {newWidth} The new width
 */
View.prototype.setWidth = function(newWidth) {
    this.width = newWidth;
};


/**
 * Clears the current visualization and re-draws the current model.
 */
View.prototype.draw = function() {
    // Assign a unique ID to each execution so we can distinguish
    // them
    if (this.id == null) {
        this.id = "view" + d3.selectAll("#vizContainer > svg").size();
    }

    
    var currentModel = this.initialModel.clone();
    var layout = new SpaceTimeLayout(this.width, 45);
    
    var visualGraph = new VisualGraph(currentModel, layout,
            this.global.hostColors);
    
    var transformations = this.global.getTransformations().concat(this.transformations);
    transformations.sort(function(a, b) {
        return b.priority - a.priority;
    });
    
    for ( var i = 0; i < transformations.length; i++) {
        transformations[i].transform(visualGraph);
    }


    // Define locally so that we can use in lambdas below
    var view = this;

    var svg = d3.select("#vizContainer").append("svg");

    // Remove old diagrams, but only the ones with the same ID
    // so we don't remove the other executions
    d3.selectAll("." + this.id).remove();
    

    var link = svg.selectAll(".link").data(visualGraph.getVisualEdges())
            .enter().append("line").attr("class", "link").style("stroke-width",
                    function(d) {
                        return d.getWidth();
                    });

    link.attr("x1", function(d) {
        return d.getSourceVisualNode().getX();
    }).attr("y1", function(d) {
        return d.getSourceVisualNode().getY();
    }).attr("x2", function(d) {
        return d.getTargetVisualNode().getX();
    }).attr("y2", function(d) {
        return d.getTargetVisualNode().getY();
    }).style("stroke-dasharray", function(d) {
        return d.getDashLength() + "," + d.getDashLength();
    });

    var node = svg.selectAll(".node").data(visualGraph.getVisualNodes())
            .enter().append("g").attr("transform", function(d) {
                return "translate(" + d.getX() + "," + d.getY() + ")";
            });

    node.append("title").text(function(d) {
        return d.getText();
    });
    
    node.on("click", function(e) {
        if(d3.event.ctrlKey) {
            view.collapseSequentialNodesTransformation.toggleExemption(e.getNode());
            view.global.drawAll();
        }
        else {
            selectTextareaLine($("#logField")[0], e.getLineNumber());
        }
        
    });

    var standardNodes = node.filter(function(d) {
        return !d.isStart();
    });

    standardNodes.append("circle").on("mouseover", function(e) {
        $("#curNode").text(e.getText());
    }).attr("class", "node").style("fill", function(d) {
        return d.getFillColor();
    }).attr("id", function(d) {
        return d.getHost();
    }).attr("cx", function(d) {
        return 0;
    }).attr("cy", function(d) {
        return 0;
    }).attr("r", function(d) {
        return d.getRadius();
    });

    standardNodes.append("text").attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("fill", "white")
    .attr("dy", "0.35em").text(
            function(d) {
                return d.getLabel();
            });

    svg.attr("height", visualGraph.getHeight()).attr("width", visualGraph.getWidth())
            .attr("class", this.id);

    var starts = visualGraph.getVisualNodes().filter(function(d) {
        return d.isStart();
    });
    var hostSvg = d3.select("#hostBar").append("svg");

    hostSvg.append("rect").style("stroke", "#fff").attr("width",
            visualGraph.getWidth()).attr("height", 60).attr("x", 0).attr("y", 0)
            .style("fill", "#fff");

    hostSvg.selectAll().data(starts).enter().append("rect").style("stroke",
            "#fff").attr("width", 25).attr("height", 25).attr("x", function(d) {
        return d.getX() - (25 / 2);
    }).attr("y", function(d) {
        return 15;
    }).on("mouseover", function(e) {
        $("#curNode").text(e.getText());
    }).attr("id", function(d) {
        return d.group;
    }).on("dblclick", function(e) {
        view.global.hideHost(e.getHost());
    }).attr("class", "node").style("fill", function(d) {
        return d.getFillColor();
    });

    hostSvg.attr("width", visualGraph.getWidth()).attr("height", 55).attr("class",
            this.id);
};




