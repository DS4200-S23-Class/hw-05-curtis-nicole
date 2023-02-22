const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

async function buildScatterPlot() {
  const data = await d3.csv('data/scatter-data.csv');

  const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
  const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

  const FRAME = d3
    .select('#vis1')
    .append('svg')
    .attr('id', 'frame')
    .attr('height', FRAME_HEIGHT)
    .attr('width', FRAME_WIDTH)
    .attr('class', 'frame');

  // find max X
  const MAX_X = d3.max(data, (d) => Number(d.x));

  const X_SCALE = d3
    .scaleLinear() // linear scale because we have
    // linear data
    .domain([0, MAX_X + 1]) // add some padding
    .range([0, VIS_WIDTH]);

  const MAX_Y = d3.max(data, (d) => Number(d.y));

  const Y_SCALE = d3
    .scaleLinear() // linear scale because we have
    // linear data
    .domain([0, MAX_Y + 1]) // add some padding
    .range([VIS_HEIGHT, 0]);

  FRAME.selectAll('points')
    .data(data)
    .enter()
    .append('circle')
    .attr('id', (d) => `(${d.x}, ${d.y})`)
    .attr('cx', (d) => X_SCALE(d.x) + MARGINS.left)
    .attr('cy', (d) => Y_SCALE(d.y) + MARGINS.top)
    .attr('r', 20)
    .attr('class', 'point')
    .attr('onclick', 'onPointClick(this)');

  FRAME.append('g') // g is a "placeholder" svg
    .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
    .call(d3.axisBottom(X_SCALE).ticks(4))
    .attr('font-size', '20px');

  FRAME.append('g')
    .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
    .call(d3.axisLeft(Y_SCALE).ticks(4))
    .attr('font-size', '20px');

  document.getElementById('add-point').addEventListener('click', () => addPoint(X_SCALE, Y_SCALE));
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

  coordinateDisplay.innerHTML = circleElement.id;

  // if border already exists remove it
  if (circleElement.classList.contains('border')) {
    circleElement.classList.remove('border');
    return;
  }

  circleElement.classList.add('border');
}

// add the point to the SVG visualization based on user selected input
function addPoint(X_SCALE, Y_SCALE) {
  // retrieve the user's selected points
  const selectedXCoordinate = document.getElementById('x-coordinate');
  const selectedYCoordinate = document.getElementById('y-coordinate');

  // convert selected points from string to number
  const xCoordinate = Number(selectedXCoordinate.options[selectedXCoordinate.selectedIndex].text);
  const yCoordinate = Number(selectedYCoordinate.options[selectedYCoordinate.selectedIndex].text);

  // add the point to the SVG
  const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleElement.setAttribute('id', `(${xCoordinate}, ${yCoordinate})`);
  circleElement.setAttribute('cx', X_SCALE(xCoordinate) + MARGINS.left);
  circleElement.setAttribute('cy', Y_SCALE(yCoordinate) + MARGINS.top);
  circleElement.setAttribute('r', 20);
  circleElement.setAttribute('class', 'point');
  circleElement.setAttribute('onclick', 'onPointClick(this)');

  const frame = document.getElementById('frame');
  frame.appendChild(circleElement);
}

async function buildBarChart() {
  const dataBar = await d3.csv('data/bar-data.csv');
  console.log(dataBar);

  const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
  const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

  const FRAME = d3
    .select('#vis2')
    .append('svg')
    .attr('id', 'frame')
    .attr('height', FRAME_HEIGHT)
    .attr('width', FRAME_WIDTH)
    .attr('class', 'frame');

  const X_SCALE = d3
    .scaleBand()
    .padding(0.2)
    .domain(dataBar.map((d) => d.category)) // add some padding
    .range([0, VIS_WIDTH]);

  const MAX_Y = d3.max(dataBar, (d) => Number(d.amount));
  console.log(MAX_Y);

  const Y_SCALE = d3
    .scaleLinear()
    // linear data
    .domain([0, MAX_Y]) // add some padding
    .range([VIS_HEIGHT, 0]);

  FRAME.selectAll('.bar')
    .data(dataBar)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('id', (d) => `${d.category}: ${d.amount}`)
    .attr('x', (d) => X_SCALE(d.category) + MARGINS.left)
    .attr('y', (d) => Y_SCALE(d.amount) + MARGINS.top)
    .attr('width', X_SCALE.bandwidth())
    .attr('height', (d) => VIS_HEIGHT - Y_SCALE(d.amount));

  FRAME.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
    .call(d3.axisBottom(X_SCALE));

  FRAME.append('g')
    .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
    .call(d3.axisLeft(Y_SCALE).ticks(4));

  // Define the div for the tooltip
  const tooltip = d3.select('#vis2').append('div').attr('class', 'tooltip').style('opacity', 0);

  function barChartMousemove(event, d) {
    tooltip
      .html('Item Category: ' + d.category + '<br>' + 'Category Amount: ' + d.amount)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 50 + 'px');
  }

  FRAME.selectAll('.bar')
    .on('mouseover', (event, d) => tooltip.style('opacity', 1))
    .on('mousemove', barChartMousemove)
    .on('mouseleave', (event, d) => tooltip.style('opacity', 0));
}

buildScatterPlot();
buildBarChart();
