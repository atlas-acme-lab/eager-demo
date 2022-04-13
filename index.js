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

const bars = [];
let updateTimer = 30; // cap updates
let prevTime = Date.now();
let runDetection = true;
let isScan = false;
let isDIY = false;
let iconsCanvas, iconsCtx, titleCanvas, titleCtx;
let iconsCanvasLine, iconsCtxLine, titleCanvasLine, titleCtxLine;

window.onload = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key == 'b') {
      document.querySelector('#beholder-root').classList.toggle('hidden');
    }

    if (e.key == 'p') {
      console.log('test');
      setBar(0, 1, 5);
      setBar(1, 2, 5);
      setBar(2, 3, 5);
      setBar(3, 4, 5);
      setBar(4, 1, 5);
    }
  });

  bars.push(document.querySelector('#bar-0'));
  bars.push(document.querySelector('#bar-1'));
  bars.push(document.querySelector('#bar-2'));
  bars.push(document.querySelector('#bar-3'));
  bars.push(document.querySelector('#bar-4'));

  bars.forEach((b) => b.addEventListener('click', () => {
    b.classList.remove('hide-num');
    hideNumTimer = 1600;
  }))

  // chartCanvas = document.querySelector('#line-chart');
  // chartCtx = chartCanvas.getContext('2d');
  console.log("before init");
  initController();
  // document.querySelector('#activate-tutorial').addEventListener('click', activateTutorial);
  // this toggle's it for now, no feedback tho
  // document.querySelector('#pause-detection').addEventListener('click', () => (runDetection = !runDetection))
  // document.querySelector('#return-home').addEventListener('click', returnHome);
  // document.querySelector('#pause-line').addEventListener('click', () => (runDetection = !runDetection))
  // document.querySelector('#return-line').addEventListener('click', returnHome);
  // document.querySelector('#activate-diy-bar').addEventListener('click', () => activateScanningView("bar"));
  // document.querySelector('#activate-diy-line').addEventListener('click', () => activateScanningView("line"));
  // document.querySelector('#activate-scan').addEventListener('click', runScan);
  // document.querySelector('#activate-chart').addEventListener('click', activateDIYChart);
  // document.querySelector('#bar-0').addEventListener('click', () => changeBarColor("#bar-0"));
  // document.querySelector('#bar-1').addEventListener('click', () => changeBarColor("#bar-1"));
  // document.querySelector('#bar-2').addEventListener('click', () => changeBarColor("#bar-2"));
  // document.querySelector('#bar-3').addEventListener('click', () => changeBarColor("#bar-3"));
  // document.querySelector('#bar-4').addEventListener('click', () => changeBarColor("#bar-4"));


  //////

  // iconsCanvasLine = document.querySelector('#icon-line');
  // iconsCtxLine = iconsCanvasLine.getContext('2d');
  //
  // titleCanvasLine = document.querySelector('#title-line');
  // titleCtxLine = titleCanvasLine.getContext('2d');


  // iconsCanvas = document.querySelector('#scanned-chart-icons');
  // iconsCtx = iconsCanvas.getContext('2d');
  //
  // titleCanvas = document.querySelector('#scanned-chart-title');
  // titleCtx = titleCanvas.getContext('2d');

}

/** TODO:
 *
 * ! Use proper marker and cam sample area values
 *
 */