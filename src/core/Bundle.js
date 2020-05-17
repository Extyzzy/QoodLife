import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from '../components/Loader';

class Bundle extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  };

  static generateBundle = loadModule => () => (
    /* eslint-disable */
    <Bundle load={loadModule}>
      { Mod => Mod ? <Mod /> : <Loader /> }
    </Bundle>
    /* eslint-enable */
  );

  constructor(props, context) {
    super(props, context);

    this.state = {
      // short for "module" but that's a keyword in js, so "mod"
      mod: null,
    };
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { load: nextLoad } = nextProps;
    const { load } = this.props;

    if (nextLoad !== load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      mod: null,
    });

    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    const { children } = this.props;
    const { mod } = this.state;

    return children(mod);
  }
}

export default Bundle;
