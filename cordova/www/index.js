function exit() {
    navigator.app.exitApp()
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        window.DerReader.init({
          container: 'der-reader',
          derFile: null,
          tts: window.cordovaTTS,
          vibrate: window.vibrateCordova,
          defaultMode: 0,
          format: 'A5',
          exit: exit
        });

    }
};

app.initialize();
