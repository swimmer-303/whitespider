/**
 * HexGL
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *          To view a copy of this license, visit <http://creativecommons.org/licenses/by-nc/3.0/>.
 */

var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.Ladder = {
  global: {},

  load: function (callback) {
    const url = encodeURIComponent(window.location.href);
    bkcore.Utils.request(
      "nothing",
      false,
      (req) => {
        try {
          bkcore.hexgl.Ladder.global = JSON.parse(req.responseText);
          if (callback) callback.call(window);
        } catch (e) {
          console.warn("Unable to load ladder.", e);
        }
      },
      { u: url }
    );
  },

  displayLadder: function (id, track, mode, num) {
    const d = document.getElementById(id);
    if (!d || !bkcore.hexgl.Ladder.global[track] || !bkcore.hexgl.Ladder.global[track][mode]) {
      console.warn("Undefined ladder.");
      return;
    }

    const ladder = bkcore.hexgl.Ladder.global[track][mode];
    const maxEntries = num !== undefined ? Math.min(num, ladder.length - 1) : 10;
    let html = "";
    for (let i = 0; i < maxEntries; i++) {
      const entry = ladder[i];
      const time = bkcore.Timer.msToTime(entry.score);
      html += `<span class="ladder-row"><b>${i + 1}. ${entry.name}</b><i>${time.m}':${time.s}"${time.ms}</i></span>`;
    }

    d.innerHTML = html;
  },
};
