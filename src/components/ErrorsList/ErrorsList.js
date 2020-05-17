import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorsList.scss';

class ErrorsList extends React.Component {
  static propTypes = {
    messages: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.string
      ),
      PropTypes.object,
    ]).isRequired,
  };

  mapListItemsFromArray(messages) {
    return messages.map((message, i) => (
      <li key={ i }>{ message }</li>
    ));
  }

  extractArrayFromObject(messages) {
    let items = [];
    Object.values(messages).forEach(message => {
      items.push(...message);
    });

    return items;
  }

  getListItems() {
    const { messages } = this.props;

    return this.mapListItemsFromArray(
      messages instanceof Array
        ? messages
        : this.extractArrayFromObject(
          messages
        )
    );
  }

  render() {
    return (
      <ul className={s.root}>
        { this.getListItems() }
      </ul>
    );
  }
}

export default withStyles(s)(ErrorsList);
