const markerMoveThreshold = 1;
// TODO: init these to be y min
const markerMap = [8,7,0,2,1];
const markerPositions = [0,0,0,0,0];
const markerOrigins = [0,0,0,0,0];
let markerYMax = 0;

let barWidth = 50;

let chartRegions = [
    { value: 0, targetValue: 0.2, fill: '#1555A0' },
    { value: 0, targetValue: 0.2, fill: '#B3CFF0' },
    { value: 0, targetValue: 0.2, fill: '#80B2EC' },
    { value: 0, targetValue: 0.2, fill: '#5D97DB' },
    { value: 0, targetValue: 0.2, fill: '#4283CE' },
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

    // this does the thing we need with markers
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
        chartRegions[i].targetValue = sliderVal;
        // if (isDIY) setBar(i, Math.round(10 * sliderVal) * 10, 100);
        // else setBar(i, Math.round(4 * sliderVal), 4);
      }

      // center slider should be at top to calibrate
      if (markerOrigins[2] == 0 && markerOrigins[1] != 0 && markerOrigins[3] != 0) {
        markerOrigins[2] = (markerOrigins[1] + markerOrigins[3]) / 2;
      }
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

  chartCtx.fillStyle = '#000';
  chartCtx.strokeStyle = '#000';
  let lineOffset = chartCanvas.width/6;
  chartRegions.forEach((c) => {
      chartCtx.save();
      c.value = lerp(c.value, c.targetValue, 0.05);
      let barHeight = (chartCanvas.height * 6/7 * c.value);

      chartCtx.translate(lineOffset, chartCanvas.height);
      chartCtx.fillStyle = c.fill;
      chartCtx.fillRect(-barWidth / 2,-barHeight, barWidth, barHeight);

      lineOffset += chartCanvas.width / 6;
      chartCtx.restore();
  });


  chartCtx.stroke();
}

// Aside from hiding/showing elements, THIS IS ALL YOU NEED FOR SCAN
// The problem is we don't have an means to ensure things line up properly
// and you do not know the marker position relative to this... you would have to figure out that offset manually... or i'd have to change beholder
// 
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// iconsCtx.drawImage(Beholder.getVideo(), -300, -192, 640, 480);
// titleCtx.drawImage(Beholder.getVideo(), -310, -398, 640, 480);


// what to walk through

// the code
// beholder
// how to deploy
