import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import s from './Brands.scss';

const View = ({
  brandsList,
  isFetching,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  changeModerateStatus,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        Brands
      </li>
    </ul>
    <h2>Brands List</h2>
    <Widget
      title={
        <div>
          <div className="pull-right mt-n-xs">
            <Link
              className="btn btn-sm btn-inverse"
              to={`/administration/brands/new`}
            >
              Add Brand
            </Link>
          </div>

          <h4 className="mt-0 mb-0">
            <span className="fw-semi-bold">
              Brands
            </span>
          </h4>
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
                'table-striped': !!brandsList && !!brandsList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.name')}</th>
              <th>Suggested</th>
              <th>Moderated</th>
            </tr>
          </thead>

          <tbody>
          {
            brandsList && brandsList.map(brand => (
              <tr key={brand.id}>
                <td>{brand.no}</td>
                <td>{brand.name}</td>
                <td className="text-center">
                  {
                    (brand.suggested && (
                      <i className="glyphicon glyphicon-ok-circle text-success" />
                    )) || (
                      <i className="glyphicon glyphicon-ban-circle text-danger" />
                    )
                  }
                </td>
                <td className="text-center">
                  <button
                    className={classes('btn btn-default', s.actionBtn)}
                    onClick={() => changeModerateStatus(brand)}
                  >
                    {
                      (brand.public && (
                        <i className="glyphicon glyphicon-check" />
                      )) || (
                        <i className="glyphicon glyphicon-unchecked" />
                      )
                    }
                  </button>
                </td>
                <td>
                  <Link
                    to={`/administration/brands/${brand.id}`}
                  >
                    {I18n.t('administration.hobbies.edit')}
                  </Link>
                </td>
              </tr>
            ))
          }

          {
            brandsList && !brandsList.length && (
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

export default withStyles(s)(View);
