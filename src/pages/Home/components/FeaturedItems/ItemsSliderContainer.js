import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import ItemsSlider from './ItemsSlider';

class ItemsSliderContainer extends Component {
  static propTypes = {
    itemsList: PropTypes.array.isRequired,
    getListItemOnPopupComponentWillUnmount: PropTypes.func.isRequired,
    getListItemPopupActionButtons: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      popup: null,
    };
  }

  render() {
    const {
      itemsList,
      getListItemOnPopupComponentWillUnmount,
      getListItemPopupActionButtons,
    } = this.props;

    const {popup} = this.state;

    return (
      <ItemsSlider
        itemsList={itemsList}
        popup={popup}
        onPopupOpen={nextPopup => {
          this.setState({
            popup: nextPopup,
          });
        }}
        onPopupClose={() => {
          this.setState({
            popup: null,
          });
        }}
        getListItemOnPopupComponentWillUnmount={
          getListItemOnPopupComponentWillUnmount
        }
        getListItemPopupActionButtons={
          getListItemPopupActionButtons
        }
      />
    );
  }
}

export default ItemsSliderContainer;
