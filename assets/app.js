/* Everyday GTA6 Moments: tiny single-page app. Real files exist at /, /terms/ and /privacy/ (so every URL
   loads directly with a 200 for reviewers and crawlers); after the first load, links switch pages without
   a reload via the History API. No framework, no build step. */
(function () {
  "use strict";
  var ROOT = new URL("..", document.currentScript.src);          // site root, works on project and user Pages
  var EMAIL = "everyday.gta6.moments@gmail.com";
  var UPDATED = "18 November 2026";

  // ---------- icons (simple original marks, not the platforms' logo files) ----------
  var I = {
    yt: '<svg width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4.5" fill="#ff3b5c"/><path d="M10 9l5.2 3L10 15z" fill="#fff"/></svg>',
    tt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><circle cx="9" cy="16" r="4"/><rect x="11" y="3" width="3" height="13"/><path d="M14 3c.6 3 2.6 4.6 5.5 4.8v3c-2.4 0-4.3-.8-5.5-2z"/><circle cx="9" cy="16" r="4" fill="none" stroke="#2fb8c4" stroke-width="1" transform="translate(-.8 -.6)" opacity=".8"/></svg>',
    ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#igg)" stroke-width="2.2"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#ffc36b"/><stop offset=".5" stop-color="#ff4f9a"/><stop offset="1" stop-color="#a47cad"/></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="#ff4f9a" stroke="none"/></svg>',
    twitch: '<svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M4 2l-1 4v14h5v3h3l3-3h4l5-5V2zm16 12l-3 3h-5l-3 3v-3H5V4h15z"/><path d="M15 7h2v5h-2zm-5 0h2v5h-2z"/></svg>',
    live: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M4.9 4.9a10 10 0 000 14.2M19.1 4.9a10 10 0 010 14.2"/></svg>',
    spike: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h4l2-4 3 7 3-15 2 9 1-2h3"/></svg>',
    cc: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 11h4M13 11h4M7 15h7M16 15h1"/></svg>',
    up: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  };

  var CHANNELS = [
    { name: "Everyday GTA6 Moments", lang: "EN", sub: "English streamers, top 10 live", img: "icon.png", links: [
      ["yt", "YouTube", "@EverydayGTA6Moments", "https://www.youtube.com/@EverydayGTA6Moments"],
      ["tt", "TikTok", "@everyday_gta6_moments", "https://www.tiktok.com/@everyday_gta6_moments"],
      ["ig", "Instagram", "@everyday_gta6_moments", "https://www.instagram.com/everyday_gta6_moments/"]] },
    { name: "Dzienna Dawka GTA6", lang: "PL", sub: "Polscy streamerzy, top 5 na żywo", img: "icon-pl.png", links: [
      ["yt", "YouTube", "@DziennaDawkaGTA6", "https://www.youtube.com/@DziennaDawkaGTA6"],
      ["tt", "TikTok", "@dzienna_dawka_gta", "https://www.tiktok.com/@dzienna_dawka_gta"],
      ["ig", "Instagram", "@dzienna_dawka_gta6", "https://www.instagram.com/dzienna_dawka_gta6/"]] },
  ];

  var LEGAL = {
    terms: { title: "Terms of Service", sections: [
      ["about", "About us", "<p>Everyday GTA6 Moments (“we”) runs the channels <b>Everyday GTA6 Moments</b> and <b>Dzienna Dawka GTA6</b> on YouTube, TikTok and Instagram, and a private tool that cuts short clips from public live streams and posts them to those channels.</p>"],
      ["tool", "Who can use the tool", "<p>The tool is operated only by us, to publish to accounts we own. It is not offered to the public, and no one else can sign in to it or connect an account to it.</p>"],
      ["content", "Content and credit", "<p>Every clip names the streamer on screen and links their channel in the description. Streamers and rights holders can ask for any clip to be removed by emailing <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>; we remove it promptly.</p>"],
      ["submissions", "Submissions", "<p>If you email us a link to a moment, you agree that we may watch it and publish a clip of it, with credit to the streamer. We only use the public video link and timestamp you send.</p>"],
      ["platforms", "Platform terms", "<p>Our videos are published on YouTube, TikTok and Instagram and are also subject to those platforms’ terms, including the <a href=\"https://www.youtube.com/t/terms\" rel=\"noopener\">YouTube Terms of Service</a>.</p>"],
      ["affiliation", "No affiliation", "<p>This is a fan project. It is not affiliated with, endorsed or sponsored by Rockstar Games, Take-Two Interactive, Twitch, YouTube, TikTok or Meta. Grand Theft Auto is a trademark of Take-Two Interactive.</p>"],
      ["warranty", "No warranty, changes", "<p>Our channels and pages are provided as is. We may update these terms; the date at the top shows the current version.</p>"],
      ["contact", "Contact", "<p><a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a></p>"],
    ] },
    privacy: { title: "Privacy Policy", sections: [
      ["who", "Who we are", "<p>Everyday GTA6 Moments runs a private tool that posts short gameplay clips to our own YouTube, TikTok and Instagram accounts. Contact: <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>.</p>"],
      ["access", "What the tool accesses", "<ul><li><b>Our own accounts only.</b> We sign in with YouTube, TikTok and Instagram to upload videos to accounts we own. The resulting access tokens are stored on our own computer and used for nothing else.</li><li><b>The basic profile of our own account</b> (display name and account ID), only to confirm the right account is connected.</li><li><b>Public stream data:</b> public live streams, public chat message counts and public clips, used to find moments worth clipping. We don’t store chat messages or viewer names.</li></ul>"],
      ["google", "Google and YouTube data", "<p>We use YouTube API Services to upload to our own channels. Our use of information received from Google APIs adheres to the <a href=\"https://developers.google.com/terms/api-services-user-data-policy\" rel=\"noopener\">Google API Services User Data Policy</a>, including the Limited Use requirements. See also the <a href=\"https://policies.google.com/privacy\" rel=\"noopener\">Google Privacy Policy</a>. Access can be revoked at any time on the <a href=\"https://myaccount.google.com/permissions\" rel=\"noopener\">Google security settings page</a>.</p>"],
      ["tiktok", "TikTok and Instagram data", "<p>From TikTok and Instagram we receive only what’s needed to post to our own accounts: an access token, the account ID and display name. We never read other users’ data, and we don’t share or sell anything we receive.</p>"],
      ["email", "Emails you send us", "<p>If you email a submission, we read the links and timestamps in it to make the clip. We keep the email in our inbox and never sell or share it.</p>"],
      ["cookies", "Cookies and tracking", "<p>This website sets no cookies and runs no analytics, ads or trackers. Fonts are loaded from Google Fonts.</p>"],
      ["removal", "Removal and deletion", "<p>To have a clip, your email or any data about you removed, write to <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>. We delete it within 30 days, usually much sooner.</p>"],
    ] },
  };

  // ---------- helpers ----------
  function href(path) { return new URL(path, ROOT).pathname; }
  function route() {
    var p = location.pathname.slice(new URL(ROOT).pathname.length).replace(/index\.html$/, "");
    return p.indexOf("terms") === 0 ? "terms" : p.indexOf("privacy") === 0 ? "privacy" : "home";
  }
  function img(name) { return new URL("assets/" + name, ROOT).href; }

  function nav(r) {
    var home = r === "home";
    var a = function (id, label) { return '<a href="' + (home ? "#" + id : href("") + "#" + id) + '" data-link>' + label + "</a>"; };
    return '<header class="nav"><div class="wrap">' +
      '<a class="brand" href="' + href("") + '" data-link><img src="' + img("icon.png") + '" alt="">Everyday GTA6 Moments<small>Clips</small></a>' +
      '<nav class="nav-links" id="links">' + a("how", "How it works") + a("channels", "Channels") + a("submit", "Submit a clip") +
      '<a href="' + href("terms/") + '" data-link' + (r === "terms" ? ' aria-current="page"' : "") + ">Terms</a>" +
      '<a href="' + href("privacy/") + '" data-link' + (r === "privacy" ? ' aria-current="page"' : "") + ">Privacy</a></nav>" +
      '<div class="nav-cta"><a class="btn" href="https://www.youtube.com/@EverydayGTA6Moments" rel="noopener">Watch</a>' +
      '<a class="btn btn-primary" href="mailto:' + EMAIL + '">Send a clip</a></div>' +
      '<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="links">' + I.menu + "</button>" +
      "</div></header>";
  }

  function footer() {
    return '<footer class="site"><div class="wrap"><span>© 2026 Everyday GTA6 Moments · Fan project, not affiliated with Rockstar Games or Take-Two Interactive.</span>' +
      '<nav><a href="' + href("terms/") + '" data-link>Terms</a><a href="' + href("privacy/") + '" data-link>Privacy</a><a href="mailto:' + EMAIL + '">Contact</a></nav></div></footer>';
  }

  // the phone: a stylised preview of our clip layout (cam on top, gameplay below, caption at the seam)
  function phone() {
    var cam = '<svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="lamp" cx=".8" cy=".2" r=".7"><stop stop-color="#ff4f9a" stop-opacity=".55"/><stop offset="1" stop-color="#ff4f9a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="300" height="260" fill="url(#lamp)"/><rect x="200" y="40" width="70" height="90" rx="6" fill="#ffffff" opacity=".06"/>' +
      '<path d="M70 260c0-60 34-92 80-92s80 32 80 92z" fill="#160f2a"/><circle cx="150" cy="130" r="44" fill="#1e1538"/>' +
      '<path d="M100 128a50 50 0 01100 0" fill="none" stroke="#0b0716" stroke-width="10"/><rect x="92" y="118" width="16" height="34" rx="7" fill="#0b0716"/><rect x="192" y="118" width="16" height="34" rx="7" fill="#0b0716"/></svg>';
    var game = '<svg viewBox="0 0 300 390" preserveAspectRatio="xMidYMid slice"><defs>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4b4f9c"/><stop offset=".35" stop-color="#a47cad"/><stop offset=".6" stop-color="#e091a7"/><stop offset="1" stop-color="#f8b384"/></linearGradient>' +
      '<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffc36b"/><stop offset="1" stop-color="#ff4f9a"/></linearGradient>' +
      '<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2fb8c4"/><stop offset="1" stop-color="#22163a"/></linearGradient>' +
      '<clipPath id="sc"><circle cx="190" cy="200" r="78"/></clipPath></defs>' +
      '<rect width="300" height="390" fill="url(#sky)"/><circle cx="190" cy="200" r="78" fill="url(#sun)"/>' +
      '<g clip-path="url(#sc)" fill="#e091a7"><rect x="100" y="208" width="200" height="4"/><rect x="100" y="222" width="200" height="6"/><rect x="100" y="238" width="200" height="8"/><rect x="100" y="256" width="200" height="10"/></g>' +
      '<g fill="#22163a" opacity=".85"><rect x="150" y="214" width="16" height="46"/><rect x="170" y="200" width="12" height="60"/><rect x="186" y="226" width="20" height="34"/><rect x="210" y="190" width="14" height="70"/><rect x="228" y="218" width="18" height="42"/><rect x="250" y="206" width="12" height="54"/></g>' +
      '<rect y="260" width="300" height="130" fill="url(#sea)"/><g fill="#f5a69d" opacity=".4"><rect x="80" y="272" width="160" height="3"/><rect x="110" y="290" width="110" height="3"/><rect x="135" y="312" width="60" height="3"/></g>' +
      '<g fill="#22163a"><path d="M40 390 Q52 300 66 200 L74 200 Q62 300 56 390Z"/>' +
      '<g transform="translate(70 200)"><path d="M0 0 Q-30 -18 -66 4 Q-34 -6 0 0Z"/><path d="M0 0 Q-20 -36 -52 -40 Q-22 -26 0 0Z"/><path d="M0 0 Q14 -38 46 -42 Q16 -24 0 0Z"/><path d="M0 0 Q34 -14 66 8 Q32 -4 0 0Z"/><path d="M0 0 Q30 8 48 36 Q24 12 0 0Z"/><path d="M0 0 Q-28 10 -44 38 Q-20 14 0 0Z"/></g></g>' +
      '<g transform="translate(118 318)"><rect x="0" y="10" width="64" height="16" rx="6" fill="#ff4f9a"/><path d="M10 10 L20 0 H44 L54 10Z" fill="#c683ac"/><circle cx="14" cy="27" r="6" fill="#120c22"/><circle cx="50" cy="27" r="6" fill="#120c22"/></g></svg>';
    return '<div class="phone-stage"><div class="phone" aria-hidden="true"><div class="notch"></div><div class="screen">' +
      '<div class="cam">' + cam + '</div><div class="game">' + game + "</div>" +
      '<div class="tag"><i>' + I.twitch + "</i>twitch.tv/streamer</div>" +
      '<div class="cap" id="cap">no way</div>' +
      '<div class="ui-rail"><span></span><span></span><span></span></div>' +
      '<div class="ui-caption"><b>@everyday_gta6_moments</b>He actually made the jump … #gta6</div>' +
      "</div></div></div>";
  }

  function home() {
    var card = function (n, ico, h, p) { return '<article class="card reveal"><span class="step">0' + n + '</span><div class="ico">' + ico + "</div><h3>" + h + "</h3><p>" + p + "</p></article>"; };
    var chan = CHANNELS.map(function (c) {
      return '<div class="channel reveal"><div><header><img src="' + img(c.img) + '" alt=""><div><h3>' + c.name + "</h3><span>" + c.sub + '</span></div><span class="flag">' + c.lang + "</span></header>" +
        '<div class="plat">' + c.links.map(function (l) {
          return '<a href="' + l[3] + '" rel="noopener"><span class="pi">' + I[l[0]] + "</span><b>" + l[1] + "</b><code>" + l[2] + "</code></a>";
        }).join("") + "</div></div></div>";
    }).join("");
    return nav("home") + "<main>" +
      '<section class="hero" id="top"><div class="wrap"><div>' +
      '<span class="eyebrow"><b>DAY ONE</b><span class="live-dot"></span>Watching the top GTA 6 streams live</span>' +
      '<h1>The best of GTA 6 streams, <span class="grad-text">clipped every day.</span></h1>' +
      '<p class="lead">Chases, fails, heists and the reactions that go with them, cut from the biggest English and Polish streamers minutes after they happen. Vertical, captioned and credited.</p>' +
      '<div class="hero-actions"><a class="btn btn-primary" href="#channels" data-link>Follow the channels</a><a class="btn" href="#submit" data-link>' + I.mail + "Send us a moment</a></div>" +
      '<div class="stats"><div><strong>15</strong>streams watched live</div><div><strong>~2 min</strong>from moment to clip</div><div><strong>2</strong>languages, EN + PL</div></div>' +
      "</div>" + phone() + "</div></section>" +

      '<section class="band" id="how"><div class="wrap"><div class="section-head reveal"><span class="kicker">// How it works</span><h2>From a chat explosion to your feed.</h2>' +
      "<p>We don’t wait for the stream to end. When a moment lands, chat tells us, and the clip is ready before the streamer has stopped laughing.</p></div>" +
      '<div class="cards">' +
      card(1, I.live, "Watch live", "The top streamers in each language are recorded from the moment they go live.") +
      card(2, I.spike, "Hear the chat", "A burst of chat messages flags the moment. Viewer-made clips with the most views count too.") +
      card(3, I.cc, "Cut and caption", "The whole moment, not a fixed 30 seconds. Facecam on top, gameplay below, clean captions.") +
      card(4, I.up, "Post everywhere", "Shorts, TikTok and Reels, always crediting the streamer on screen and in the description.") +
      "</div></div></section>" +

      '<section id="channels"><div class="wrap"><div class="section-head reveal"><span class="kicker">// Channels</span><h2>Two channels, one city.</h2>' +
      "<p>English streamers on Everyday GTA6 Moments. Polish streamers on Dzienna Dawka GTA6.</p></div>" +
      '<div class="channels">' + chan + "</div></div></section>" +

      '<section class="band" id="submit"><div class="wrap submit"><div class="reveal"><span class="kicker">// Submit a clip</span><h2>Saw something great on stream?</h2>' +
      '<p class="lead" style="margin:0">Email us the link and the moment. A rough timestamp is fine: we find the action around it.</p>' +
      "<ul><li>Twitch VODs, Twitch clips and YouTube videos all work</li><li>Put the time in the link (<code>?t=1h02m30s</code>) or next to it</li><li>The streamer is always credited</li></ul>" +
      '<div class="hero-actions" style="margin-top:28px"><a class="btn btn-primary" href="mailto:' + EMAIL + '?subject=GTA%206%20moment">' + I.mail + "Email your moment</a></div></div>" +
      '<div class="code reveal"><div class="code-bar"><i></i><i></i><i></i><span>new-message.eml</span><button type="button" id="copy">Copy address</button></div><pre>' +
      '<span class="c-k">To:</span>      <span class="c-s">' + EMAIL + "</span>\n" +
      '<span class="c-k">Subject:</span> he jumped the bridge on a bike\n\n' +
      "Look at this one:\n" +
      '<span class="c-u">https://www.twitch.tv/videos/2901578792?t=1h04m20s</span>\n\n' +
      '<span class="c-d"># or the link + a time next to it:</span>\n' +
      '<span class="c-u">https://youtu.be/abcdEFGhijk</span> at <span class="c-s">12:34</span>' +
      "</pre></div></div></section>" +

      '<section><div class="wrap"><div class="cta reveal"><h2>Vice City never sleeps.</h2><p>Neither do the clips. Follow along and see day one through the eyes of the biggest streamers.</p>' +
      '<a class="btn" href="https://www.youtube.com/@EverydayGTA6Moments" rel="noopener">' + I.yt + "Watch on YouTube</a></div></div></section>" +
      "</main>" + footer();
  }

  function legal(r) {
    var d = LEGAL[r], other = r === "terms" ? "privacy" : "terms";
    var toc = d.sections.map(function (s) { return '<a class="sec" href="#' + s[0] + '">' + s[1] + "</a>"; }).join("");
    var body = d.sections.map(function (s) { return '<h2 id="' + s[0] + '">' + s[1] + "</h2>" + s[2]; }).join("");
    return nav(r) + '<main class="wrap docs"><aside class="toc"><h4>On this page</h4>' + toc +
      '<div class="sw"><h4>Legal</h4><a href="' + href("terms/") + '" data-link' + (r === "terms" ? ' class="on"' : "") + ">Terms of Service</a>" +
      '<a href="' + href("privacy/") + '" data-link' + (r === "privacy" ? ' class="on"' : "") + ">Privacy Policy</a></div></aside>" +
      '<article class="doc"><div class="crumbs"><a href="' + href("") + '" data-link>Home</a> / Legal / ' + d.title + "</div><h1>" + d.title + "</h1>" +
      '<div class="updated">Last updated ' + UPDATED + "</div>" + body +
      '<div class="note">Questions about this page? Email <a href="mailto:' + EMAIL + '">' + EMAIL + "</a>. See also our " +
      '<a href="' + href(other + "/") + '" data-link>' + LEGAL[other].title + "</a>.</div></article></main>" + footer();
  }

  // ---------- render + behaviour ----------
  var capTimer, io;
  function render(hash) {
    var r = route();
    document.title = r === "home" ? "Everyday GTA6 Moments" : LEGAL[r].title + " · Everyday GTA6 Moments";
    document.getElementById("app").innerHTML = r === "home" ? home() : legal(r);
    wire(r);
    var target = hash && document.querySelector(hash);              // instant jumps: smooth scrolling is for in-page links
    if (target) target.scrollIntoView({ behavior: "instant" }); else window.scrollTo({ top: 0, behavior: "instant" });
  }

  function wire(r) {
    var btn = document.querySelector(".menu-btn"), links = document.getElementById("links");
    btn.onclick = function () { var o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
    links.onclick = function () { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };

    clearInterval(capTimer);
    var cap = document.getElementById("cap");
    if (cap) {
      var words = ["no way", "he actually", "made the jump", "LET'S GO", "chat saw that", "clip it"], i = 0;
      capTimer = setInterval(function () { cap.style.opacity = 0; setTimeout(function () { cap.textContent = words[(i = (i + 1) % words.length)]; cap.style.opacity = 1; }, 150); }, 1100);
    }
    var copy = document.getElementById("copy");
    if (copy) copy.onclick = function () {
      (navigator.clipboard ? navigator.clipboard.writeText(EMAIL) : Promise.reject()).then(function () { copy.textContent = "Copied"; }, function () { copy.textContent = EMAIL; });
      setTimeout(function () { copy.textContent = "Copy address"; }, 2000);
    };

    if (io) io.disconnect();
    var items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
      items.forEach(function (el) { io.observe(el); });
    } else items.forEach(function (el) { el.classList.add("in"); });

    if (r !== "home") {                                            // highlight the section in view
      var secs = Array.prototype.slice.call(document.querySelectorAll(".doc h2")), tocs = document.querySelectorAll(".toc a.sec");
      var spy = function () {
        var cur = 0; secs.forEach(function (h, k) { if (h.getBoundingClientRect().top < 140) cur = k; });
        tocs.forEach(function (a, k) { a.classList.toggle("on", k === cur); });
      };
      window.onscroll = spy; spy();
    } else window.onscroll = null;
  }

  // in-app navigation: same-site links switch pages without a reload
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-link]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    e.preventDefault();
    if (u.pathname === location.pathname && u.hash) { var t = document.querySelector(u.hash); if (t) t.scrollIntoView(); history.replaceState(null, "", u.hash); return; }
    try { history.pushState(null, "", u.pathname + u.hash); render(u.hash); } catch (err) { location.href = u.href; }
  });
  window.addEventListener("popstate", function () { render(location.hash); });

  render(location.hash);

  // OAuth redirects land here with ?code=...; tell the person what to do, never show the code itself
  if (/[?&](code|error)=/.test(location.search)) {
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status");
    t.textContent = /[?&]error=/.test(location.search) ? "Login was cancelled or refused. Go back to the terminal and try again."
      : "Login finished. Copy the full address from the address bar and paste it into the terminal.";
    document.body.appendChild(t);
  }
})();
