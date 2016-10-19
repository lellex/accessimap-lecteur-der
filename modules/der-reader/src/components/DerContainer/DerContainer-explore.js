const GESTURES = {
  'click': 'tap',
  'dblclick': 'double_tap'
}

var Explore = {

  /**
  * add event listener to DER elements
  * @param {HTMLElement} element
  * @param {Object} actions
  * @param {readAudioFile} tts
  * @param {Function} tts
  */
  setExploreEvents: function(params) {
    this.readFunction = params.readFunction;
    this.tts = params.tts;
    this.filter = params.filter;
    this.pois = [];
    this.actions = {};

    params.pois.map(function(poi) {
      var id = poi.id.split('-').pop();
      var elements = document.querySelectorAll('[data-link="' + id + '"]');

      Object.keys(elements).forEach((index) => {
        if (elements[index] !== undefined) {
          Explore.pois.push(elements[index]);
          Explore.actions[id] = poi.actions.action;
          Object.keys(GESTURES).map(function(gesture) {
            elements[index].addEventListener(gesture, Explore.initAction);
          });
        }
      });
    });
  },

  removeExploreEvents: function() {
    Explore.pois.map(function(poiEl) {
      Object.keys(GESTURES).map(function(gesture) {
        poiEl.removeEventListener(gesture, Explore.initAction);
      });
    });
  },

  initAction: function(event) {
    let element = event.target;
    let actions = Explore.actions[element.getAttribute('data-link')];
    let action = Explore._getAction(actions, event.type);

    // console.log(e);
    if (action !== undefined) {
      Explore._onEventStarted(element);

      if (action.protocol === 'mp3') {
        Explore.readFunction(action.value).then(function() {
          Explore._onEventEnded(element);
        });
      }

      if (action.protocol === 'tts') {
        Explore.tts.speak(action.value).then(function() {
          Explore._onEventEnded(element);
        });
      }
    }
  },

  _getAction: function(actions, type) {
    if (actions.length === undefined) {
      return actions;
    } else {
      for (var i = 0; i < actions.length; i++) {
        let a = actions[i];
        // console.log(a);
        if (this.filter) {
          if (a.filter === this.filter.id) {
            console.log('filter : ', this.filter);
            console.log(a);
            return a;
          }
        }
        // if (GESTURES[type] === a.gesture && a.protocol !== undefined) {
        //   return a;
        // }
      }
    }
    return;
  },

  _onEventStarted: function(element) {
    this.initialColor = element.style.fill;
    element.style.fill = 'red';
  },

  _onEventEnded: function(element) {
    element.style.fill = this.initialColor;
  }

};

module.exports = Explore;