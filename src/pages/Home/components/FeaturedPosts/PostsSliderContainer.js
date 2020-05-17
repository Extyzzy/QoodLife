import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import PostsSlider from './PostsSlider';

class PostsSliderContainer extends Component {
  static propTypes = {
    postsList: PropTypes.array.isRequired,
    onPopupComponentWillUnmount: PropTypes.func.isRequired,
    popupActionButtons: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      popup: null,
    };
  }

  render() {
    const {
      postsList,
      onPopupComponentWillUnmount,
      popupActionButtons,
    } = this.props;

    const { popup } = this.state;

    return (
      <PostsSlider
        postsList={postsList}
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
        onPopupComponentWillUnmount={
          onPopupComponentWillUnmount
        }
        popupActionButtons={
          popupActionButtons
        }
      />
    );
  }
}

export default PostsSliderContainer;
