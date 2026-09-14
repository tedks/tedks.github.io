// tedks.horse client-side decorations.
//
// On top of the CRT overlay this script adds:
//
//   sprinkle()        random horse emojis scattered across the viewport
//   injectAscii()     galloping ASCII horse appended to the sidebar
//   horseFact()       a "fact of the gallop" element below the sidebar nav
//   stableBadge()     small STABLE LIVE blinker in the sidebar
//   logToConsole()    galloping ASCII horse dumped into devtools
//   titleRotor()      cycles document.title through horse phrases
//   pressHToGallop()  keypress H scatters a 20-horse stampede
//   clickToSpawn()    clicking empty page area spawns a horse at the cursor
//   konami()          ↑↑↓↓←→←→BA triggers a mass stampede
//
// All horse-facts and rotor titles are starter values; replace with
// whatever you actually want to surface. Search this file for "TODO".
(function () {
  // ---- emoji sprinkles ------------------------------------------------------
  function sprinkle(n) {
    n = n || (8 + Math.floor(Math.random() * 5));
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'horse-sprinkle';
      s.textContent = '🐴';
      s.setAttribute('aria-hidden', 'true');
      s.style.top = (Math.random() * 92 + 2) + 'vh';
      s.style.left = (Math.random() * 92 + 2) + 'vw';
      s.style.fontSize = (18 + Math.random() * 90) + 'px';
      s.style.opacity = (0.08 + Math.random() * 0.18).toFixed(2);
      s.style.animationDelay = '-' + (Math.random() * 6).toFixed(2) + 's';
      s.style.transform = 'rotate(' + ((Math.random() - 0.5) * 20).toFixed(1) + 'deg)';
      frag.appendChild(s);
    }
    document.body.appendChild(frag);
  }

  // ---- sidebar ASCII --------------------------------------------------------
  // Horse-and-rider piece by Tua Xiong from asciiart.eu/animals/horses.
  // Pure-ASCII, 23 cols × 8 lines, renders cleanly at the sidebar's
  // ~250px width. Replace this string to swap art; styling lives in
  // .horse-gallop-ascii in horse-crt.css.
  var ASCII =
    "           {)\n" +
    "        c==//\\\n" +
    "   _-~~/-._|_|\n" +
    "  /'_,/,   //'~~~\\;;,\n" +
    "  `~  _( _||_..\\ | ';;\n" +
    "    /'~|/ ~' `\\<\\>  ;\n" +
    "    \"  |      /  |\n" +
    "       \"      \"  \"\n" +
    "    ☭  tedks.horse  Ⓐ";

  function injectAscii() {
    var h = document.getElementById('header');
    if (!h) return;
    var p = document.createElement('pre');
    p.className = 'horse-gallop-ascii';
    p.setAttribute('aria-hidden', 'true');
    p.textContent = ASCII;
    h.appendChild(p);
  }

  // ---- horse facts on page (sidebar) ---------------------------------------
  // TODO: replace with your own facts / slogans / whatever.
  var FACTS = [
    "A horse's eyes are the largest of any land mammal.",
    "Horses can sleep standing up by locking their knee joints.",
    "Horses have nearly 360° vision, with two narrow blind spots.",
    "Adult horses have between 36 and 44 teeth.",
    "A horse's teeth take up more space in its head than its brain.",
    "Horses cannot vomit due to a band of muscle around the esophagus.",
    "The fastest recorded horse speed is 55 mph (88 km/h).",
    "Foals can stand within an hour of birth.",
    "Horses have one toe per leg — the hoof is a modified middle toe.",
    "A horse's heart weighs around 9 to 10 pounds.",
    "Horses can hear frequencies inaudible to humans.",
    "Horses sweat through their skin, unlike most mammals.",
    "Domesticated horses have lived alongside humans for ~5,500 years.",
    "A horse's hoof is made of keratin — the same protein as human hair.",
    "The smallest horse breed, the Falabella, stands under 30 inches tall.",
    "The largest horse breed, the Shire, can exceed 2,000 pounds.",
    "A horse's normal body temperature is about 100°F (37.8°C).",
    "Horses are crepuscular: most active at dawn and dusk.",
    "There are over 350 recognized horse breeds.",
    "Horses are obligate nasal breathers — they only breathe through their nose."
  ];
  function horseFact() {
    var h = document.getElementById('header');
    if (!h) return;
    var fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    var box = document.createElement('div');
    box.className = 'horse-fact';
    box.setAttribute('aria-label', 'fact of the gallop');
    var label = document.createElement('span');
    label.className = 'horse-fact__label';
    label.textContent = '🐴 horse fact of the day';
    var body = document.createElement('span');
    body.className = 'horse-fact__body';
    body.textContent = fact;
    box.appendChild(label);
    box.appendChild(body);
    var cp = h.querySelector('.copyright');
    if (cp) cp.parentNode.insertBefore(box, cp); else h.appendChild(box);
  }

  // ---- stable status badge --------------------------------------------------
  function stableBadge() {
    var h = document.getElementById('header');
    if (!h) return;
    var b = document.createElement('div');
    b.className = 'stable-status';
    b.innerHTML = '<span class="stable-status__dot">●</span> STABLE LIVE';
    var logo = h.querySelector('#logo');
    if (logo && logo.parentNode) logo.parentNode.insertBefore(b, logo);
    else h.insertBefore(b, h.firstChild);
  }

  // ---- console ASCII --------------------------------------------------------
  function logToConsole() {
    var styled = "color:#00ffff; text-shadow:1px 0 #ff0033, -1px 0 #ffcc00; font-family:monospace; line-height:1.05;";
    try {
      console.log("%c" + ASCII, styled);
      console.log("%cTRANSMISSION ONGOING ●", "color:#ff0033; letter-spacing:2px;");
    } catch (_) {}
  }

  // ---- document.title rotor -------------------------------------------------
  // TODO: tune phrases.
  var TITLES = [
    "tedks.horse",
    "🐴 tedks.horse",
    "transmission ongoing ●",
    "stable online",
    "gallop forever",
    "post-scarcity hay",
    "the horse you deserve"
  ];
  function titleRotor() {
    var i = 0;
    var orig = document.title;
    setInterval(function () {
      // Pause rotation when the tab isn't focused so we don't churn.
      if (document.hidden) return;
      i = (i + 1) % TITLES.length;
      document.title = TITLES[i] || orig;
    }, 6000);
  }

  // ---- gallop across the screen + exit ------------------------------------
  // Spawns N horses that ride in from the left, gallop across the viewport,
  // and exit on the right. Used by press-H and the konami code.
  function gallopAcross(n, emoji) {
    n = n || 20;
    emoji = emoji || '🏇';
    var frag = document.createDocumentFragment();
    var spawned = [];
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span');
      h.className = 'horse-gallop-across';
      h.textContent = emoji;
      h.setAttribute('aria-hidden', 'true');
      h.style.top = (Math.random() * 88 + 4) + 'vh';
      h.style.fontSize = (22 + Math.random() * 56) + 'px';
      h.style.opacity = (0.45 + Math.random() * 0.5).toFixed(2);
      var dur = (2 + Math.random() * 3.2).toFixed(2);
      var delay = (Math.random() * 0.8).toFixed(2);
      h.style.animationDuration = dur + 's';
      h.style.animationDelay = delay + 's';
      frag.appendChild(h);
      spawned.push({ el: h, total: parseFloat(dur) + parseFloat(delay) });
    }
    document.body.appendChild(frag);
    // Clean each horse up after its own animation finishes.
    spawned.forEach(function (s) {
      setTimeout(function () { s.el.remove(); }, (s.total + 0.3) * 1000);
    });
  }

  // ---- press H to gallop ---------------------------------------------------
  function pressHToGallop() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'h' && e.key !== 'H') return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      gallopAcross(22, '🏇');
    });
  }

  // ---- click and hold to spawn a transparent, growing, fading horse -------
  // Mousedown drops a small 🐴 at the cursor at ~40% opacity (page
  // content behind it stays readable). While the button is held, the
  // horse grows continuously (no upper size limit). Mouseup stops the
  // growth and starts a stay+fade-out timer — the horse lingers for a
  // few seconds, then fades and removes itself from the DOM.
  function holdToSpawn() {
    var current = null;
    var growId = null;
    var size = 0;
    var START = 24;        // initial font-size in px
    var STEP  = 4;         // px added per tick
    var TICK  = 28;        // ms between ticks (~36 fps)
    var STAY_MS = 5000;    // how long to stay at full opacity after release
    var FADE_MS = 1000;    // fade-out duration

    function isInteractive(t) {
      while (t && t !== document.body) {
        var tag = (t.tagName || '').toLowerCase();
        if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'label') return true;
        if (t.id === 'intro-overlay' || (t.closest && t.closest('#intro-overlay'))) return true;
        t = t.parentNode;
      }
      return false;
    }

    function release() {
      if (growId) { clearInterval(growId); growId = null; }
      var horse = current;
      current = null;
      if (!horse) return;
      setTimeout(function () {
        horse.style.transition = 'opacity ' + (FADE_MS / 1000) + 's ease-out';
        horse.style.opacity = '0';
        setTimeout(function () { horse.remove(); }, FADE_MS + 50);
      }, STAY_MS);
    }

    document.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      if (isInteractive(e.target)) return;
      if (growId) { clearInterval(growId); growId = null; }
      current = document.createElement('span');
      current.className = 'horse-pinned';
      current.textContent = '🐴';
      current.setAttribute('aria-hidden', 'true');
      current.style.left = e.clientX + 'px';
      current.style.top  = e.clientY + 'px';
      size = START;
      current.style.fontSize = size + 'px';
      document.body.appendChild(current);
      growId = setInterval(function () {
        size += STEP;
        if (current) current.style.fontSize = size + 'px';
      }, TICK);
    });

    document.addEventListener('mouseup', release);
    document.addEventListener('mouseleave', release);
    document.addEventListener('touchend', release);
    document.addEventListener('touchcancel', release);
  }

  // ---- konami code ---------------------------------------------------------
  function konami() {
    var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var idx = 0;
    document.addEventListener('keydown', function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          idx = 0;
          gallopAcross(600, '🏇');
          document.body.classList.add('konami-stampede');
          setTimeout(function () { document.body.classList.remove('konami-stampede'); }, 8000);
        }
      } else {
        idx = (k === seq[0]) ? 1 : 0;
      }
    });
  }

  // ---- boot ----------------------------------------------------------------
  function boot() {
    sprinkle();
    injectAscii();
    horseFact();
    stableBadge();
    logToConsole();
    titleRotor();
    pressHToGallop();
    holdToSpawn();
    konami();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
