
const markerMoveThreshold = 1.5;
// TODO: init these to be y min
const markerMap = [9,8,7,6,5];
const markerPositions = [0,0,0,0,0];
const markerOrigins = [0,0,0,0,0];
let markerYMax = 0;


let chartRegions = [
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#FB8C36' }, // orange
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#FCCE2E' }, // yellow
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#9FCB27' }, // green
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#7361CE' }, // purple
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#FA008F' }, // pink
]

function clamp(min, max, v) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

let scanTimer = 3000;
const UPDATE_WINDOW = 1000 / 10;
let beholderUpdateTimer = UPDATE_WINDOW;
function updateController() {
  let currTime = Date.now();
  let dt = currTime - prevTime;
  prevTime = currTime;

  if (runDetection) {
    beholderUpdateTimer -= dt;
    if (beholderUpdateTimer < 0) {
      Beholder.update();
      beholderUpdateTimer = UPDATE_WINDOW;
    
      let centerMarker = Beholder.getMarker(15);
      if (centerMarker.present) {
        for (let i = 1; i < 6; i++) {
          let currMarker = Beholder.getMarker(markerMap[i - 1]);
          let nextMarker = Beholder.getMarker(markerMap[(i) % 5]);

          let currVec = currMarker.center.clone().sub(centerMarker.center);
          let nextVec = nextMarker.center.clone().sub(centerMarker.center);
          // console.log(currVec.angleBetween(nextVec));
          chartRegions[i % 5].targetValue = currVec.angleBetween(nextVec);
          // console.log()
        }
      }
    }
  }

  updateChart(dt);
  requestAnimationFrame(updateController);
}

function lerp(a, b, v) {
    return a + (b - a) * v;
}

function drawArc(c, arcTotal) {
  c.value = lerp(c.value, c.targetValue, 0.9);
  chartCtx.fillStyle = c.fill;
  chartCtx.beginPath();
  chartCtx.moveTo(0,0);
  chartCtx.arc(0, 0, 130, arcTotal, arcTotal + c.value);
  chartCtx.lineTo(0,0);
  chartCtx.fill();
  
  chartCtx.textAlign = 'center';
  chartCtx.fillStyle = "black";
  chartCtx.fillText(`${Math.round(100 * c.targetValue / Math.PI / 2)}%`, 150 * Math.cos(arcTotal + c.value / 2), 150 * Math.sin(arcTotal + c.value / 2) + 10);
}

function updateChart(dt) {
    // render
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    chartCtx.save();
    chartCtx.translate(chartCanvas.width/2, chartCanvas.height/2);

    chartCtx.font = "20px Patrick Hand";
    let arcTotal = 0;
    // let arcTotal = Beholder.getMarker(markerMap[4]).center.getAngle();

    // move these around to draw things in the right order k, and I can set offset up there
    drawArc(chartRegions[0], arcTotal);
    arcTotal += chartRegions[0].value;

    drawArc(chartRegions[1], arcTotal);
    arcTotal += chartRegions[1].value;

    drawArc(chartRegions[2], arcTotal);
    arcTotal += chartRegions[2].value;

    drawArc(chartRegions[3], arcTotal);
    arcTotal += chartRegions[3].value;

    drawArc(chartRegions[4], arcTotal);
    arcTotal += chartRegions[4].value;

    chartCtx.restore();
}

// to do
// map markers properly
// do floating numbers :|