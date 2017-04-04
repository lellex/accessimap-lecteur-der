import React from 'react';
import Navigation from '../../../components/Navigation/Navigation.js';
import CalibrateCanvas from './Calibrate';

const formats = ['A3', 'A4', 'A5', undefined]; // Last item is undefined for return button

var CalibrateMenu = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      calibrateMode: false,
      totemMarker: null,
      defaultFormat: this.props.config.format,
      index: formats.indexOf(this.props.config.format)
    };
  },

  componentDidMount: function() {
    this.read(`Veuillez sélectionner le format utilisé pour calibrer l\'écran. Format ${this.props.config.format}`);
  },

  setTotem: function(o) {
    this.setState({totemMarker: o});
  },

  handleAction: function() {
    const format = this.props.config.format;
    const index = formats.indexOf(format);
    let path = this.props.route.childRoutes[index].path;

    if (path === 'back') {
      this.props.actions.toggleMenu('menu', 'Fermeture du menu');
    }
    else if (format) {
      this.setState({calibrateMode: true});
      switch(format) {
        case 'A3':
          this.setTotem({w:42.0/2.54,h:29.7/2.54, name: 'A3'});
          break;
        case 'A4':
          this.setTotem({w:29.7/2.54,h:21.0/2.54, name: 'A4'});
          break;
        case 'A5':
          this.setTotem({w:21.0/2.54,h:14.8/2.54, name: 'A5'});
          break;
        default:
          break;
      }
    } else {
      this.context.router.push('menu/calibrate/' + path);
    }
  },

  changeActiveMenu: function(index) {
    const format = this.props.route.childRoutes[index].format;
    if (format) {
      this.props.actions.setOptionFormat(format);
    } else {
      this.props.actions.setOptionFormat(this.state.defaultFormat);
    }
    this.setState({index: index});
  },

  read: function(text) {
    this.props.options.tts.speak(text);
  },

  render: function() {
    if (this.state.calibrateMode) {
      return (
        <CalibrateCanvas totemMarker={this.state.totemMarker}></CalibrateCanvas>
      );
    }
    return (
      <Navigation
        action={this.handleAction}
        index={this.state.index}
        items={this.props.route.childRoutes}
        changeIndex={this.changeActiveMenu}
        read={this.read}
        >
      </Navigation>
    );
  }
});

module.exports = CalibrateMenu;