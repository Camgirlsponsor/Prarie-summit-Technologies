// Prairie Summit Technologies — solo block-odds calculator (prototype)

(function () {
  var TWO_32 = Math.pow(2, 32);
  var DAY = 86400;
  var WINDOWS = [
    { id: "1h", label: "1 hour", seconds: 3600 },
    { id: "1d", label: "24 hours", seconds: DAY },
    { id: "7d", label: "7 days", seconds: 7 * DAY },
    { id: "30d", label: "30 days", seconds: 30 * DAY },
    { id: "1y", label: "1 year", seconds: 365.25 * DAY }
  ];

  var UNIT = {
    H: 1,
    KH: 1e3,
    MH: 1e6,
    GH: 1e9,
    TH: 1e12,
    PH: 1e15,
    EH: 1e18
  };

  var COINS = [
    {
      id: "btc",
      ticker: "BTC",
      name: "Bitcoin",
      algo: "SHA-256d",
      algoGroup: "sha256",
      blockTime: 600,
      subsidy: 3.125,
      fallback: {
        difficulty: 127450789715843.1,
        hashrate: 929146353241798600000
      },
      fetch: fetchBtc
    },
    {
      id: "bch",
      ticker: "BCH",
      name: "Bitcoin Cash",
      algo: "SHA-256d",
      algoGroup: "sha256",
      blockTime: 600,
      subsidy: 1.5625,
      fallback: {
        difficulty: 433803487732.39,
        hashrate: 2654090872791562981
      },
      fetch: fetchBch
    },
    {
      id: "bch2",
      ticker: "BCH2",
      name: "Bitcoin Cash II",
      algo: "SHA-256d",
      algoGroup: "sha256",
      blockTime: 600,
      subsidy: 50,
      fallback: {
        difficulty: 968308025.38628,
        hashrate: 8552873025645320
      },
      fetch: fetchBch2
    },
    {
      id: "btcb2",
      ticker: "BTCB2",
      name: "Bitcoin BLAKE2b",
      algo: "BLAKE2b",
      algoGroup: "blake2b",
      blockTime: 600,
      subsidy: 3.125,
      fallback: {
        difficulty: 1141943013.515522,
        hashrate: 21008064262410690
      },
      fetch: fetchBtcb2
    }
  ];

  function networkFromDifficulty(difficulty, blockTime) {
    return (difficulty * TWO_32) / blockTime;
  }

  function jsonGet(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error(res.status + " " + url);
      return res.json();
    });
  }

  function fetchBtc() {
    return jsonGet("https://mempool.space/api/v1/mining/hashrate/3d").then(function (data) {
      return {
        difficulty: Number(data.currentDifficulty),
        hashrate: Number(data.currentHashrate),
        source: "mempool.space"
      };
    });
  }

  function fetchBch() {
    return jsonGet("https://api.blockchair.com/bitcoin-cash/stats").then(function (payload) {
      var d = payload && payload.data;
      if (!d) throw new Error("No BCH stats");
      return {
        difficulty: Number(d.difficulty),
        hashrate: Number(d.hashrate_24h),
        source: "blockchair.com"
      };
    });
  }

  function fetchBch2() {
    return jsonGet("https://explorer.bch2.org/api/v1/mining/hashrate/3d").then(function (data) {
      return {
        difficulty: Number(data.currentDifficulty),
        hashrate: Number(data.currentHashrate),
        source: "explorer.bch2.org"
      };
    });
  }

  function fetchBtcb2() {
    return jsonGet("https://b2pool.io/api/v1/public/network").then(function (data) {
      return {
        difficulty: Number(data.difficulty),
        hashrate: Number(data.hashrate),
        source: "b2pool.io",
        subsidy: data.blockReward != null ? Number(data.blockReward) : undefined,
        height: data.height
      };
    });
  }

  function applyNetwork(coin, live) {
    var difficulty = live && isFinite(live.difficulty) && live.difficulty > 0
      ? live.difficulty
      : coin.fallback.difficulty;
    var hashrate = live && isFinite(live.hashrate) && live.hashrate > 0
      ? live.hashrate
      : networkFromDifficulty(difficulty, coin.blockTime);
    if (live && live.subsidy != null && isFinite(live.subsidy)) {
      coin.subsidy = live.subsidy;
    }
    coin.network = {
      difficulty: difficulty,
      hashrate: hashrate,
      live: !!(live && live.source),
      source: live && live.source ? live.source : "snapshot fallback",
      height: live && live.height
    };
  }

  function parseHashrate(value, unit) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 0;
    return n * (UNIT[unit] || 1);
  }

  function expectedSeconds(minerHs, difficulty) {
    if (!minerHs) return Infinity;
    return (difficulty * TWO_32) / minerHs;
  }

  function chanceAtLeastOne(tSeconds, windowSeconds) {
    if (!isFinite(tSeconds) || tSeconds <= 0) return 0;
    var lambda = windowSeconds / tSeconds;
    if (lambda > 80) return 1;
    return 1 - Math.exp(-lambda);
  }

  function formatHashrate(hs) {
    if (!isFinite(hs) || hs <= 0) return "—";
    var units = [
      [1e18, "EH/s"],
      [1e15, "PH/s"],
      [1e12, "TH/s"],
      [1e9, "GH/s"],
      [1e6, "MH/s"],
      [1e3, "KH/s"]
    ];
    for (var i = 0; i < units.length; i++) {
      if (hs >= units[i][0]) return trimNum(hs / units[i][0], 3) + " " + units[i][1];
    }
    return trimNum(hs, 3) + " H/s";
  }

  function trimNum(n, digits) {
    if (!isFinite(n)) return "—";
    if (Math.abs(n) >= 1e6) return n.toExponential(2);
    var s = n.toPrecision(digits);
    return String(Number(s));
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds) || seconds <= 0) return "never";
    if (seconds < 1) return "< 1 second";
    var units = [
      { s: 365.25 * DAY, name: "year" },
      { s: 30 * DAY, name: "month" },
      { s: DAY, name: "day" },
      { s: 3600, name: "hour" },
      { s: 60, name: "minute" },
      { s: 1, name: "second" }
    ];
    for (var i = 0; i < units.length; i++) {
      var value = seconds / units[i].s;
      if (value >= 1.5 || i === units.length - 1) {
        var rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
        return rounded + " " + units[i].name + (rounded === 1 ? "" : "s");
      }
    }
    return trimNum(seconds, 3) + " seconds";
  }

  function formatOdds(p) {
    if (!isFinite(p) || p <= 0) return { pct: "0%", oneIn: "no chance at this hashrate" };
    if (p >= 0.9995) return { pct: "> 99.95%", oneIn: "almost certain" };
    var pct;
    if (p >= 0.1) pct = (p * 100).toFixed(2) + "%";
    else if (p >= 0.01) pct = (p * 100).toFixed(3) + "%";
    else if (p >= 0.0001) pct = (p * 100).toFixed(4) + "%";
    else pct = (p * 100).toExponential(2) + "%";
    var oneIn = 1 / p;
    var oneInLabel;
    if (oneIn < 1.05) oneInLabel = "better than even money";
    else if (oneIn < 10) oneInLabel = "about 1 in " + oneIn.toFixed(1);
    else if (oneIn < 1e6) oneInLabel = "about 1 in " + Math.round(oneIn).toLocaleString("en-US");
    else oneInLabel = "about 1 in " + oneIn.toExponential(2);
    return { pct: pct, oneIn: oneInLabel };
  }

  function formatShare(share) {
    if (!isFinite(share) || share <= 0) return "0%";
    var pct = share * 100;
    if (pct >= 1) return pct.toFixed(3) + "%";
    if (pct >= 0.001) return pct.toFixed(6) + "%";
    return pct.toExponential(2) + "%";
  }

  function minerFor(coin) {
    if (coin.algoGroup === "blake2b") {
      return parseHashrate(
        document.getElementById("hash-blake").value,
        document.getElementById("unit-blake").value
      );
    }
    return parseHashrate(
      document.getElementById("hash-sha").value,
      document.getElementById("unit-sha").value
    );
  }

  function selectedWindow() {
    var el = document.querySelector('input[name="window"]:checked');
    var id = el ? el.value : "1d";
    for (var i = 0; i < WINDOWS.length; i++) {
      if (WINDOWS[i].id === id) return WINDOWS[i];
    }
    return WINDOWS[1];
  }

  function renderStatus() {
    var el = document.getElementById("net-status");
    if (!el) return;
    var live = COINS.filter(function (c) { return c.network && c.network.live; }).length;
    if (live === COINS.length) {
      el.textContent = "Live network difficulty loaded for all four chains.";
      el.dataset.state = "live";
    } else if (live > 0) {
      el.textContent = "Live stats for " + live + " of " + COINS.length + " chains. Others are using a recent snapshot.";
      el.dataset.state = "mixed";
    } else {
      el.textContent = "Couldn't reach live APIs from this browser — using snapshot difficulty so the math still runs.";
      el.dataset.state = "fallback";
    }
  }

  function renderCoin(coin, win) {
    var card = document.getElementById("coin-" + coin.id);
    if (!card || !coin.network) return;

    var miner = minerFor(coin);
    var t = expectedSeconds(miner, coin.network.difficulty);
    var share = coin.network.hashrate > 0 ? miner / coin.network.hashrate : 0;
    var p = chanceAtLeastOne(t, win.seconds);
    var odds = formatOdds(p);
    var expectedBlocks = isFinite(t) && t > 0 ? win.seconds / t : 0;
    var bar = Math.min(100, p * 100);

    card.querySelector("[data-field='network']").textContent = formatHashrate(coin.network.hashrate);
    card.querySelector("[data-field='difficulty']").textContent = Number(coin.network.difficulty).toLocaleString("en-US", { maximumFractionDigits: 0 });
    card.querySelector("[data-field='source']").textContent = coin.network.live ? "Live · " + coin.network.source : "Snapshot fallback";
    card.querySelector("[data-field='share']").textContent = formatShare(share);
    card.querySelector("[data-field='eta']").textContent = formatDuration(t);
    card.querySelector("[data-field='chance']").textContent = odds.pct;
    card.querySelector("[data-field='onein']").textContent = odds.oneIn + " over " + win.label;
    card.querySelector("[data-field='blocks']").textContent = expectedBlocks >= 10
      ? Math.round(expectedBlocks).toLocaleString("en-US")
      : trimNum(expectedBlocks, 3);
    card.querySelector("[data-field='subsidy']").textContent = coin.subsidy + " " + coin.ticker;
    var fill = card.querySelector(".odds-fill");
    if (fill) fill.style.width = bar + "%";

    var mismatch = card.querySelector("[data-field='note']");
    if (mismatch) {
      if (coin.algoGroup === "blake2b") {
        mismatch.textContent = "Needs BLAKE2b (Sia-class) hardware — SHA-256 ASICs cannot mine this chain.";
      } else {
        mismatch.textContent = "SHA-256d — same algorithm family as Bitcoin ASICs / Bitaxe.";
      }
    }
  }

  function renderAll() {
    var win = selectedWindow();
    COINS.forEach(function (coin) { renderCoin(coin, win); });
    renderCompare(win);
  }

  function renderCompare(win) {
    var body = document.getElementById("compare-body");
    if (!body) return;
    var ranked = COINS.slice().sort(function (a, b) {
      var ta = expectedSeconds(minerFor(a), a.network.difficulty);
      var tb = expectedSeconds(minerFor(b), b.network.difficulty);
      return ta - tb;
    });
    body.innerHTML = ranked.map(function (coin) {
      var miner = minerFor(coin);
      var t = expectedSeconds(miner, coin.network.difficulty);
      var p = chanceAtLeastOne(t, win.seconds);
      var odds = formatOdds(p);
      return (
        "<tr>" +
          "<td><strong>" + coin.ticker + "</strong><span class='muted'> " + coin.algo + "</span></td>" +
          "<td>" + formatDuration(t) + "</td>" +
          "<td>" + odds.pct + "</td>" +
          "<td>" + odds.oneIn + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function bindPresets() {
    document.querySelectorAll("[data-preset-sha]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.getElementById("hash-sha").value = btn.getAttribute("data-value");
        document.getElementById("unit-sha").value = btn.getAttribute("data-unit");
        setActivePreset("sha", btn);
        renderAll();
      });
    });
    document.querySelectorAll("[data-preset-blake]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.getElementById("hash-blake").value = btn.getAttribute("data-value");
        document.getElementById("unit-blake").value = btn.getAttribute("data-unit");
        setActivePreset("blake", btn);
        renderAll();
      });
    });
  }

  function setActivePreset(group, active) {
    document.querySelectorAll("[data-preset-" + group + "]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn === active);
    });
  }

  function bindInputs() {
    ["hash-sha", "unit-sha", "hash-blake", "unit-blake"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", renderAll);
      if (el) el.addEventListener("change", renderAll);
    });
    document.querySelectorAll('input[name="window"]').forEach(function (el) {
      el.addEventListener("change", renderAll);
    });
  }

  function loadNetwork() {
    return Promise.all(COINS.map(function (coin) {
      return coin.fetch().then(function (live) {
        applyNetwork(coin, live);
      }).catch(function () {
        applyNetwork(coin, null);
      });
    })).then(function () {
      renderStatus();
      renderAll();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    COINS.forEach(function (coin) { applyNetwork(coin, null); });
    bindPresets();
    bindInputs();
    renderAll();
    loadNetwork();
  });
})();
