/* ══════════════════════════════════════════════
   Sorting Visualizer Pro — FINAL main.js
   Dynamic Algorithm-Based Animation System
   ══════════════════════════════════════════════ */

// ── DOM REFS ────────────────────────────────────────────────────────────────
const barsEl = document.getElementById("bars");
const arrayInput = document.getElementById("arrayInput");
const algorithmSel = document.getElementById("algorithm");
const startBtn = document.getElementById("startBtn");
const generateBtn = document.getElementById("generateBtn");
const speedSlider = document.getElementById("speed");
const speedValEl = document.getElementById("speedVal");

const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");
const arrSizeEl = document.getElementById("arrSize");
const algoNameEl = document.getElementById("algoName");
const pseudoEl = document.getElementById("pseudo");
const resultEl = document.getElementById("result");

const algoInfoTitle = document.getElementById("algoInfoTitle");
const algoTimeEl = document.getElementById("algoTime");
const algoSpaceEl = document.getElementById("algoSpace");

const algoResultTitle = document.getElementById("algoResultTitle");
const algoResultTime = document.getElementById("algoResultTime");
const algoResultSpace = document.getElementById("algoResultSpace");

const minValEl = document.getElementById("minVal");
const maxValEl = document.getElementById("maxVal");
const sumValEl = document.getElementById("sumVal");
const avgValEl = document.getElementById("avgVal");

const loadingBar = document.getElementById("loadingBar");
const loadingFill = document.getElementById("loadingFill");
const checkIcon = document.getElementById("checkIcon");


// ── OPTIONAL EXTRA CONTAINERS ──────────────────────────────────────────────
const countArrayEl = document.getElementById("countArray");
const outputArrayEl = document.getElementById("outputArray");


// ── ALGORITHM META ─────────────────────────────────────────────────────────
const ALGO_META = {
  bubble: {
    name: "Bubble Sort",
    time: "O(n²) average and worst",
    space: "O(1) in-place"
  },

  selection: {
    name: "Selection Sort",
    time: "O(n²) average and worst",
    space: "O(1) in-place"
  },

  insertion: {
    name: "Insertion Sort",
    time: "O(n) best, O(n²) worst",
    space: "O(1) in-place"
  },

  merge: {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)"
  },

  quick: {
    name: "Quick Sort",
    time: "O(n log n) avg",
    space: "O(log n)"
  },

  heap: {
    name: "Heap Sort",
    time: "O(n log n)",
    space: "O(1)"
  },

  counting: {
    name: "Counting Sort",
    time: "O(n + k)",
    space: "O(n + k)"
  }
};


// ── PSEUDOCODE ─────────────────────────────────────────────────────────────
const PSEUDO = {

  bubble: [
    "for i from 0 to n-1",
    "compare adjacent elements",
    "swap if left > right",
    "largest element bubbles"
  ],

  selection: [
    "for each position",
    "find minimum element",
    "swap minimum with current",
    "mark as sorted"
  ],

  insertion: [
    "pick current key",
    "compare with previous",
    "shift larger elements",
    "insert key"
  ],

  merge: [
    "divide array recursively",
    "sort left and right",
    "compare subarrays",
    "merge sorted arrays"
  ],

  quick: [
    "choose pivot",
    "compare with pivot",
    "partition array",
    "place pivot correctly"
  ],

  heap: [
    "build max heap",
    "heapify subtree",
    "swap root with end",
    "re-heapify"
  ],

  counting: [
    "count frequencies",
    "build cumulative count",
    "place into output",
    "copy sorted array"
  ]
};


// ── STATE ──────────────────────────────────────────────────────────────────
let isSorting = false;
let comparisons = 0;
let swaps = 0;


// ── HELPERS ────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay() {
  return 10 + (101 - Number(speedSlider.value)) * 5;
}

function getArray() {

  return arrayInput.value
    .split(",")
    .map(v => parseInt(v.trim()))
    .filter(v => !isNaN(v) && v > 0);
}


// ── RENDER BARS ────────────────────────────────────────────────────────────
function renderBars(arr, step = null) {

  barsEl.innerHTML = "";

  const max = Math.max(...arr);

  const sorted =
    step?.sorted || [];

  arr.forEach((num, i) => {

    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";

    const bar = document.createElement("div");
    bar.className = "bar";

    if (sorted.includes(i)) {
      bar.classList.add("sorted");
    }

    bar.style.height =
      (max > 0
        ? ((num / max) * 340 + 40)
        : 40) + "px";

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = num;

    wrap.appendChild(bar);
    wrap.appendChild(label);

    barsEl.appendChild(wrap);
  });
}


// ── BAR CLASS HELPERS ──────────────────────────────────────────────────────
function clearBarClasses() {

  document.querySelectorAll(".bar").forEach(bar => {

    bar.classList.remove(
      "comparing",
      "swapping",
      "pivot",
      "minimum",
      "shift-right",
      "merging",
      "heapify",
      "counting",
      "placing",
      "partitioning"
    );
  });
}


function addClass(indices, className) {

  indices.forEach(i => {

    const bar =
      barsEl.children[i]
        ?.querySelector(".bar");

    if (bar) {
      bar.classList.add(className);
    }
  });
}


// ── PSEUDOCODE ─────────────────────────────────────────────────────────────
function renderPseudo(type, activeLine = -1) {

  pseudoEl.innerHTML = "";

  PSEUDO[type].forEach((text, i) => {

    const div = document.createElement("div");

    div.className =
      "line" + (i === activeLine ? " active" : "");

    div.id = "pseudo-line-" + i;

    div.textContent = text;

    pseudoEl.appendChild(div);
  });
}


function highlightPseudo(line) {

  document
    .querySelectorAll(".line")
    .forEach(l => l.classList.remove("active"));

  const el =
    document.getElementById(
      "pseudo-line-" + line
    );

  if (el) {
    el.classList.add("active");
  }
}


// ── UPDATE ALGO INFO ───────────────────────────────────────────────────────
function updateAlgoInfo(type) {

  const m = ALGO_META[type];

  algoInfoTitle.textContent = m.name;
  algoTimeEl.textContent = m.time;
  algoSpaceEl.textContent = m.space;

  algoNameEl.textContent = m.name;

  algoResultTitle.textContent =
    "Algorithm: " + m.name;

  algoResultTime.textContent = m.time;
  algoResultSpace.textContent = m.space;
}


// ── UPDATE RESULT ──────────────────────────────────────────────────────────
function updateResult(sorted, stats) {

  resultEl.innerHTML = "";

  sorted.forEach((v, i) => {

    const item =
      document.createElement("div");

    item.className = "result-item";

    item.style.animationDelay =
      (i * 40) + "ms";

    item.textContent = v;

    resultEl.appendChild(item);
  });

  minValEl.textContent = stats.min;
  maxValEl.textContent = stats.max;
  sumValEl.textContent = stats.sum;
  avgValEl.textContent = stats.avg;

  checkIcon.classList.add("done");
}


// ── LOADING ────────────────────────────────────────────────────────────────
function showLoading() {

  loadingBar.classList.remove("hidden");

  loadingFill.style.width = "0%";

  let p = 0;

  const iv = setInterval(() => {

    p = Math.min(
      p + Math.random() * 8,
      85
    );

    loadingFill.style.width =
      p + "%";

  }, 120);

  return iv;
}


function finishLoading(iv) {

  clearInterval(iv);

  loadingFill.style.width = "100%";

  setTimeout(() => {
    loadingBar.classList.add("hidden");
  }, 500);
}


// ── ANIMATION ENGINE ───────────────────────────────────────────────────────

// Compare
function animateCompare(step) {

  renderBars(step.array, step);

  addClass(step.indices, "comparing");
}


// Swap
function animateSwap(step) {

  renderBars(step.array, step);

  addClass(step.indices, "swapping");
}


// Selection Minimum
function animateMinimum(step) {

  renderBars(step.array, step);

  addClass(step.indices, "minimum");
}


// Shift
function animateShift(step) {

  renderBars(step.array, step);

  addClass(step.indices, "shift-right");
}


// Insert
function animateInsert(step) {

  renderBars(step.array, step);

  addClass(step.indices, "minimum");
}


// Pivot
function animatePivot(step) {

  renderBars(step.array, step);

  addClass(step.indices, "pivot");
}


// Partition
function animatePartition(step) {

  renderBars(step.array, step);

  addClass(step.indices, "partitioning");
}


// Merge
function animateMerge(step) {

  renderBars(step.array, step);

  addClass(step.indices, "merging");
}


// Heapify
function animateHeapify(step) {

  renderBars(step.array, step);

  addClass(step.indices, "heapify");
}


// Counting
function animateCount(step) {

    renderBars(step.array, step);

    // Highlight current value being counted
    const currentValue = step.value;

    const bars = document.querySelectorAll(".bar");

    step.array.forEach((v, i) => {

        if (v === currentValue) {
            bars[i]?.classList.add("counting");
        }
    });

    // Render counting frequency array
    if (!countArrayEl) return;

    countArrayEl.innerHTML = "";

    step.countArray.forEach((count, i) => {

        const box = document.createElement("div");

        box.className = "count-box";

        // Active frequency glow
        if (i === currentValue) {
            box.classList.add("active-count");
        }

        box.innerHTML = `
            <span>${i}</span>
            <strong>${count}</strong>
        `;

        countArrayEl.appendChild(box);
    });
}


// Placement
function animatePlace(step) {

    renderBars(step.array, step);

    if (!outputArrayEl) return;

    outputArrayEl.innerHTML = "";

    step.output.forEach((value, index) => {

        const box = document.createElement("div");

        box.className = "output-box placing-box";

        box.style.animationDelay =
            (index * 80) + "ms";

        box.textContent = value;

        outputArrayEl.appendChild(box);
    });
}


// ── MAIN SORT ──────────────────────────────────────────────────────────────
async function runSort() {

  if (isSorting) return;

  const arr = getArray();

  if (arr.length < 2) {

    alert(
      "Please enter at least 2 valid positive numbers."
    );

    return;
  }

  isSorting = true;

  startBtn.disabled = true;
  generateBtn.disabled = true;

  checkIcon.classList.remove("done");

  comparisons = 0;
  swaps = 0;

  comparisonsEl.textContent = "0";
  swapsEl.textContent = "0";
  arrSizeEl.textContent = arr.length;

  const type = algorithmSel.value;

  updateAlgoInfo(type);

  renderBars(arr);

  renderPseudo(type);

  const bear =
    document.getElementById("bear-character");

  if (bear) {

    bear.className = "bear sad";

    bear.style.left = "10px";
    bear.style.bottom = "20px";
  }

  // API CALL
  const loadIv = showLoading();

  let data;

  try {

    const res =
      await fetch("/api/sort", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          array: arr,
          algorithm: type
        })
      });

    data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

  } catch (err) {

    alert("Server error: " + err.message);

    isSorting = false;

    startBtn.disabled = false;
    generateBtn.disabled = false;

    finishLoading(loadIv);

    return;
  }

  finishLoading(loadIv);

  const {
    steps,
    sorted,
    stats
  } = data;

  // ── ANIMATION LOOP ─────────────────────────────
  for (const step of steps) {

    clearBarClasses();

    if (
      step.pseudoLine !== undefined
      && step.pseudoLine >= 0
    ) {
      highlightPseudo(step.pseudoLine);
    }

    switch (step.action) {

      case "compare":

        animateCompare(step);

        comparisons++;

        comparisonsEl.textContent =
          comparisons;

        break;

      case "swap":

        animateSwap(step);

        swaps++;

        swapsEl.textContent = swaps;

        break;

      case "select-min":

        animateMinimum(step);

        break;

      case "shift":

        animateShift(step);

        break;

      case "insert":

        animateInsert(step);

        break;

      case "pivot":

        animatePivot(step);

        break;

      case "partition":

        animatePartition(step);

        swaps++;

        swapsEl.textContent = swaps;

        break;

      case "merge":

        animateMerge(step);

        break;

      case "heapify":

        animateHeapify(step);

        break;

      case "root-swap":

        animateSwap(step);

        swaps++;

        swapsEl.textContent = swaps;

        break;

      case "count":

        animateCount(step);

        break;

      case "place":

        animatePlace(step);

        break;

      case "divide":

        renderBars(step.array, step);

        break;

      case "done":

        renderBars(step.array, {
          sorted:
            step.array.map((_, i) => i)
        });

        break;
    }

    await sleep(getDelay());
  }

  // ── FINAL RESULT ───────────────────────────────
  updateResult(sorted, stats);

  // ── TEDDY FINAL ANIMATION ─────────────────────
 
if (bear) {

  bear.className = "bear happy";

  
  const lastBar =
    barsEl.lastElementChild;

  if (lastBar) {

    const rect =
      lastBar.getBoundingClientRect();

    const parentRect =
      barsEl.getBoundingClientRect();

    
    bear.style.left =
      (rect.left - parentRect.left + 20) + "px";
  }

  bear.style.bottom = "120px";
}

  // ── CONFETTI ──────────────────────────────────
  createConfettiEffect();

  startBtn.disabled = false;
  generateBtn.disabled = false;

  isSorting = false;
}


// ── CONFETTI ───────────────────────────────────────────────────────────────
function createConfettiEffect() {

  const visualCard =
    document.querySelector(".visual-card");

  if (!visualCard) return;

  const colors = [
    "#800020",
    "#d4732a",
    "#c9a227",
    "#3a7d52",
    "#5a80cc",
    "#F4EDE4"
  ];

  for (let i = 0; i < 40; i++) {

    setTimeout(() => {

      const confetti =
        document.createElement("div");

      confetti.className = "confetti";

      confetti.style.left =
        Math.random()
        * visualCard.offsetWidth
        + "px";

      confetti.style.background =
        colors[
        Math.floor(
          Math.random() * colors.length
        )
        ];

      confetti.style.transform =
        `scale(${Math.random() * 0.6 + 0.5})`;

      visualCard.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 2500);

    }, i * 40);
  }
}


// ── RANDOM GENERATE ────────────────────────────────────────────────────────
generateBtn.addEventListener("click", () => {

  if (isSorting) return;

  const arr =
    Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 88) + 3
    );

  arrayInput.value = arr.join(",");

  renderBars(arr);

  arrSizeEl.textContent = arr.length;

  checkIcon.classList.remove("done");

  resultEl.innerHTML = "";

  minValEl.textContent = "—";
  maxValEl.textContent = "—";
  sumValEl.textContent = "—";
  avgValEl.textContent = "—";
});


// ── START BUTTON ───────────────────────────────────────────────────────────
startBtn.addEventListener("click", runSort);


// ── SPEED ──────────────────────────────────────────────────────────────────
speedSlider.addEventListener("input", () => {

  speedValEl.textContent =
    speedSlider.value + "%";
});


// ── ALGO CHANGE ────────────────────────────────────────────────────────────
algorithmSel.addEventListener("change", () => {

  if (!isSorting) {

    const type = algorithmSel.value;

    updateAlgoInfo(type);

    renderPseudo(type);
  }
});


// ── INIT ───────────────────────────────────────────────────────────────────
(function init() {

  const arr = getArray();

  renderBars(arr);

  arrSizeEl.textContent = arr.length;

  renderPseudo("bubble");

  updateAlgoInfo("bubble");

  speedValEl.textContent =
    speedSlider.value + "%";

  const s =
    arr.reduce((a, b) => a + b, 0);

  minValEl.textContent =
    Math.min(...arr);

  maxValEl.textContent =
    Math.max(...arr);

  sumValEl.textContent = s;

  avgValEl.textContent =
    (s / arr.length).toFixed(1);

})();
