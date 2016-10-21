const React = require('react');
const Navigation = require('./../../components/Navigation/Navigation.js');

const Menu = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      activeMenu: 0
    };
  },

  handleAction: function() {
    console.log('Menu handleAction');
    if (this.props.route.childRoutes[this.state.activeMenu].path === 'quit') {
      this.props.options.exit();
    }
    else {
      this.context.router.push('menu/' + this.props.route.childRoutes[this.state.activeMenu].path);
    }
  },

  changeActiveMenu: function(index) {
    this.setState({activeMenu: index});
  },

  read: function(text) {
    this.props.options.tts.speak(text);
  },

  render: function() {
    return (
      <Navigation
        action={this.handleAction}
        read={this.read}
        index={this.state.activeMenu}
        items={this.props.route.childRoutes}
        changeIndex={this.changeActiveMenu}
        >
      </Navigation>
    );
  }
});

module.exports = Menu;
