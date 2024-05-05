"use strict";

function notSupported(message) {
  const notSupportedWrap = document.createElement("div");
  notSupportedWrap.id = "notSupportedWrap";
  document.body.appendChild(notSupportedWrap);

  const notSupportedTitle = document.createElement("h2");
  notSupportedTitle.id = "notSupportedTitle";
  notSupportedTitle.textContent = message.title;
  notSupportedWrap.appendChild(notSupportedTitle);

  const notSupportedMessage = document.createElement("p");
  notSupportedMessage.className = "notSupportedMessage";
  notSupportedMessage.innerHTML = message.content + "<br><br><em>" + message.details + "</em>";
  notSupportedWrap.appendChild(notSupportedMessage);
}

function getMessage(reasons, isKaspersky) {
  const userAgent = navigator.userAgent;

  if (isKaspersky) {
    return {
      title: "Kaspersky Internet Security broke this export",
      content: "It appears a script was added to this export by Kaspersky software. This prevents the exported project from working. Try disabling Kaspersky and exporting again.",
      details: `Missing features: ${reasons.join(", ")}; User agent: ${userAgent}`
    };
  }

  if (/android/i.test(userAgent)) {
    return {
      title: "Software update needed",
      content: "This content is not supported because your device's software is out-of-date. On Android, fix this by making sure the <a href='https://play.google.com/store/apps/details?id=com.google.android.webview'>Android System Webview</a> app has updates enabled and is up-to-date.",
      details: `Missing features: ${reasons.join(", ")}; User agent: ${userAgent}`
    };
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return {
      title: "Software update needed",
      content: "This content is not supported because your device's software is out-of-date. Note: using the <strong>iOS simulator</strong> requires <strong>Xcode 12+</strong>. Otherwise try testing on a real device instead.",
      details: `Missing features: ${reasons.join(", ")}; User agent: ${userAgent}`
    };
  }

  if (!/msie/i.test(userAgent) && !/trident/i.test(userAgent) || /edge\//i.test(userAgent)) {
    return {
      title: "Software update needed",
      content: isKaspersky ? "Try installing any available software updates. Alternatively try on a different device." : "This content is not supported because your device's software is out-of-date. Try installing any available software updates. Alternatively try on a different device.",
      details: `Missing features: ${reasons.join(", ")}; User agent: ${userAgent}`
    };
  }

  return {
    title: "Software not supported",
    content: isKaspersky ? "This content is not supported because your device's software is out-of-date. Try installing any available software updates. Alternatively try on a different device." : "This content is not supported. Note: <strong>Internet Explorer</strong> is not supported. Try using <a href='https://www.google.com/chrome'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a> instead.",
    details: `Missing features: ${reasons.join(", ")}; User agent: ${userAgent}`
  };
}

function checkSupport() {
  const reasons = [];
  const canvas = document.createElement("canvas");

  if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")) {
    reasons.push("WebGL");
  }

  if (typeof WebAssembly === "undefined") {
    reasons.push("WebAssembly");
  }

  if ("noModule" in HTMLScriptElement.prototype) {
    reasons.push("JavaScript Modules");
  }

  const isKaspersky = !!document.querySelector('script[src*="kaspersky"]');

  if (reasons.length > 0 || isKaspersky) {
    const message = getMessage(reasons, isKaspersky);
    notSupported(message);
  } else {
    window.C3_IsSupported = true;
  }
}

checkSupport();

