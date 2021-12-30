// An example walkthrough
// the steps in the initialTutorialOptions are used to create an example walkthrough when clicked to the "Learn How to Use ShiViz" button.
var initialTutorialOptions = new Tour({
    orphan:true,
    steps: [{
        content: "Welcome to the Interactive ShiViz Tutorial!",
    }, 
    {
        content: "Each time you follow an instructrion, click the Next button.",
    }, 
    {
        element: document.querySelector('.try'),
        content: "Click here to start using Shiviz!"
    },
    {
        content: "Now, let's choose an example log.",
        element: document.querySelectorAll('a.log-link')[10]
    },
    {
        content: "Here, you can see the log parsing regular expression",
        element: document.querySelector("#parser")
    },
    {
        content: "Here, you can see the multiple executions regular expression delimiter",
        element: document.querySelector("#delimiter")
    },
    {
        content: "Now, let's visualize the log!",
        element: document.querySelector("#visualize"),
    },
    {
        content: "In the visualization time flows from top to bottom.",
    },
    {
        content: "The left panel shows the log and the middle panel displays a DAG of the partially ordered vector timestamps recorded in the input log.",
    },
    {
        content: "Here, you can switch between different executions.",
        element: "",
        // uses onShow to modift the element as the selector does not exist before the visualization
        onShow: (t) => {
            t._options.steps[9].element = "select#viewSelectL"
        }
    },
    {
        content: "Click Clusters Tab",
        element: document.querySelector("#clusters")

    },
    {
        content: "Here, you can separate executions into different groups based on a chosen metric.",
        element: document.querySelector("div#tabs")
    },
    {
        content: "Cluster by the number of processes to group executions by the midpoint between the smallest and largest number of processes",
        element: document.querySelector("#clusterNumProcessLabel")
    },
    {
        content: "Cluster by execution comparison to see an overview of how executions differ from a selected base.",
        element: document.querySelector("#clusterComparisonLabel")
    }
]
});


initialTutorialOptions.init();

$(".demo").on("click", function() {
    initialTutorialOptions.start(true);
    initialTutorialOptions.goTo(0);
});