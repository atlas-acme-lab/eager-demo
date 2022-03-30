const UPDATE_WINDOW = 1000 / 20;
let beholderUpdateTimer = UPDATE_WINDOW;
let hideNumTimer = false;
let barChartActivated = false;
let lineChartActivated = false;

const referenceMarkerBot = 16;
const referenceMarkerTop = 17;
const lineMarkerMap = [0, 1, 2, 3, 4];
const maxVH = 258;

const markerMoveThreshold = 1.5;
// TODO: init these to be y min
//Sandra's comment: idk why they are here
const markerMap = [0, 1, 2, 3, 4];
const markerPositions = [0, 0, 0, 0, 0];
const markerOrigins = [0, 0, 0, 0, 0];
let markerYMax = 0;

let chartCanvas;
let chartCtx;

// console.log("top of beholder");

let chartRegions = [{
    value: 0,
    targetValue: 0.2
  },
  {
    value: 0,
    targetValue: 0.2
  },
  {
    value: 0,
    targetValue: 0.2
  },
  {
    value: 0,
    targetValue: 0.2
  },
  {
    value: 0,
    targetValue: 0.2
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


function updateController() {
  // console.log("updateController");
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
        else setBar(i, Math.round(4 * sliderVal), 4);
      }
    }
    // }
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

  requestAnimationFrame(updateController);

}


function initController() {
  // console.log("nside initi");
  Beholder.init('#beholder-root', config);
  updateController();
  // console.log("after iniit");
}