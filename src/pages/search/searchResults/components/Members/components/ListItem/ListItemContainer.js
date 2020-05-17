import React, { Component } from 'react';
import slugify from 'slugify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ListItem from './ListItem';

class ListItemContainer extends Component {

  static defaultProps = {
    showOwnerDetails: true,
    actionButtons: () => [],
  };

  componentWillUnmount() {
    const { onComponentWillUnmount } = this.props;

    if (onComponentWillUnmount instanceof Function) {
      onComponentWillUnmount(this);
    }
  }

  render() {
    const {
      data,
      onPopupComponentWillUnmount,
      showOwnerDetails,
      viewMode,
      actionButtons,
      className,
      history,
    } = this.props;

    return (
      <ListItem
        viewMode={viewMode}
        data={data}
        onPopupComponentWillUnmount={onPopupComponentWillUnmount}
        showOwnerDetails={showOwnerDetails}
        actionButtonsList={actionButtons(this)}
        className={className}
        redirectToUserProfile={() =>
          history.push(`/member/${slugify(data.fullName)}-${data.id}`)
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(ListItemContainer));
