// ==UserScript==
// @name         Traderie Price Check average value
// @namespace    http://tampermonkey.net/
// @version      2025-05-11
// @description  Check the average value of items on Traderie
// @author       You
// @match        https://traderie.com/diablo2resurrected/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=traderie.com
// @grant        none
// ==/UserScript==

const CURRENCY_VALUES = {
  "Perfect Amethyst": 1,
  "Lem Rune": 2,
  "Pul Rune": 5,
  "Um Rune": 10,
  "Mal Rune": 15,
  "Ist Rune": 20,
  "Gul Rune": 40,
  "Vex Rune": 60,
  "Ohm Rune": 80,
  "Lo Rune": 120,
  "Sur Rune": 140,
  "Ber Rune": 200,
  "Jah Rune": 360,
  "Cham Rune": 100,
  "Zod Rune": 160,
};

window.lastAverageValue = null;

const scanPage = () => {
  const listings = Array.from(
    document.querySelectorAll(".listing-product-info")
  );

  let totalValue = 0;
  let effectiveCount = 0;

  listings.forEach((productInfo) => {
    if (productInfo.dataset.price_checked) {
      return;
    }

    productInfo.dataset.price_checked = true;

    let priceGroupValue = 0;

    const priceLines = Array.from(productInfo.querySelectorAll(".price-line"));

    priceLines.forEach((line, index) => {
      const lineText = line.textContent;

      const match = lineText.split(" X ");

      if (match.length < 2) {
        return;
      }

      const quantity = parseInt(match[0], 10);
      let currency = match[1].replace("(each)", "");

      let orLine = false;

      if (currency.includes("OR")) {
        orLine = true;
        currency = currency.replace("OR", "");
      }

      const value = quantity * CURRENCY_VALUES[currency.trim()];

      // Unsupported trade items
      if (isNaN(value)) {
        return;
      }

      line.textContent += ` (${value})`;

      priceGroupValue += value;

      if (orLine || index === priceLines.length - 1) {
        line.textContent += ` (total: ${priceGroupValue})`;
        priceGroupValue = 0;
      }
    });
  });
};

setInterval(scanPage, 1000);
