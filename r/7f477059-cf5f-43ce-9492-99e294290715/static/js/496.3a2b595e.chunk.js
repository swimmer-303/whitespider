"use strict";

// Util functions
const getPerformanceEntry = (entryType) =>
  window.performance.getEntriesByType(entryType)[0];

const isPerformanceObserverSupported = (entryType) =>
  window.PerformanceObserver &&
  window.PerformanceObserver.supportedEntryTypes.includes(entryType);

const createPerformanceObserver = (entryType, callback) => {
  if (!isPerformanceObserverSupported(entryType)) return;

  const observer = new PerformanceObserver((list) => {
    Promise.resolve().then(() => callback(list.getEntries()));
  });

  observer.observe({ type: entryType, buffered: true });

  return observer;
};

const createPerformanceEntryUpdater = (metricName, thresholds, reportAllChanges) => {
  let previousEntry = null;
  let observer = null;

  return (onUpdate) => {
    if (previousEntry) {
      previousEntry.delta = metricName.value - (previousEntry.value || 0);
      previousEntry.rating = getRating(metricName.value, thresholds);
    }

    previousEntry = { ...metricName };

    observer = createPerformanceObserver(
      "paint",
      (entries) => {
        const matchingEntry = entries.find(
          (entry) => entry.name === metricName.name
        );

        if (matchingEntry) {
          onUpdate(matchingEntry);
        }
      },
      { type: "paint", buffered: true }
    );
  };
};

const getRating = (value, thresholds) => {
  if (value < thresholds[0]) return "poor";
  if (value < thresholds[1]) return "needs-improvement";
  return "good";
};

// Metrics
const firstContentfulPaint = createPerformanceEntryUpdater(
  { name: "first-contentful-paint", value: -1 },
  [1800, 3000],
  true
);

const largestContentfulPaint = createPerformanceEntryUpdater(
  { name: "largest-contentful-paint", value: -1 },
  [2500, 4000],
  true
);

const firstInputDelay = createPerformanceEntryUpdater(
  { name: "first-input-delay", value: -1 },
  [100, 300],
  true
);

const cumulativeLayoutShift = createPerformanceEntryUpdater(
  { name: "cumulative-layout-shift", value: 0 },
  [0.1, 0.25],
  true
);

const timeToFirstByte = createPerformanceEntryUpdater(
  { name: "time-to-first-byte", value: -1 },
  [800, 1800],
  true
);

// Initialization
const initMetrics = () => {
  firstContentfulPaint((entry) => {
    console.log("FCP: ", entry);
  });

  largestContentfulPaint((entry) => {
    console.log("LCP: ", entry);
  });

  firstInputDelay((entry) => {
    console.log("FID: ", entry);
  });

  cumulativeLayoutShift((entry) => {
    console.log("CLS: ", entry);
  });

  timeToFirstByte((entry) => {
    console.log("TTFB: ", entry);
  });
};

// Run the metrics
if ("complete" === document.readyState) {
  initMetrics();
} else {
  window.addEventListener("load", initMetrics);
}
