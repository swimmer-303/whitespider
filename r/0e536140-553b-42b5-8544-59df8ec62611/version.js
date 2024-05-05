const version = "6";
const libs = [
  { name: "phaser-ads", version: "2.2" },
  { name: "phaser-cachebuster", version: "2.0" },
  { name: "phaser-input", version: "2.0" },
  { name: "phaser-nineslice", version: "2.0" },
  { name: "phaser-spine", version: "3.0" },
  { name: "phaser-super-storage", version: "1.0" },
  { name: "splash", version: "3.5" },
];

const baseUrl = "https://cdn.jsdelivr.net/npm/@orange-games/";

const libUrls = libs.map(lib => `${baseUrl}${lib.name}@${lib.version}/build/${lib.name}.min.js`);

console.log("version:", version);
console.log("libraries:", libUrls);

