import React  from 'react';
import classes from 'classnames';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';

import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const List = ({
  isFetching,
  postsList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  activatePost,
  dezactivatePost,
  cancelPending,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.menuDropDown.posts')}
      </li>
    </ul>

    <h2>Posts</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
            {I18n.t('administration.menuDropDown.posts')}
            <span className="fw-semi-bold">
            {I18n.t('administration.list')}
            </span>
          </h5>
        </div>
      }
    >
      <div className="row">
        <div className="col-sm-8">
          <FilterGenerator
            filters={filters}
            filterData={filterData}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table
          className={
            classes(
              'table', {
                'table-striped': !!postsList && !!postsList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col />
            <col style={{width: '1px'}} />
            <col />
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
          <tr>
            <th>Nº</th>
            <th>{I18n.t('administration.table.title')}</th>
            <th>{I18n.t('administration.table.owner')}</th>
            <th>{I18n.t('administration.table.cancelPending')}</th>
            <th>{I18n.t('administration.table.promoving')}</th>
            <th>{I18n.t('administration.table.createdAt')}</th>
            <th/>
          </tr>
          </thead>

          <tbody>
          {
            postsList && postsList.map(data => {
              const {
                id,
                no,
                title,
                owner,
                createdAt,
                status
              } = data;

              return (
                <tr key={id}>
                  <td>{no}</td>
                  <td>{title}</td>
                  <td>
                    {owner.fullName}
                  </td>
                  <td>
                    {
                      status.pending === 'sent not-confirmed' &&(
                        <button className={classes('btn btn-default', s.actionBtn)}
                                onClick={() => cancelPending(id)}
                        >
                          <i className="glyphicon glyphicon-ban-circle text-danger"/>
                        </button>
                      )
                    }
                  </td>
                  <td>
                    {
                      (
                        !data.public && (
                          <button className={classes('btn btn-default', s.actionBtn)}
                                  onClick={() => activatePost(id)}
                          >
                            <i className="glyphicon glyphicon-unchecked"/>
                          </button>
                        )) || (
                        <button className={classes('btn btn-default', s.actionBtn)}
                                onClick={() => dezactivatePost(id)}
                        >
                          <i className="glyphicon glyphicon-check"/>
                        </button>
                      )
                    }
                  </td>
                  <td>
                    {
                      moment(createdAt, 'X').format(I18n.t('formats.date'))
                    }
                  </td>
                  <td>
                    <Link
                      className={
                        classes(
                          'btn btn-default',
                          s.actionBtn
                        )
                      }
                      title="Post Page"
                      to={{
                        pathname: `/blog/edit/${id}`,
                        state: {data: data}
                      }}
                    >
                      <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                    </Link>
                  </td>
                </tr>
              )
            })
          }

          {
            postsList && ! postsList.length && (
              <tr>
                <td colSpan="100">
                  {I18n.t('administration.table.emptyList')}
                </td>
              </tr>
            )
          }

          {
            isFetching && (
              <tr>
                <td colSpan="100">
                  {I18n.t('general.elements.loading')}
                </td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>

      <div>
        <button
          className="btn btn-default"
          disabled={prevDisabledStatus}
          onClick={onPrevClick}
        >
          <i className="glyphicon glyphicon-chevron-left" />
        </button>

        <button
          className="btn btn-default"
          disabled={nextDisabledStatus}
          onClick={onNextClick}
        >
          <i className="glyphicon glyphicon-chevron-right" />
        </button>

        <select
          className={s.nofRecordsPPSelector}
          value={nofRecordsPerPage}
          disabled={nofRecordsPerPageDisabledStatus}
          onChange={({target: {value}}) => {
            changeNOFRecordsPerPage(parseInt(value, 10));
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </Widget>
  </div>
);

export default withStyles(s)(List);
