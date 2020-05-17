import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import moment from 'moment';

import ID from '../../../../helpers/ID';
import FilterGenerator from './FilterGenerator';

class FilterGeneratorContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf([
          'input',
          'date',
          'select',
          'check',
        ]).isRequired,
        params: PropTypes.shape({
          inputType: PropTypes.oneOf([
            'text',
            'number',
          ]),
          inputPlaceholder: PropTypes.string,
          selectOptions: PropTypes.arrayOf(
            PropTypes.shape({
              value: PropTypes.oneOfType([
                PropTypes.string.isRequired,
                PropTypes.number.isRequired,
              ]).isRequired,
              label: PropTypes.string.isRequired,
            })
          ),
          multipleSelect: PropTypes.bool,
          dateFormat: PropTypes.string,
          checkboxLabel: PropTypes.string,
        }),
      })
    ).isRequired,
    filterData: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      list: [],
    };

    this.toggle = this.toggle.bind(this);
    this.getFiltersList = this.getFiltersList.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeFilterValue = this.changeFilterValue.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
    this.addNewFilter = this.addNewFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  getFiltersList(id) {
    return this.props.filters.filter(({name}) => (
      ! this.state.list.find(i => i.id !== id && i.name === name)
    )).map(({name: value, label}) => ({ value, label }));
  }

  toggle() {
    this.setState({
      open: ! this.state.open,
    });
  }

  getDefaultFilterValue(type) {
    switch(type) {
      case 'date':

        return {
          since: null,
          until: null,
        };

      case 'check':

        return + false;

      default:

        return null;
    }
  }

  changeFilter(id, v) {
    const itemIndex = this.state.list.findIndex(i => (
      i.id === id && i.name !== (v && v.value)
    ));

    if (itemIndex === -1) {
      return;
    }

    const data = (v && this.props.filters.find(({name}) => (
      name === v.value
    ))) || {};

    this.setState({
      list: update(this.state.list, {
        [itemIndex]: {
          $apply: item => update(item, {
            name: {
              $set: v && v.value,
            },
            value: {
              $set: this.getDefaultFilterValue(data.type),
            },
            data: {
              $set: data,
            },
          }),
        },
      }),
    });
  }

  changeFilterValue(id, v) {
    const itemIndex = this.state.list
      .findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return;
    }

    this.setState({
      list: update(this.state.list, {
        [itemIndex]: {
          $apply: item => update(item, {
            value: {
              $set: v,
            },
          }),
        },
      }),
    });
  }

  deleteFilter(id) {
    const itemIndex = this.state.list
      .findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return;
    }

    this.setState({
      list: update(this.state.list, {
        $splice: [[itemIndex, 1]]
      }),
    });
  }

  addNewFilter() {
    this.setState({
      list: [
        ...this.state.list,
        {
          id: ID(),
          name: null,
          value: null,
          data: {},
        },
      ],
    });
  }

  applyFilter() {
    let filter = {};
    this.state.list.forEach(({name, value, data: {type}}) => {
      switch (type) {
        case 'date':

          filter[name] = {
            since: value && value.since instanceof moment
              ? value.since.utcOffset(0).unix() : null,
            until: value && value.until instanceof moment
              ? value.until.utcOffset(0).unix() : null,
          };

          break;

        default:

          filter[name] = value;
      }
    });

    this.props.filterData(filter);
  }

  render() {
    const {
      open,
      list,
    } = this.state;

    const {
      filters,
    } = this.props;

    return (
      <FilterGenerator
        open={open}
        toggle={this.toggle}
        list={list}
        getFiltersList={this.getFiltersList}
        changeFilter={this.changeFilter}
        changeFilterValue={this.changeFilterValue}
        deleteFilter={this.deleteFilter}
        canAddNewFilter={filters.length > list.length}
        addNewFilter={this.addNewFilter}
        applyFilter={this.applyFilter}
      />
    );
  }
}

export default FilterGeneratorContainer;
