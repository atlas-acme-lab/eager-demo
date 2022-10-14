const UPDATE_WINDOW = 1000 / 20;
let beholderUpdateTimer = UPDATE_WINDOW;
let hideNumTimer = false;
let barChartActivated = false;
let lineChartActivated = false;

const referenceMarkerBot = 16;
const referenceMarkerTop = 17;
const lineMarkerMap = [0, 1, 2, 3, 4];
const maxVH = 243;

const markerMoveThreshold = 1.5;
// TODO: init these to be y min
//Sandra's comment: idk why they are here
const markerMap = [0, 1, 2, 3, 4];
const markerPositions = [0, 0, 0, 0, 0];
const markerOrigins = [0, 0, 0, 0, 0];
let markerYMax = 0;

let chartCanvas;
let chartCtx;

const Beholder = window['beholder-detection'].default;
let config = {
  camera_params: {
    videoSize: 1, // The video size values map to the following [320 x 240, 640 x 480, 1280 x 720, 1920 x 1080]
    rearCamera: true, // Boolean value for defaulting to the rear facing camera. Only works on mobile
    torch: true, // Boolean value for if torch/flashlight is on. Only works for rear facing mobile cameras. Can only be set from init
  },
  detection_params: {
    minMarkerDistance: 2,
    minMarkerPerimeter: 0.01,
    maxMarkerPerimeter: 1,
    sizeAfterPerspectiveRemoval: 49,
    area: {
      start: {
        x: 0.32,
        y: 0.28
      },
      end: {
        x: 0.92,
        y: 0.90
      },
    },
  },
  feed_params: {
    contrast: 0,
    brightness: 0,
    grayscale: 0,
    flip: false,
  },
  overlay_params: {
    present: true, // Determines if the Beholder overlay will display or be invisible entirely via display: none
    hide: true, // Determines if the overlay should be hidden on the left of the screen or visible
  },
};


console.log("top of beholder");
console.warn("FOR DEVS: Beholder is initialized to use rear camera, this will cause error on desktop because that doesn't exist")

let chartRegions = [{
    value: 0.2,
    targetValue: 1,
    color: '#FA008F'
  },
  {
    value: 0.2,
    targetValue: 0.5,
    color: '#FCCE2E'
  },
  {
    value: 0.2,
    targetValue: 0.1,
    color: '#9FCB27'
  },
  {
    value: 0.2,
    targetValue: 0.3,
    color: '#7361CE'
  },
  {
    value: 0.2,
    targetValue: 0.7,
    color: '#FB8C36'
  },
];


function setBar(id, val, max) {
  bars[id].style.height = `${maxVH * val / max}px`;
  // bars[id].style = `height:${maxVH * val / max}px`;
  bars[id].querySelector('.bar-val').innerHTML = val;

  bars[id].classList.remove('hide-num');
  hideNumTimer = 1600;
}

function clamp(min, max, v) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}


function lerp(a, b, v) {
  return a + (b - a) * v;
}

let prevTime = 0;
function updateController() {
  // console.log("updateController");
  let currTime = Date.now();
  let dt = currTime - prevTime;
  prevTime = currTime;

  requestAnimationFrame(updateController);

  // update
  beholderUpdateTimer -= dt;
  if (beholderUpdateTimer < 0) {
    Beholder.update();
    beholderUpdateTimer = UPDATE_WINDOW;
  }

  let topRef = Beholder.getMarker(referenceMarkerTop).center.y;
  let botRef = Beholder.getMarker(referenceMarkerBot).center.y;
  // console.log(topRef, botRef);
  let markerRange = topRef - botRef;
  for (let i = 0; i < 5; i++) {
    let currMarker = Beholder.getMarker(markerMap[i]);

    let newOffset = currMarker.center.y - botRef;
    // console.log(newOffset);
    if (Math.abs(newOffset - markerPositions[i]) > markerMoveThreshold) {
      markerPositions[i] = newOffset;

      let sliderVal = newOffset / markerRange;

      // do marker mapping here
      chartRegions[i].targetValue = sliderVal;
    }
  }


  // draw
  chartCtx.clearRect(0,0,chartCanvas.width, chartCanvas.height);

  let barMax = chartCanvas.height * 0.5;
  chartCtx.fillStyle = 'black';
  // x-axis
  chartCtx.fillRect(
    chartCanvas.width * 0.2, chartCanvas.height * 0.8,
    chartCanvas.width * 0.58, 10,
  );
  // y-axis
  // use barMax
  chartCtx.fillRect(
    chartCanvas.width * 0.2 - 9, chartCanvas.height * 0.8 + 10,
    10, -barMax - 10,
  );

  let numTicks = 5;
  for (let i = 1; i <=numTicks; i++) {
    chartCtx.fillRect(
      chartCanvas.width * 0.2, chartCanvas.height * 0.8 - barMax * (i/numTicks),
      -20, 5,
    );

    chartCtx.font = '20px monospace';
    chartCtx.fillText(i, chartCanvas.width * 0.2 - 40, chartCanvas.height * 0.8 - barMax * (i/numTicks) + 8);
  }


  // chartCtx.fillRect(0,0, 100, 100);
  // console.log('eh');
  chartRegions.forEach((c, i) => {
    c.value = lerp(c.value, c.targetValue, 0.06);
    chartCtx.fillStyle = c.color;
    chartCtx.fillRect(
      chartCanvas.width * 0.23 + i * chartCanvas.width * 0.12, chartCanvas.height * 0.8,
      30, -c.value * barMax
    );
  });
  
  return;

  if (runDetection) {
    beholderUpdateTimer -= dt;
    if (beholderUpdateTimer < 0) {
      Beholder.update();
      beholderUpdateTimer = UPDATE_WINDOW;
    }
    // console.log(Beholder.getMarker(5).center.y - markerOrigins[4]);
    let topRef = Beholder.getMarker(referenceMarkerTop).center.y;
    let botRef = Beholder.getMarker(referenceMarkerBot).center.y;
    // console.log(topRef, botRef);
    let markerRange = topRef - botRef;
    for (let i = 0; i < 5; i++) {
      let currMarker = Beholder.getMarker(markerMap[i]);

      let newOffset = currMarker.center.y - botRef;
      // console.log(newOffset);
      if (Math.abs(newOffset - markerPositions[i]) > markerMoveThreshold) {
        markerPositions[i] = newOffset;

        let sliderVal = newOffset / markerRange;

        // do marker mapping here
        if (isDIY) setBar(i, Math.round(10 * sliderVal) * 10, 100);
        else if (IS_SCAN) setBar(i, Math.round(5 * sliderVal), 5);
        else setBar(i, Math.round(4 * sliderVal), 4);
      }
    }
    // }
  }
}


function initController() {
  Beholder.init('#beholder-root', config);
  chartCanvas = document.querySelector('#bar-canvas');
  chartCanvas.height = 0.98 * window.innerHeight;
  chartCanvas.width = 0.80 * window.innerWidth;

  chartCtx = chartCanvas.getContext('2d');
  updateController();
}

window.onload = initController;
