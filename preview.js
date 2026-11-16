(() => {
  "use strict";

  const passwordHash = "01d788e64b9077b5e4a4f05ab411cca1c0fe1a313685daef18f5f5397fdcf7d7";
  const sessionKey = "cicrstc-preview";
  const app = document.getElementById("app");
  const views = [
    ["home", "Homepage"],
    ["milestones", "Milestones of the RSTCS"],
    ["register", "Register of Specialist Trade Contractors"]
  ];
  const options = [
    ["a", "Building milestones", "hero-bridge-survey.webp"],
    ["b", "Pentagon milestones", "hero-option-a.jpg"]
  ];

  function openPreview() {
    if (new URLSearchParams(location.search).has("view")) {
      document.querySelector(".skip").hidden = false;
      const script = document.createElement("script");
      script.src = "prototype.js";
      document.head.append(script);
      return;
    }

    app.innerHTML = `<main class="preview-index">
      <h1>RSTCS Website Revamp</h1>
      <div class="preview-grid">${options.map(([key, title, photo]) => {
        const pageUrl = view => "index.html?view=" + view + "&theme=" + key;
        return `<section class="preview-option">
          <a class="preview-cover" href="${pageUrl("home")}" aria-label="Option ${key.toUpperCase()} homepage"><img src="assets/${photo}" alt=""></a>
          <h2><span>Option ${key.toUpperCase()}</span>${title}</h2>
          <ul>${views.map(([view,label]) => `<li><a href="${pageUrl(view)}">${label}<span class="preview-url"></span></a></li>`).join("")}</ul>
        </section>`;
      }).join("")}</div>
    </main>`;
    app.querySelectorAll(".preview-url").forEach(span => {
      span.textContent = span.parentElement.href;
    });
  }

  if (sessionStorage.getItem(sessionKey) === passwordHash) {
    openPreview();
  } else {
    app.innerHTML = `<main class="preview-lock">
      <form>
        <img src="assets/cic-color.svg" alt="Construction Industry Council">
        <label for="preview-password" class="visually-hidden">Password</label>
        <input id="preview-password" type="password" placeholder="Password" autocomplete="current-password" required>
        <button type="submit">Enter</button>
        <p role="status"></p>
      </form>
    </main>`;
    app.querySelector("form").addEventListener("submit", async event => {
      event.preventDefault();
      const field = document.getElementById("preview-password");
      const status = app.querySelector("[role=status]");
      const bytes = new TextEncoder().encode(field.value);
      const hash = await crypto.subtle.digest("SHA-256", bytes);
      const actual = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
      if (actual === passwordHash) {
        sessionStorage.setItem(sessionKey, actual);
        openPreview();
        return;
      }
      status.textContent = "Incorrect password.";
      field.select();
    });
  }
})();
