import React, { Component } from 'react';
import { withRouter } from 'react-router';
import View from './View';

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    return (
      <View />
    );
  }
}

export default withRouter(Container);
