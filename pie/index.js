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
        x: 0.35,
        y: 0.16
      },
      end: {
        x: 0.98,
        y: 0.85
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

let appState = 'MAIN'; //'CHART', 'SCAN'

const bars = [];
let chartCanvas;
let chartCtx;
let hideNumTimer = false;
let updateTimer = 30; // cap updates
let prevTime = Date.now();
let runDetection = true;
let isScan = false;
let isDIY = false;
let iconsCanvas, iconsCtx, titleCanvas, titleCtx;

function initController() {
  Beholder.init('#beholder-root', config);

  updateController();
}

function activateTutorial() {
  document.querySelector('#bar-chart-view').classList.remove('offscreen');
  document.querySelector('#chart-title').classList.remove('hidden');
  document.querySelector('#chart-icons').classList.remove('hidden');

  // hide user labels
  document.querySelector('#scanned-chart-title').classList.add('hidden');
  document.querySelector('#scanned-chart-icons').classList.add('hidden');

  runDetection = true;
  isScan = false;
  isDIY = false;
}

function activateDIYChart() {
  document.querySelector('#bar-chart-view').classList.remove('offscreen');
  document.querySelector('#scan-view').classList.add('offscreen');

  // show user labels
  document.querySelector('#chart-title').classList.add('hidden');
  document.querySelector('#chart-icons').classList.add('hidden');

  document.querySelector('#scanned-chart-title').classList.remove('hidden');
  document.querySelector('#scanned-chart-icons').classList.remove('hidden');

  document.querySelector('#scan-gif-1').classList.remove('hidden');
  document.querySelector('#scan-gif-2').classList.add('hidden');
  document.querySelector('#scan-gif-3').classList.add('hidden');

  runDetection = true;
  isDIY = true;
}

function runScan() {
  // console.log();
  isScan = true;
  scanTimer = 3000;

  document.querySelector('#scan-tip').innerHTML = "Please wait, your chart is being scanned...";

  // this is where the html should be edited
  document.querySelector('#activate-scan').classList.add('disabled');
  document.querySelector('#scan-gif-1').classList.add('hidden');
  document.querySelector('#scan-gif-2').classList.remove('hidden');
  document.querySelector('#scan-gif-3').classList.add('hidden');
}

function returnHome() {
  document.querySelector('#bar-chart-view').classList.add('offscreen');
  document.querySelector('#scan-view').classList.add('offscreen');

  runDetection = true;
  isScan = false;
  isDIY = false;
}

function activateDIY() {
  document.querySelector('#bar-chart-view').classList.add('offscreen');
  document.querySelector('#scan-view').classList.remove('offscreen');

  document.querySelector('#activate-scan').classList.remove('disabled')
  document.querySelector('#activate-scan').classList.remove('hidden');
  document.querySelector('#activate-chart').classList.add('hidden');

  runDetection = true;
  isScan = false;
}

window.onload = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key == 'b') {
      document.querySelector('#beholder-root').classList.toggle('hidden');
    }

    if (e.key == 'p') {
      chartRegions[0].targetValue = 2 * Math.PI * 0.25;
      chartRegions[1].targetValue = 2 * Math.PI * 0.15;
      chartRegions[2].targetValue = 2 * Math.PI * 0.45;
      chartRegions[3].targetValue = 2 * Math.PI * 0.05;
      chartRegions[4].targetValue = 2 * Math.PI * 0.10;
    }
  });

  bars.forEach((b) => b.addEventListener('click', () => {
    b.classList.remove('hide-num');
    hideNumTimer = 1600;
  }))
  chartCanvas = document.querySelector('#pie-chart');
  chartCtx = chartCanvas.getContext('2d');
  initController();
  // document.querySelector('#activate-tutorial').addEventListener('click', activateTutorial);
  // this toggle's it for now, no feedback tho
  // document.querySelector('#pause-detection').addEventListener('click', () => (runDetection = !runDetection))
  // document.querySelector('#return-home').addEventListener('click', returnHome);
  // document.querySelector('#activate-diy-bar').addEventListener('click', activateDIY);
  // document.querySelector('#activate-scan').addEventListener('click', runScan);
  // document.querySelector('#activate-chart').addEventListener('click', activateDIYChart);


}