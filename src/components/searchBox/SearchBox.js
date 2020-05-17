import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setSearchBoxQery } from '../../actions/navigation';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBox.scss';
import { Async } from 'react-select';
import { fetchApiRequest } from '../../fetch';
import {InternalServerError} from "../../exceptions/http";
import classes from "classnames";

class SearchBox extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      __query: {
        value: this.props.searchQery,
        label: this.props.searchQery,
      },
      options: null,
      input: '',
    };

    this.getOptions = this.getOptions.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  getOptions(input) {
    this.setState({input});
    return fetchApiRequest(`/v1/search/autocomplete?string=${input}`)
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then((data) => {
        // sorted data by alphabetical order
        data.sort((a, b) => a.length - b.length || a.localeCompare(b));

        const array = data.map(data => ({
          value: data,
          label: data
        }));

        return { options: array};
      });
  }

  handleChange(__query) {
    const {
      history,
      dispatch
    } = this.props;

    this.setState({ __query }, () => {
      if (__query) {
       dispatch(setSearchBoxQery(__query.value, true));
       history.push('/search');
      }
    });
  }

  onInputKeyDown (event) {
    const { dispatch, history } = this.props;
    const { input } = this.state;

    switch (event.keyCode) {
      case 13: // ENTER
        event.preventDefault();
        dispatch(setSearchBoxQery(input ? input : '', false));
        history.push('/search');
        break;
      case 8: // Backspace
        if (input) {
          this.setState({input: input.slice(0, -1)});
        }
        break;
      default:
        return null;
    }
  }

  render() {
    const { __query , input} = this.state;

    return (
      <form className={classes(
          'search',
         s.searchInput,
        )} onSubmit={this.onSubmit}>

        <Async
          value={__query}
          placeholder=""
          onChange={this.handleChange}
          loadOptions={this.getOptions}
          className={classes('search', {
            'select': input === '',
          })}
          optionClassName="needsclick"
          onCloseResetsInput
          onInputKeyDown={this.onInputKeyDown}
          deleteRemoves={false}
          searchable={true}
        />
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchQery: state.navigation.searchQery,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(SearchBox)));
