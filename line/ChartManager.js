const markerMoveThreshold = 1;
// TODO: init these to be y min
const lineMarkerMap = [0, 1, 2, 3, 4];
const markerPositions = [0, 0, 0, 0, 0];
const markerOrigins = [0, 0, 0, 0, 0];
let markerYMax = 0;
const referenceMarkerBot = 16;
const referenceMarkerTop = 17;
let sliderVal = 0;

let chartRegions = [{
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
    let topRef = Beholder.getMarker(referenceMarkerTop).center.y;
    let botRef = Beholder.getMarker(referenceMarkerBot).center.y;
    let markerRange = topRef - botRef;
    for (let i = 0; i < 5; i++) {
      let currMarker = Beholder.getMarker(lineMarkerMap[i]);

      let newOffset = currMarker.center.y - botRef;

      if (markerRange != 0) {
        sliderVal = newOffset / markerRange;
      }


      // do marker mapping here
      chartRegions[i].targetValue = sliderVal;
      // console.log(newOffset, markerRange);
      // if (isDIY) setBar(i, Math.round(10 * sliderVal) * 10, 100);
      // else setBar(i, Math.round(4 * sliderVal), 4);
    }

    // // center slider should be at top to calibrate
    // if (markerOrigins[2] == 0 && markerOrigins[1] != 0 && markerOrigins[3] != 0) {
    //   markerOrigins[2] = (markerOrigins[1] + markerOrigins[3]) / 2;
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
  // render canvas
  // console.log("hello");
  chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  chartCtx.fillStyle = '#000';
  chartCtx.strokeStyle = '#000';
  let lineOffset = chartCanvas.width / 18; //controls the horizontal movement
  // console.log(lineOffset);

  //creating the dots within the linechart
  chartRegions.forEach((c) => {
    // console.log(c);
    chartCtx.save();
    c.value = c.targetValue;
    // c.value = lerp(c.value, c.targetValue, 0.5);
    // console.log(c.value); //0.19999999999977042
    let pointHeight = (0.94 - c.value) * chartCanvas.height;
    // console.log(c.value);

    chartCtx.translate(
      lineOffset,
      // chartCanvas.height - (chartCanvas.height * 6 / 7 * c.value)
      // (pointHeight > x) ? maxValue : pointHeight;

      clamp(-0.5, 0.94 * chartCanvas.height, pointHeight)

    );

    chartCtx.beginPath();
    chartCtx.arc(0, 0, 10, 0, 2 * Math.PI); //x, y, radius
    chartCtx.fill();

    lineOffset += chartCanvas.width / (9 / 2);
    chartCtx.restore();
  });

  lineOffset = chartCanvas.width / 18;
  chartCtx.beginPath();

  // chartCtx.moveTo(0, 50)
  // chartCtx.moveTo(
  //   lineOffset,
  //   // 20,
  //   chartCanvas.height - (chartCanvas.height * 6 / 7 * chartRegions[0].value)
  // );


  //creating the lines within the line chart
  chartCtx.lineWidth = 5;
  chartRegions.forEach((c) => {
    c.value = c.targetValue;
    // c.value = lerp(c.value, c.targetValue, 0.5);

    // chartCtx.lineTo(400, 0);
    chartCtx.lineTo(
      lineOffset,
      (0.94 - c.value) * chartCanvas.height
      // chartCanvas.height - (chartCanvas.height * 6 / 7 * c.value)
    );

    lineOffset += chartCanvas.width / (9 / 2);
  });

  chartCtx.stroke();
}