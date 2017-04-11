'use strict';

window.DerReader.init({
  container: 'der-reader',
  derFile: null,
  tts: window.webspeechapi,
  defaultMode: 0,
  format: 'A5',
  exit: exit
});

document.body.style.background = "red";