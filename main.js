const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

async function buildScatterPlot() {
    const data = await d3.csv("data/scatter-data.csv")
    console.log(data)

    const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
    const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

    const FRAME = d3.select("#vis1")
        .append("svg")
        .attr("height", FRAME_HEIGHT)
        .attr("width", FRAME_WIDTH)
        .attr("class", "frame");


    // find max X
    const MAX_X = d3.max(data, (d) => Number(d.x));
    console.log("Max x: " + MAX_X);

    const X_SCALE = d3.scaleLinear() // linear scale because we have 
        // linear data 
        .domain([0, (MAX_X + 1)]) // add some padding  
        .range([0, VIS_WIDTH]);

    console.log("Input: 4, X_SCALE output: " + X_SCALE(4));

    const MAX_Y = d3.max(data, (d) => Number(d.y));
    console.log("Max y: " + MAX_Y);

    const Y_SCALE = d3.scaleLinear() // linear scale because we have 
        // linear data 
        .domain([0, (MAX_Y + 1)]) // add some padding  
        .range([VIS_HEIGHT, 0]);

    console.log("Input: 4, Y_SCALE output: " + Y_SCALE(4));

    FRAME.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => (X_SCALE(d.x) + MARGINS.left))
        .attr("cy", (d) => (Y_SCALE(d.y) + MARGINS.top))
        .attr("r", 20)
        .attr("class", "point")
        .attr('onclick', 'onPointClick(this)');


    FRAME.append("g") // g is a "placeholder" svg
        .attr("transform", "translate(" + MARGINS.left +
            "," + (VIS_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(4))
        .attr("font-size", '20px');

    FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.top +
            "," + MARGINS.left + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(4))
        .attr("font-size", '20px');
}

// translate SVG coordinates into grid coordinates
function getGridCoordinates(circleElement, height, scalar = 1) {
    const xCoordinate = circleElement.cx.baseVal.value / scalar;
    const yCoordinate = (height - circleElement.cy.baseVal.value) / scalar;

    return { xCoordinate, yCoordinate };
}

// add a border to a point if the point is clicked
// if the point already has a border, remove it
// update the coordinates on display
// assumes grid is a square
function onPointClick(circleElement) {
    const coordinateDisplay = document.getElementById('coordinates');

    const gridCoordinates = getGridCoordinates(circleElement, FRAME_HEIGHT, 100);
    coordinateDisplay.innerHTML = `(${gridCoordinates.xCoordinate}, ${gridCoordinates.yCoordinate})`;

    // if border already exists remove it
    if (circleElement.classList.contains('border')) {
        circleElement.classList.remove('border');
        return;
    }

    circleElement.classList.add('border');
}

buildScatterPlot()




