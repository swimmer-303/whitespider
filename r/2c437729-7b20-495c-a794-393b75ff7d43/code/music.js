/*
* using cross platform MIDI library MIDI.js <http://www.midijs.net/>
*/

const midiFiles = {
  title: "midi/title.mid",
  map: "midi/map.mid",
  background: "midi/background.mid",
  overground: "midi/overground.mid",
  underground: "midi/underground.mid",
  castle: "midi/castle.mid",
};

const DEFAULT_MIDI_FILE = Object.keys(midiFiles)[0];

Mario.PlayMusic = function (name = DEFAULT_MIDI_FILE) {
  if (midiFiles.hasOwnProperty(name)) {
    MIDIjs.stop();
    MIDIjs.play(midiFiles[name])
      .catch((error) => console.error(`Error playing music track ${name}:`, error));
  } else {
    console.error(`Cannot play music track ${name} as I have no data for it.`);
  }
};

Mario.PlayTitleMusic = function () {
  Mario.PlayMusic("title");
};

Mario.PlayMapMusic = function () {
  Mario.PlayMusic("map");
};

Mario.PlayOvergroundMusic = function () {
  Mario.PlayMusic("background");
};

Mario.PlayUndergroundMusic = function () {
  Mario.PlayMusic("underground");
};

Mario.PlayCastleMusic = function () {
  Mario.PlayMusic("castle");
};

Mario.StopMusic = function () {
  MIDIjs.stop();
};
