css = """<style id="smart-header-css">
.site-header { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; position: sticky !important; top: 0 !important; z-index: 9999 !important; background: rgba(255, 255, 255, 0.95) !important; }
.site-header.header-hidden { transform: translateY(-100%) !important; }
html { scroll-behavior: smooth !important; }
::selection { background: #05a88a !important; color: #ffffff !important; }
::-moz-selection { background: #05a88a !important; color: #ffffff !important; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(5,168,138,0.4); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(5,168,138,0.8); }
</style>"""

with open("index.html", "r") as f: h = f.read()
if "smart-header-css" not in h:
    h = h.replace("</head>", css + "\n</head>")
    with open("index.html", "w") as f: f.write(h)

js_code = """
  const topHeader = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (!topHeader || state.drawerOpen) return;
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      topHeader.classList.add("header-hidden");
    } else {
      topHeader.classList.remove("header-hidden");
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
})();"""

with open("app.js", "r") as f: app_js = f.read()
if "header-hidden" not in app_js:
    app_js = app_js.replace("})();", js_code)
    with open("app.js", "w") as f: f.write(app_js)

print("Done")
