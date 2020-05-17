import { Component } from 'react';
import moment from 'moment';

import {
  InternalServerError,
} from '../../../../exceptions/http';

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../constants';

class PaginatedTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      nofRecordsPerPage: DEFAULT_NOF_RECORDS_PER_PAGE,
      isFetching: true,
      list: null,
      totalNOFRecords: null,
      couldLoadMore: false,
      skip: 0,
      filterData: {},
      filter: {},
      activeTab: 'Excel'
    };

    this.hasFilter = false;
    this.createdAt = moment().utcOffset(0);

    if ( ! this.getLoadDataFetcher || ! (this.getLoadDataFetcher instanceof Function)) {
      throw new Error('getLoadDataFetcher method must be defined.');
    }

    this.filterData = this.filterData.bind(this);
    this.getPrevRecords = this.getPrevRecords.bind(this);
    this.getNextRecords = this.getNextRecords.bind(this);
    this.changeNOFRecordsPerPage = this.changeNOFRecordsPerPage.bind(this);
  }

  componentDidMount() {
    this.loadInitialData({
      WITH_FILTER_DATA: + this.hasFilter,
    });
  }

  componentWillUnmount() {
    if (this.loadDataFetcher instanceof Promise) {
      this.loadDataFetcher.cancel();
    }
  }

  loadInitialData(filter = {}) {
    this.loadData({
      ...this.state.filter,
      ...filter,
      before: this.createdAt.unix(),
      take: this.state.nofRecordsPerPage,
    }, {
      onSuccess: ({list, totalNOFRecords, filterData}) => {
        const couldLoadMore = list.length < totalNOFRecords &&
          list.length >= this.state.nofRecordsPerPage;

        /**
         * If Filter Data is not passed from backend
         * we don't change it.
         */
        if ( ! filterData) {
          filterData = this.state.filterData;
        }

        this.setState({
          isFetching: false,
          list,
          totalNOFRecords,
          couldLoadMore,
          skip: 0,
          filterData,
        });
      },
      onError: () => {
        this.setState({
          isFetching: false,
          list: [],
          totalNOFRecords: 0,
          couldLoadMore: false,
          skip: 0,
        });
      },
    });
  }

  filterData(filter) {
    this.setState({
      isFetching: true,
      filter,
    }, () => {
      this.loadInitialData();
    });
  }

  loadData(filter, {beforeFetch, onSuccess, onError} = {}) {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    this.loadDataFetcher = this.getLoadDataFetcher(filter);

    this.loadDataFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            if (onError instanceof Function) {
              onError();
            }

            return Promise.reject(
              new InternalServerError()
            );

        }
      })
      .then(data => {
        if (onSuccess instanceof Function) {
          onSuccess(data);
        }

        return Promise.resolve();
      });
  }

  loadMore() {
    const {
      nofRecordsPerPage,
      list: storedList,
      skip,
      totalNOFRecords,
      filter,
    } = this.state;

    /**
     * Calculate the remained records that should be loaded
     * on this page. This number will be more than 0 only when
     * we changed number of records per page, and one page is
     * not fulfilled.
     *
     * @type {number}
     */
    const remained = storedList.length % nofRecordsPerPage > 0 ?
      nofRecordsPerPage - storedList.length % nofRecordsPerPage : 0;

    const nofRecordsToLoad = remained ? remained : nofRecordsPerPage;

    this.loadData({
      ...filter,
      before: this.createdAt.unix(),
      skip: storedList.length,
      take: nofRecordsToLoad,
    }, {
      beforeFetch: () => {
        this.setState({
          isFetching: true,
        });
      },
      onSuccess: ({list}) => {
        const couldLoadMore = storedList.length + list.length < totalNOFRecords &&
          list.length >= nofRecordsToLoad;

        this.setState({
          isFetching: false,
          list: [
            ...storedList,
            ...list,
          ],
          couldLoadMore,
          skip: remained ? skip : skip + list.length,
        });
      },
      onError: () => {
        this.setState({
          isFetching: false,
        });
      },
    });
  }

  getActiveRecords() {
    const {
      nofRecordsPerPage,
      isFetching,
      list,
      skip,
    } = this.state;

    return ! isFetching && list
      ? list
        .slice(skip, skip + nofRecordsPerPage)
        .map((item, i) => ({
          no: skip + i + 1,
          ...item,
        }))
      : null;
  }

  canGetPrevRecords() {
    const {
      isFetching,
      skip,
    } = this.state;

    return ! skip || isFetching;
  }

  canGetNextRecords() {
    const {
      nofRecordsPerPage,
      isFetching,
      list,
      skip,
      couldLoadMore,
    } = this.state;

    return ! (
      couldLoadMore || (
        list && skip + nofRecordsPerPage < list.length
      )
    ) || isFetching;
  }

  getPrevRecords() {
    const { nofRecordsPerPage, skip } = this.state;
    const _skip = skip - nofRecordsPerPage;

    this.setState({
      skip: _skip > 0 ? _skip : 0,
    });
  }

  getNextRecords() {
    const {
      nofRecordsPerPage,
      list,
      skip,
    } = this.state;

    if (list && skip + nofRecordsPerPage < list.length) {
      this.setState({
        skip: skip + nofRecordsPerPage,
      });
    }
    else {
      this.loadMore();
    }
  }

  canChangeNOFRecordsPerPage() {
    return this.state.isFetching;
  }

  changeNOFRecordsPerPage(nofRecordsPerPage) {
    this.setState({
      nofRecordsPerPage,
      skip: 0,
    });
  }
}

export default PaginatedTable;
