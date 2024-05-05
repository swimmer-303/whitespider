interface LatencyInfo {
  region: string;
  regionLatency: number;
  estimation: {
    [region: string]: number[];
  };
}

interface RegionEstimation {
  region: string;
  latency: number;
}

export declare function getAutoRegion(
  onLatencyUpdate: (regions: RegionEstimation[]) => void
): Promise<LatencyInfo>;

// Usage example:
(async () => {
  const regions = await getAutoRegion((regions) => {
    console.log("Latency updates:", regions);
  });

  console.log("Selected region:", regions.region);
  console.log("Region latency:", regions.regionLatency);
  console.log("Estimation:", regions.estimation);
})();
