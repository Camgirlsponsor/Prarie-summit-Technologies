// Prairie Summit Technologies — animated particle-network background
// Lightweight canvas constellation: drifting nodes connected by faint lines,
// colored with the site's blue/amber duotone. Pauses on hidden tabs and
// renders a single static frame (no animation loop) for visitors who
// prefer reduced motion.

(function () {
  var canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0;
  var particles = [];
  var linkDistance = 130;
  var running = true;
  var rafId = null;

  var COLORS = ["47,125,255", "255,138,61"]; // blue, amber (as "r,g,b")

  function particleCount() {
    // Density scaled to viewport area, capped for performance.
    var area = width * height;
    var n = Math.round(area / 24000);
    return Math.max(28, Math.min(n, 110));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  function seed() {
    var count = particleCount();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.1 + Math.random() * 1.6,
        c: COLORS[i % 2 === 0 ? 0 : 1]
      });
    }
  }

  function step() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Links first, so dots sit on top.
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDistance) {
          var alpha = (1 - dist / linkDistance) * 0.16;
          ctx.strokeStyle = "rgba(160,180,210," + alpha.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dots.
    for (var k = 0; k < particles.length; k++) {
      var p2 = particles[k];
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, p2.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p2.c + ",0.55)";
      ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener("resize", function () {
    resize();
    if (reduceMotion) draw();
  });

  document.addEventListener("visibilitychange", function () {
    if (reduceMotion) return;
    if (document.hidden) stop();
    else start();
  });

  resize();

  if (reduceMotion) {
    draw(); // one static frame, no animation loop
  } else {
    start();
  }
})();
