import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "react-google-maps/lib/utils/MapChildHelper"

import { SEARCH_BOX } from "react-google-maps/lib/constants"


class Autocomplete extends React.PureComponent {
  static displayName = "Autocomplete"

  state = {
    [SEARCH_BOX]: null,
  };

  componentDidMount() {
    invariant(
      window.google.maps.places,
      `Did you include "libraries=places" in the URL?`
    )
    const element = ReactDOM.findDOMNode(this);

    const autocomplete = new window.google.maps.places.Autocomplete(
      element,
      this.props.restrictions
    )

    construct(Autocomplete.propTypes, updaterMap, this.props, autocomplete)

    componentDidMount(this, autocomplete, eventMap)
    this.setState({
      [SEARCH_BOX]: autocomplete,
    })
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[SEARCH_BOX],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
  }

  getBounds() {
    return this.state[SEARCH_BOX].getBounds()
  }

  getPlace() {
    return this.state[SEARCH_BOX].getPlace()
  }

  render() {
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
      let container = document.getElementsByClassName('pac-container')[0];

      if (container) {
        container.addEventListener('touchend', function (e) {
          e.stopImmediatePropagation();
        });
      }
    }
    return React.Children.only(this.props.children)
  }
}

export const StandaloneAutocomplete = Autocomplete

export default StandaloneAutocomplete

const eventMap = {
  onPlaceChanged: "place_changed",
};

const updaterMap = {};
