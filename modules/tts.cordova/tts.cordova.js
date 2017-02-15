var cordovaTTS = {
  initUtterance: function(text) {
    const utterance = {locale: "", rate: 0, text: ""};
    utterance.locale = 'fr-FR';
    utterance.rate = 1;
    utterance.text = text;

    return utterance;
  },

  speak: function(text, pendingFunction) {

    return new Promise((resolve, reject) => {
      this.utterance = this.initUtterance(text);
      pendingFunction;
      window.TTS.speak(this.utterance, () => {
        resolve();
      });
    });
  }
};
