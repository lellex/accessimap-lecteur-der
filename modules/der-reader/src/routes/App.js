import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import DerContainer from './../components/DerContainer/DerContainer.js';
import Message from './../components/Message/Message.js';
import Button from './../components/Button/Button.js';
import Loader from './../components/Loader/Loader.js';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.route.config.defaultMode,
      searchableElement: null,
      openedMenu: ''
    }
  }

  componentWillMount() {
    this.props.setOption('tts', this.props.route.config.tts);
    this.props.setOption('exit', {fn: this.props.route.config.exit});
    this.props.initConfig({format: this.props.route.config.format || this.props.config.format});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes[nextProps.routes.length-1].path === 'file') {
      this.context.router.push('/menu');
    }
  }

  toggleMenu(id, labelOnClose, labelOnOpen) {
    let open = this.state.openedMenu === id;
    this.setState({
      openedMenu: open ? '' : id
    }, () => {
      if (open && labelOnClose) {
        hashHistory.push('/');
        this.read(labelOnClose);
      } else if (labelOnOpen) {
        hashHistory.push(id);
        this.read(labelOnOpen);
      }
    });
  }

  showMessage(text, type) {
    this.props.setMessage({text: text, type: type});
    this.read(text);
  }

  changeDerFile(file) {
    if (file !== null) {
      this.props.isLoading(true);
      this.context.router.push('/');
      this.read('Chargement du document').then(() => {
        this.toggleMenu('menu');
        this.props.setDerFile(file);
        this.props.isLoading(false);
      });
    } else {
      this.read('Aucun fichier sélectionné, retour au menu');
      this.context.router.push('/menu');
    }
  }

  changeMode(mode) {
    this.setState({mode: mode});
  }

  setSearchableElement(searchableElement) {
    this.setState({searchableElement: searchableElement});
  }

  getMessage() {
    const {message} = this.props;
    if (message) {
      return <Message text={message.text} type={message.messageType} />
    }
  }

  read(text) {
    if (this.props.config.tts) {
      return this.props.config.tts.speak(text)
    }
  }

  render() {
    const { mode, searchableElement } = this.state;
    const { config, der, selectedDocument, derFile, activeFilter } = this.props;
    let navigation;
    if (this.props.children) {
      navigation = React.cloneElement(this.props.children, {
        config: config,
        options: {
          der, selectedDocument, derFile, activeFilter
        },
        actions: {
          toggleMenu: this.toggleMenu.bind(this),
          showMessage: (text, type) => this.showMessage(text, type),
          setFilesList: files => this.props.setFilesList(files),
          setDer: der => this.props.setDer(der),
          changeDerFile: file => this.changeDerFile(file),
          changeDocument: this.changeDocument,
          changeMode: this.changeMode,
          changeFilter: filter => this.props.setFilter(filter),
          setSearchableElement: this.setSearchableElement,
          setOptionFormat: (format) => this.props.setOptionFormat(format)
        }
      });
    }

    if (this.props.loading || !this.props.config.tts) {
      return <Loader/>;
    }
    return (
      <div className="container" ref="app">
        <Button
          id="menu"
          config={config}
          labelClosed="Menu"
          labelOnClose="Fermeture du menu"
          labelOpened="Fermer le menu"
          labelOnOpen="Ouverture du menu"
          open={this.state.openedMenu === 'menu'}
          toggleMenu={this.toggleMenu.bind(this)}
           />
        <Button
          id="filters"
          config={config}
          labelClosed="Filtres"
          labelOnClose="Fermeture des filtres"
          labelOpened="Fermer les filtres"
          labelOnOpen="Ouverture des filtres"
          open={this.state.openedMenu === 'filters'}
          toggleMenu={this.toggleMenu.bind(this)}
          />
          
        {this.getMessage()}

        <DerContainer
          setFilesList={files => this.props.setFilesList(files)}
          setDer={der => this.props.setDer(der)}
          der={der}
          selectedDocument={selectedDocument}
          searchableElement={searchableElement}
          message={(text, type) => this.showMessage(text, type)}
          tts={config.tts}
          mode={mode}
          filter={activeFilter}
          derFile={derFile} />

        { navigation || '' }

      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default App;