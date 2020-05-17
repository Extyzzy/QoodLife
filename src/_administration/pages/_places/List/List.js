import React  from 'react';
import classes from 'classnames';
import {Link} from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator';
import DateTimeCell from '../../../components/_tables/DateTimeCell';
import {I18n} from 'react-redux-i18n';

const List = ({
  isFetching,
  placesList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  switchVisibilityInPage,
  canManageAllPromotions,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        {I18n.t('administration.menuDropDown.places')}
      </li>
    </ul>

    <h2>{I18n.t('administration.menuDropDown.places')}</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
              {I18n.t('administration.menuDropDown.places')}
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
                'table-striped': !!placesList && !!placesList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col />
            <col />
            <col />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
            <col />
            <col />

            {
              canManageAllPromotions && (
                <col style={{width: '1px'}} />
              )
            }
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
            <tr>
              <th>Nº</th>
              <th>{I18n.t('administration.table.name')}</th>
              <th>{I18n.t('administration.table.location')}</th>
              <th>{I18n.t('administration.table.email')}</th>
              <th>{I18n.t('administration.table.phone')}</th>
              <th>{I18n.t('administration.table.promoted')}</th>
              <th>{I18n.t('administration.table.visible')}</th>
              <th>{I18n.t('administration.table.createdAt')}</th>

              {
                canManageAllPromotions && (
                  <th />
                )
              }
              <th/>
            </tr>
          </thead>

          <tbody>
          {
            placesList && placesList.map(({
              id,
              no,
              name,
              branches,
              email,
              canBeSee,
              phoneNumber,
              promoted,
              createdAt,
            }) => (
              <tr key={id}>
                <td>{no}</td>
                <td>{name}</td>
                <td>
                  {
                    (branches[0].location !== null && (
                      branches[0].location.label
                    )) || (
                      '--'
                    )
                  }
                </td>
                <td>
                  {email}
                </td>
                <td className="text-center">
                  {
                    (phoneNumber !== null && (
                      phoneNumber
                    )) || (
                      '-'
                    )
                  }
                </td>
                <td className="text-center">
                  {
                    (promoted && (
                      <i className="glyphicon glyphicon-ok-circle text-success" />
                    )) || (
                      <i className="glyphicon glyphicon-ban-circle text-danger" />
                    )
                  }
                </td>
                <td>
                  {
                    (
                      !canBeSee && (
                        <button
                          className={classes('btn btn-default', s.actionBtn)}
                          onClick={() => switchVisibilityInPage(id)}
                        >
                          <i className="glyphicon glyphicon-unchecked"/>
                        </button>
                      )) || (
                      <button
                        className={classes('btn btn-default', s.actionBtn)}
                        onClick={() => switchVisibilityInPage(id)}
                      >
                        <i className="glyphicon glyphicon-check"/>
                      </button>
                    )
                  }
                </td>
                <DateTimeCell timestamp={createdAt} />
                {
                  canManageAllPromotions && (
                    <td>
                      <Link
                        to={`/administration/places/${id}/promotions`}
                        className={
                          classes(
                            'btn btn-default',
                            s.actionBtn
                          )
                        }
                        title="Promotion Intervals"
                      >
                        <i className="glyphicon glyphicon-ban-circle" />
                      </Link>
                    </td>
                  )
                }
                <td>
                  <Link
                    className={
                      classes(
                        'btn btn-default',
                        s.actionBtn
                      )
                    }
                    title="Product Page"
                    to={`/places/${id}`}
                  >
                  <i className="glyphicon glyphicon glyphicon-chevron-right"  />
                  </Link>
                </td>
              </tr>
            ))
          }

          {
            placesList && ! placesList.length && (
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
