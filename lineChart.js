// const markerMoveThreshold = 1;
// TODO: init these to be y min
const referenceMarkerBot = 16;
const referenceMarkerTop = 17;
const lineMarkerMap = [8, 7, 0, 2, 1];
const maxVH = 180;

const markerMoveThreshold = 1.5;
// TODO: init these to be y min
//Sandra's comment: idk why they are here
const markerMap = [8, 7, 0, 2, 1];
const markerPositions = [0, 0, 0, 0, 0];
const markerOrigins = [0, 0, 0, 0, 0];
let markerYMax = 0;


let lineRegions = [{
    value: 0,
    targetValue: 0.2,
    fill: '#1555A0'
  },
  {
    value: 0,
    targetValue: 0.2,
    fill: '#B3CFF0'
  },
  {
    value: 0,
    targetValue: 0.2,
    fill: '#80B2EC'
  },
  {
    value: 0,
    targetValue: 0.2,
    fill: '#5D97DB'
  },
  {
    value: 0,
    targetValue: 0.2,
    fill: '#4283CE'
  },
];


function lineUpdateController(dt) {
  let topRef = Beholder.getMarker(referenceMarkerTop).center.y;
  let botRef = Beholder.getMarker(referenceMarkerBot).center.y;
  let markerRange = topRef - botRef;
  for (let i = 0; i < 5; i++) {
    let currMarker = Beholder.getMarker(lineMarkerMap[i]);

    let newOffset = currMarker.center.y - botRef;
    let sliderVal = newOffset / markerRange;

    // do marker mapping here
    lineRegions[i].targetValue = sliderVal;
  }
  lineUpdateChart(dt);
}

function lerp(a, b, v) {
  return a + (b - a) * v;
}

function lineUpdateChart(dt) {
  // render canvas
  console.log("hello");
  chartCtx.clearRect(0, 0, 20, chartCanvas.height);
  chartCtx.fillStyle = '#000';
  chartCtx.strokeStyle = '#000';
  let lineOffset = chartCanvas.width / 15;
  // console.log(lineOffset);

  //creating the dots within the linechart
  lineRegions.forEach((c) => {
    chartCtx.save();
    c.value = lerp(c.value, c.targetValue, 0.5);
    // console.log(c.value); //0.19999999999977042

    chartCtx.translate(
      lineOffset,
      chartCanvas.height - (chartCanvas.height * 0.3333 * c.value)
      // chartCanvas.height - 18
    );

    chartCtx.beginPath();
    chartCtx.arc(0, 0, 10, 0, 2 * Math.PI); //x, y, radius
    chartCtx.fill();

    lineOffset += chartCanvas.width / 4.5;
    chartCtx.restore();
  });

  lineOffset = chartCanvas.width / 4.5;
  chartCtx.beginPath();

  // chartCtx.moveTo(0, 50)
  chartCtx.moveTo(
    // lineOffset,
    20,
    chartCanvas.height - (chartCanvas.height * 0.333 * lineRegions[0].value)
  );


  //creating the lines within the line chart
  chartCtx.lineWidth = 5;
  lineRegions.forEach((c) => {
    c.value = lerp(c.value, c.targetValue, 0.05);

    // chartCtx.lineTo(400, 0);
    chartCtx.lineTo(
      lineOffset,
      chartCanvas.height - (chartCanvas.height * 0.333 * c.value)
    );

    lineOffset += chartCanvas.width / 4.5;
  });

  chartCtx.stroke();
}