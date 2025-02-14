// ==UserScript==
// @name         SlopGuard
// @namespace    https://www.github.com/KingRichard20
// @version      1.1.0
// @description  Hide YouTube Shorts recommendations and save time.
// @author       KingRichard20
// @match        https://www.youtube.com
// @match        https://www.youtube.com/shorts/*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/results*
// @run-at       document-start
// @icon         https://upload.wikimedia.org/wikipedia/commons/f/fc/Youtube_shorts_icon.svg
// @downloadURL  https://raw.githubusercontent.com/kingrichard20/SlopGuard/refs/heads/main/slopguard.js
// @updateURL    https://raw.githubusercontent.com/kingrichard20/SlopGuard/refs/heads/main/slopguard.js
// @grant        none
// ==/UserScript==


// Could we just replace this with CSS that hides the panels?
(function () {
  'use strict';

  // Elements to target orremove
  const ShortsIconQueryHome = "yt-icon.style-scope.ytd-rich-shelf-renderer:not([hidden])";
  const ShortsIconQueryWatch = "yt-icon#icon.style-scope.ytd-reel-shelf-renderer:not([hidden])";
  const ShortsParentHomePage = "YTD-RICH-SHELF-RENDERER";
  const ShortsParentWatchPage = "YTD-REEL-SHELF-RENDERER";

  // Logging
  function infoLog(...args) {
    console.log("[SlopGuard]", ...args);
  }

  // Element traversal
  /**
   *
   * @param {HTMLElement} elem The target element
   * @param {string} tagName Upper-case
   */
  function findParentElementByTag(elem, tagName) {

    if (elem === null || elem.tagName === tagName) {
      return elem;
    }

    return findParentElementByTag(elem.parentElement, tagName);
  }

  // Element clearing
  /**
   *
   * @param {string} iconQuery
   * @param {string} parentQuery
   * @param {string} logName
   */
  function clearElements(iconQuery, parentQuery, logName) {
    // Get elements
    for (const elem of document.querySelectorAll(iconQuery)) {

      // Log
      infoLog(`${logName} page -`, "Shorts panel found, removing...");

      // Get parent and remove it
      const desiredParent = findParentElementByTag(elem, parentQuery);
      desiredParent.remove();
    }
  }



  // Create observer
  const observer = new MutationObserver(function (_mutations, _obs) {

    switch (location.pathname) {

      // Home
      case "/":
        clearElements(ShortsIconQueryHome, ShortsParentHomePage, "Home");
        break;

      // Watch
      case "/watch":
        // clearElements(ShortsIconQueryWatch, ShortsParentWatchPage, "Watch");

        // Removes both "Shorts" and "Shorts remixing this video" panels
        for (const elem of document.getElementsByTagName(ShortsParentWatchPage)) {
          infoLog(`Watch page -`, "Shorts panel found, removing...");
          elem.remove();
        }
        break;

      // Search results
      case "/results":
        clearElements(ShortsIconQueryWatch, ShortsParentWatchPage, "Search");
        break;

      default:
        break;
    }

  });



  // If we directly visit a Shorts url, navigate to the home page.
  if (location.pathname.startsWith("/shorts")) {
    infoLog("Direct visit to Shorts, redirecting...");
    location.replace("/");
  }

  // Start observer
  observer.observe(document, { childList: true, subtree: true });

})();
