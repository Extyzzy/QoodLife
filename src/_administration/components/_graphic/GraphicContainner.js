import React, { Component } from 'react';
import s from './Graphic.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { SilencedError } from "../../../exceptions/errors";
import { connect } from 'react-redux';
import Graphic from './Graphic';
import moment from 'moment';
import {
  fetchAuthorizedApiRequest,
} from '../../../fetch';
import ID from '../../../helpers/ID';

class GraphicProducts extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: null,
      isFetching: false,
      selectedOption: 'week',
    };
  }

  componentDidMount() {
      this.getData();
  }

  componentWillUnmount() {
    if (this.Fetcher instanceof Promise) {
      this.Fetcher.cancel();
    }
  }

  getData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.Fetcher = Promise.all([
        dispatch(
          fetchAuthorizedApiRequest(this.switchInterval(), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        )
          .then(response => {
            switch (response.status) {
              case 200:

                return response.json();

              default:

                return Promise.reject(
                  new SilencedError('Failed to fetch reports.')
                );
            }
          })
      ])
    .then(data => {
      this.setState({
        data,
        isFetching: false,
      });
    }, () => {
      this.setState({
        isFetching: false,
      })
    });
    })
  }

  switchInterval() {
    const startWeek = moment().subtract(1, 'week').utc().format('YYYY.MM.DD');

    const endWeek = moment().utc().format('YYYY.MM.DD');

    const startMonth = moment().subtract(1, 'month').utc().format('YYYY.MM.DD');

    const endMonth = moment().utc().format('YYYY.MM.DD');

    switch (this.state.selectedOption) {
      case 'week':
        return `/v1/${this.props.route}/reports/created-per-day?from=${startWeek}&to=${endWeek}`;

      default:
        return `/v1/${this.props.route}/reports/created-per-day?from=${startMonth}&to=${endMonth}`
    }
  }

  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    }, () => {
      this.getData();
    });
  }

  render() {
    const {
      data,
      isFetching,
      selectedOption,
    } = this.state;

    const {
      route,
    } = this.props;

    if ( ! data) {
      return null;
    }

    const dataArray = Object.keys(data[0].list).map(k => ({name: k, count: data[0].list[k]}));

    return(
        <Graphic
          selectedOption={selectedOption}
          handleOptionChange={this.handleOptionChange.bind(this)}
          name={route}
          id1={ID()}
          id2={ID()}
          data={dataArray}
          isFetching={isFetching}
        />
    )
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
  };
}

export default (connect(mapStateToProps)(withStyles(s)(GraphicProducts)));
