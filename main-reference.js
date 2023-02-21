// add a border to a point if the point is clicked
// if the point already has a border, remove it
// update the coordinates on display
// assumes grid is a square
function onPointClick(circleElement) {
  const frame = document.getElementById('frame');
  const frameHeight = frame.height.baseVal.value;

  const coordinateDisplay = document.getElementById('coordinates');

  const gridCoordinates = getGridCoordinates(circleElement, frameHeight, 100);
  coordinateDisplay.innerHTML = `(${gridCoordinates.xCoordinate}, ${gridCoordinates.yCoordinate})`;

  // if border already exists remove it
  if (circleElement.classList.contains('border')) {
    circleElement.classList.remove('border');
    return;
  }

  circleElement.classList.add('border');
}

// translate SVG coordinates into grid coordinates
function getGridCoordinates(circleElement, height, scalar = 1) {
  const xCoordinate = circleElement.cx.baseVal.value / scalar;
  const yCoordinate = (height - circleElement.cy.baseVal.value) / scalar;

  return { xCoordinate, yCoordinate };
}

// translate grid coordinates into SVG coordinates
function getSVGCoordinates(xPosition, yPosition, height, scalar = 1) {
  const xCoordinate = xPosition * scalar;
  const yCoordinate = height - yPosition * scalar;

  return { xCoordinate, yCoordinate };
}

// add the point to the SVG visualization based on user selected input
function addPoint() {
  // retrieve the user's selected points
  const selectedXCoordinate = document.getElementById('x-coordinate');
  const selectedYCoordinate = document.getElementById('y-coordinate');

  // convert selected points from string to number
  const xCoordinate = Number(selectedXCoordinate.options[selectedXCoordinate.selectedIndex].text);
  const yCoordinate = Number(selectedYCoordinate.options[selectedYCoordinate.selectedIndex].text);

  const frame = document.getElementById('frame');
  const frameHeight = frame.height.baseVal.value;

  // get the SVG coordinates for the selected points
  const pointCoordinates = getSVGCoordinates(xCoordinate, yCoordinate, frameHeight, 100);

  // add the point to the SVG
  const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleElement.setAttribute('cx', pointCoordinates.xCoordinate);
  circleElement.setAttribute('cy', pointCoordinates.yCoordinate);
  circleElement.setAttribute('r', 25);
  circleElement.setAttribute('class', 'point');
  circleElement.setAttribute('onclick', 'onPointClick(this)');
  frame.appendChild(circleElement);
}
