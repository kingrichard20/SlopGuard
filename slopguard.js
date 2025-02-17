// ==UserScript==
// @name         SlopGuard
// @namespace    https://www.github.com/KingRichard20
// @version      1.2.0
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

  /* Elements to target or remove */

  // Shorts can show up in search results
  const ShortsResultQuery = "div.badge-shape-wiz__text";
  const ShortsResultTag = "YTD-VIDEO-RENDERER";

  const ShortsIconQueryHome = "yt-icon.style-scope.ytd-rich-shelf-renderer:not([hidden])";
  const ShortsIconQueryWatch = "yt-icon#icon.style-scope.ytd-reel-shelf-renderer:not([hidden])";

  const ShortsParentTagHome = "YTD-RICH-SHELF-RENDERER";
  const ShortsParentTagWatch = "YTD-REEL-SHELF-RENDERER";

  // Logging
  function infoLog(...args) {
    console.log("[SlopGuard]", ...args);
  }

  // Document traversal
  /**
   *
   * @param {HTMLElement} elem The target element
   * @param {string} tagName Upper-case parent tag name
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
   * @param {string} hallmarkQuery
   * @param {string} parentTag
   * @param {(e: Element) => boolean} elemCheck
   * @param {string} logName
   */
  function clearElementsCheck(hallmarkQuery, parentTag, elemCheck, logName) {

    // Get elements
    for (const elem of document.querySelectorAll(hallmarkQuery)) {

      if (!elemCheck(elem)) {
        continue;
      }

      // Log
      infoLog(`${logName} page -`, "Shorts found, removing...");

      // Get parent and remove it
      const parentElem = findParentElementByTag(elem, parentTag);

      parentElem.remove();
    }
  }
  /**
   *
   * @param {string} hallmarkQuery
   * @param {string} parentTag
   * @param {string} logName
   */
  function clearElements(hallmarkQuery, parentTag, logName) {
    // Get elements
    for (const elem of document.querySelectorAll(hallmarkQuery)) {

      // Log
      infoLog(`${logName} page -`, "Shorts found, removing...");

      // Get parent and remove it
      const parentElem = findParentElementByTag(elem, parentTag);

      if (parentElem === null) {
        continue;
      }

      parentElem.remove();
    }
  }




  // Create observer
  const observer = new MutationObserver(function (_mutations, _obs) {

    switch (location.pathname) {

      // Home
      case "/":
        clearElements(ShortsIconQueryHome, ShortsParentTagHome, "Home");
        break;

      // Watch
      case "/watch":

        // Removes both "Shorts" and "Shorts remixing this video" panels
        for (const elem of document.getElementsByTagName(ShortsParentTagWatch)) {
          infoLog(`Watch page -`, "Shorts found, removing...");
          elem.remove();
        }
        break;

      // Search results
      case "/results":
        clearElements(ShortsIconQueryWatch, ShortsParentTagWatch, "Search");

        // Removes Shorts found in search results
        clearElementsCheck(ShortsResultQuery, ShortsResultTag, (el => el !== null && el.textContent === "SHORTS"), "Search");
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

  // There are cases where the Shorts panel may still show in search results (causes are unknown)
  // Let's use this as a temporary fix
  window.addEventListener("yt-page-data-updated", () => {
    if (location.pathname.startsWith("/shorts")) {
      infoLog("Somehow arrived at Shorts, going back...");
      history.back();
    }
  });

})();