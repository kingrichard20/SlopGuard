// ==UserScript==
// @name         SlopGuard
// @namespace    https://www.github.com/KingRichard20
// @version      2025-02-13
// @description  Hide YouTube Shorts recommendations and save time.
// @author       KingRichard20
// @match        https://www.youtube.com
// @match        https://www.youtube.com/shorts/*
// @match        https://www.youtube.com/watch*
// @run-at       document-start
// @icon         https://upload.wikimedia.org/wikipedia/commons/f/fc/Youtube_shorts_icon.svg
// @grant        none
// ==/UserScript==

// Information:

// -- Elements --
// Home page shorts panel tag name: ytd-rich-section-renderer
// Watch page shorts panel tag name: ytd-reel-shelf-renderer


(function () {
  'use strict';

  // Elements to remove
  const ShortsIconQueryHome = "yt-icon.style-scope.ytd-rich-shelf-renderer:not([hidden])";
  const ShortsIconQueryWatch = "yt-icon#icon.style-scope.ytd-reel-shelf-renderer:not([hidden])";

  const ShortsTagHomePage = "YTD-RICH-SHELF-RENDERER";
  const ShortsTagWatchPage = "YTD-REEL-SHELF-RENDERER";

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

  // If we directly visit a Shorts url, navigate to the home page.
  if (location.pathname.startsWith("/shorts")) {
    infoLog("Direct visit to Shorts, redirecting...");
    location.replace("/");
  }



  // Create observer
  const observer = new MutationObserver(function (_mutations, _obs) {

    const isWatching = location.pathname.startsWith("/watch");
    const isHome = location.pathname === "/";

    // No need to continue
    if (!isHome && !isWatching) {
      return;
    }

    const pageIconQuery = isWatching ? ShortsIconQueryWatch : ShortsIconQueryHome;
    const pageParentQuery = isWatching ? ShortsTagWatchPage : ShortsTagHomePage;
    const dbgPageName = isWatching ? "Watch" : "Home";

    // Get elements
    for (const elem of document.querySelectorAll(pageIconQuery)) {

      // Log
      infoLog(`${dbgPageName} page -`, "Shorts panel found, removing...");

      // Get parent and remove it
      const desiredParent = findParentElementByTag(elem, pageParentQuery);
      desiredParent.remove();
    }

  });


  // Start observer
  observer.observe(document, { childList: true, subtree: true });

})();