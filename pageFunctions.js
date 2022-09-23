let scanTimer = 3000;

// const colors = ["#EA3942", "#F3D257", "#3D8A75", "#F8AB4F", "#C2D052", "#FD8322", "#FECA0A", "#9AC806", "#6958CE", "#FB0088"]; //orange, yellow, green, purple, pink;
const colors = ["#FD8322", "#FECA0A", "#9AC806", "#6958CE", "#FB0088"]; //orange, yellow, green, purple, pink;
let bar0 = 0;
let bar1 = 1;
let bar2 = 2;
let bar3 = 3;
let bar4 = 4;

function changeBarColor(bar) {
  console.log("enterfunc")
  let currentColor;
  if (bar == "#bar-0") {
    console.log("enter if")
    nextColor = colors[(bar0 + 1) % 5];
    document.querySelector('#bar-0').style.backgroundColor = nextColor;
    bar0 = (bar0 + 1) % 5;
  }

  if (bar == "#bar-1") {
    nextColor = colors[(bar1 + 1) % 5];
    document.querySelector('#bar-1').style.backgroundColor = nextColor;
    bar1 = (bar1 + 1) % 5;
  }

  if (bar == "#bar-2") {
    nextColor = colors[(bar2 + 1) % 5];
    document.querySelector('#bar-2').style.backgroundColor = nextColor;
    bar2 = (bar2 + 1) % 5;
  }

  if (bar == "#bar-3") {
    nextColor = colors[(bar3 + 1) % 5];
    document.querySelector('#bar-3').style.backgroundColor = nextColor;
    bar3 = (bar3 + 1) % 5;
  }
  if (bar == "#bar-4") {
    nextColor = colors[(bar4 + 1) % 5];
    document.querySelector('#bar-4').style.backgroundColor = nextColor;
    bar4 = (bar4 + 1) % 5;
  }
}

function activateTutorial() {
  document.querySelector('#bar-chart-view').classList.remove('offscreen');
  document.querySelector('#chart-title').classList.remove('hidden');
  document.querySelector('#chart-icons').classList.remove('hidden');

  // hide user labels
  document.querySelector('#scanned-chart-title').classList.add('hidden');
  document.querySelector('#scanned-chart-icons').classList.add('hidden');

  document.querySelector('#y-axis-labels').innerHTML = `
    <span>4</span>
    <span>3</span>
    <span>2</span>
    <span>1</span>
    <span>0</span>
  `;

  runDetection = true;
  isScan = false;
  isDIY = false;
}


function resetScanningPage() {
  document.querySelector('#scan-tip').innerHTML = "Flip the paper template, place it on the panel, and press SCAN";
  document.querySelector('#activate-scan').classList.add('hidden');
  scanTimer = 3000;
}


//STEP 1 OF THE SCANING PROCESS
function activateScanningView(chartType) {
  if (chartType == "bar") barChartActivated = true;
  if (chartType == "line") lineChartActivated = true;
  document.querySelector('#bar-chart-view').classList.add('offscreen');
  document.querySelector('#scan-view').classList.remove('offscreen');

  document.querySelector('#activate-scan').classList.remove('disabled')
  document.querySelector('#activate-scan').classList.remove('hidden');
  document.querySelector('#activate-chart').classList.add('hidden');

  runDetection = true;
  isScan = false;
}


//STEP 2 OF THE SCANNING PROCESS
function runScan() {
  isScan = true;

  document.querySelector('#scan-tip').innerHTML = "Please wait, your chart is being scanned...";

  // this is where the html should be edited
  document.querySelector('#activate-scan').classList.add('disabled');
  document.querySelector('#scan-gif-1').classList.add('hidden');
  document.querySelector('#scan-gif-2').classList.remove('hidden');
  document.querySelector('#scan-gif-3').classList.add('hidden');


  if (barChartActivated) {
    titleCtx.drawImage(Beholder.getVideo(), -180, -320, 640, 480);
    iconsCtx.drawImage(Beholder.getVideo(), -180, -115, 640, 480);
  } else {
    console.log(iconsCtxLine, titleCtxLine);
    iconsCtxLine.drawImage(Beholder.getVideo(), -180, -320, 640, 480);
    titleCtxLine.drawImage(Beholder.getVideo(), -180, -115, 640, 480);
  }
}

//STEP 3 OF THE SCANNING PROCESS
function activateDIYChart() {
  // console.log("step3")
  if (barChartActivated) {
    activateDIYBarChart();
  } else {
    acitvateDIYLineChart();
  }

  // set the scale
  document.querySelector('#y-axis-labels').innerHTML = `
    <span>100</span>
    <span>75</span>
    <span>50</span>
    <span>25</span>
    <span>0</span>
  `;

  runDetection = true;
  isDIY = true;

  resetScanningPage();
}


function activateDIYBarChart() {
  console.log('bar');
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
}

function acitvateDIYLineChart() {
  console.log('line');
  document.querySelector('#line-chart-view').classList.remove('offscreen');
  // document.querySelector('#line-chart-view').classList.remove('hidden');
  document.querySelector('#scan-view').classList.add('offscreen');

  // show user labels
  document.querySelector('#title-line').classList.remove('hidden');
  document.querySelector('#icon-line').classList.remove('hidden');

  document.querySelector('#scan-gif-1').classList.remove('hidden');
  document.querySelector('#scan-gif-2').classList.add('hidden');
  document.querySelector('#scan-gif-3').classList.add('hidden');

}

function returnHome() {
  console.log("enter");
  console.log('return home');
  barChartActivated = false;
  lineChartActivated = false;
  document.querySelector('#line-chart-view').classList.add('offscreen');
  document.querySelector('#bar-chart-view').classList.add('offscreen');
  document.querySelector('#scan-view').classList.add('offscreen');

  runDetection = true;
  isScan = false;
  isDIY = false;
}