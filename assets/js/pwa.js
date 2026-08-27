"use strict";

(() => {
  const installButton = document.getElementById("pwa-install");
  let deferredInstallPrompt = null;

  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const hideInstallButton = () => {
    if (installButton) installButton.hidden = true;
  };

  const showInstallButton = () => {
    if (!installButton || isStandalone()) return;
    installButton.hidden = false;
    Object.assign(installButton.style, {
      position: "fixed",
      right: "max(14px, env(safe-area-inset-right))",
      bottom: "max(14px, env(safe-area-inset-bottom))",
      zIndex: "99999",
      border: "2px solid #e8b95f",
      borderRadius: "14px",
      padding: "10px 14px",
      background: "#082f3a",
      color: "#fff3c4",
      font: "800 14px system-ui, sans-serif",
      boxShadow: "0 5px 18px rgba(0,0,0,.3)",
      cursor: "pointer"
    });
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallButton();
  });

  installButton?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } finally {
      deferredInstallPrompt = null;
      hideInstallButton();
    }
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    hideInstallButton();
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
        registration.update().catch(() => {});
      } catch (error) {
        console.warn("Tiki Trail: service worker não pôde ser registrado.", error);
      }
    });
  }
})();
