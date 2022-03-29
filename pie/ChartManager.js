
const markerMoveThreshold = 1.5;
// TODO: init these to be y min
const markerMap = [8,7,0,2,1];
const markerPositions = [0,0,0,0,0];
const markerOrigins = [0,0,0,0,0];
let markerYMax = 0;

let chartRegions = [
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#1555A0' },
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#B3CFF0' },
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#80B2EC' },
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#5D97DB' },
    { value: 0, targetValue: 2 * Math.PI * 0.2, fill: '#4283CE' },
]

function clamp(min, max, v) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

let scanTimer = 3000;
const UPDATE_WINDOW = 1000 / 20;
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
    }
    // console.log(Beholder.getMarker(5).center.y - markerOrigins[4]);

    for (let i = 0; i < 5; i++) {
      let currMarker = Beholder.getMarker(markerMap[i]);
      // capture origin
      if (markerOrigins[i] === 0 && currMarker.center.i != 0 && i != 2) {
        markerOrigins[i] = currMarker.center.y;
      }

      if (i === 2 && markerYMax === 0 && currMarker.center.y !== 0) {
        markerYMax = currMarker.center.y;
      }

      let newOffset = currMarker.center.y - markerOrigins[i];
      if (Math.abs(newOffset - markerPositions[i]) > markerMoveThreshold) {
        markerPositions[i] = newOffset;
        let sliderVal = newOffset / (markerYMax - markerOrigins[i]);
      
        // do marker mapping here
        if (isDIY) setBar(i, Math.round(10 * sliderVal) * 10, 100);
        else setBar(i, Math.round(4 * sliderVal), 4);
      }

      // center slider should be at top to calibrate
      if (markerOrigins[2] == 0 && markerOrigins[1] != 0 && markerOrigins[3] != 0) {
        markerOrigins[2] = (markerOrigins[1] + markerOrigins[3]) / 2;
      }
    }
  }

  if (!isScan && hideNumTimer < 0) bars.forEach((b) => b.classList.add('hide-num'));
  else hideNumTimer -= dt;

  if (isScan) {
    // idk if anything happens here
    scanTimer -= dt;

    if (scanTimer < 0) {
      isScan = false;
      document.querySelector('#activate-scan').classList.add('hidden');
      document.querySelector('#activate-chart').classList.remove('hidden');
      document.querySelector('#scan-gif-1').classList.add('hidden');
      document.querySelector('#scan-gif-2').classList.add('hidden');
      document.querySelector('#scan-gif-3').classList.remove('hidden');

      document.querySelector('#scan-tip').innerHTML = "Scanning Complete! Flip the template again, and press START.";
    }
  }

  updateChart(dt);
  requestAnimationFrame(updateController);
}

function lerp(a, b, v) {
    return a + (b - a) * v;
}

function updateChart(dt) {


    // render
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    chartCtx.save();
    chartCtx.translate(chartCanvas.width/2, chartCanvas.height/2);

    let arcTotal = 0;
    chartRegions.forEach((c) => {
        c.value = lerp(c.value, c.targetValue, 0.05);

        chartCtx.fillStyle = c.fill;
        chartCtx.beginPath();
        chartCtx.moveTo(0,0);
        chartCtx.arc(0, 0, 140, arcTotal, arcTotal + c.value);
        chartCtx.lineTo(0,0);
        chartCtx.fill();

        arcTotal += c.value;
    });

    chartCtx.restore();
}