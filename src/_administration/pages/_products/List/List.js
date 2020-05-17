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
  productsList,
  prevDisabledStatus,
  nextDisabledStatus,
  onPrevClick,
  onNextClick,
  filters,
  filterData,
  nofRecordsPerPage,
  nofRecordsPerPageDisabledStatus,
  changeNOFRecordsPerPage,
  canManageAllPromotions,
  activateProduct,
  dezactivateProduct,
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
        {I18n.t('administration.menuDropDown.products')}
      </li>
    </ul>

    <h2>{I18n.t('administration.menuDropDown.products')}</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
            {I18n.t('administration.menuDropDown.products')}
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
                'table-striped': !!productsList && !!productsList.length,
              }
            )
          }
        >
          <colgroup>
            <col style={{width: '1px'}} />
            <col />
            <col style={{width: '1px'}} />
            <col />
            <col style={{width: '1px'}} />
            <col style={{width: '1px'}} />
          </colgroup>

          <thead>
          <tr>
            <th>Nº</th>
            <th>{I18n.t('administration.table.title')}</th>
            <th>{I18n.t('administration.table.cancelPending')}</th>
            <th>{I18n.t('administration.table.promoving')}</th>
            <th className="text-center">
              {I18n.t('administration.table.promoted')}
            </th>
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
            productsList && productsList.map(data => {
              const {
                id,
                no,
                title,
                promoted,
                createdAt,
                status
              } = data;

              return (
                <tr key={id}>
                  <td>{no}</td>
                  <td>{title}</td>
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
                                  onClick={() => activateProduct(id)}
                          >
                            <i className="glyphicon glyphicon-unchecked"/>
                          </button>
                        )) || (
                        <button className={classes('btn btn-default', s.actionBtn)}
                                onClick={() => dezactivateProduct(id)}
                        >
                          <i className="glyphicon glyphicon-check"/>
                        </button>
                      )
                    }
                  </td>
                  <td className="text-center">
                    {
                      (promoted && (
                        <i className="glyphicon glyphicon-ok-circle text-success"/>
                      )) || (
                        <i className="glyphicon glyphicon-ban-circle text-danger"/>
                      )
                    }
                  </td>
                  <DateTimeCell timestamp={createdAt}/>
                  {
                    canManageAllPromotions && (
                      <td>
                        <Link
                          to={`/administration/products/${id}/promotions`}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Promotion Intervals"
                        >
                          <i className="glyphicon glyphicon-ban-circle"/>
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
                      to={{
                        pathname: `/products/edit/${id}`,
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
            productsList && ! productsList.length && (
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
