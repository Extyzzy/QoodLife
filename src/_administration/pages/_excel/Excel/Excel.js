import React  from 'react';
import classes from 'classnames';
import {Link} from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Excel.scss';

import Widget from '../../../../components/Widget/Widget';
import FilterGenerator from '../../../components/_filters/FilterGenerator/FilterGeneratorContainer';
import DateTimeCell from '../../../components/_tables/DateTimeCell/DateTimeCell';

import {I18n} from 'react-redux-i18n';
import Loader from "../../../../components/Loader";
import GalleryInput from "../../../../components/_inputs/GalleryInput";
import {confirm} from "../../../../components/_popup/Confirm";

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
  onSubmit,
  onFileChange,
  __file,
  uploading,
  onActiveTabChangeRequests,
  onActiveTabChangeVisible,
  onActiveTabChangeExcel,
  activeTab,
  image,
  onImageChange,
  deleteImage,
  cropImage,
  confirmPendingAgent,
  resPendingAgent
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

    <h2>Import Excel File for Places</h2>

    <Widget
      title={
        <div>
          <h5 className="mt-0 mb-0">
            <span className="fw-semi-bold">
              {I18n.t('administration.list')} Excel Places
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
      <div className="col-sm-8">
        <form onSubmit={onSubmit}>
          <label htmlFor="file">File Excel:</label>

          <GalleryInput
            images={image ? [image] : []}
            onImageChange={onImageChange}
            onChangeDefaultImage={() => {}}
            onDeleteImage={deleteImage}
            onCropImage={cropImage}
            multiple={false}
            width={250}
          />

          {
            image && (
              <input
                type="file"
                onChange={onFileChange}
              />
            )
          }

          {
            uploading &&(
              <Loader sm contrast />
            )
          }

          {
            __file &&(
              <span className={s.successFileLoad}>Success file upload</span>
            )
          }

        </form>
        </div>
      </div>

      <div className={s.changeBox}>
        <span
          onClick={onActiveTabChangeExcel}
          className={activeTab === 'Excel' ? s.active : null}
        >
          Excel
        </span>
        <span
          onClick={onActiveTabChangeVisible}
          className={activeTab === 'Visible' ? s.active : null}
        >
          Visible
        </span>
        <span
          onClick={onActiveTabChangeRequests}
          className={activeTab === 'Requests' ? s.active : null}
        >
          Requests
        </span>
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
            {
              activeTab === 'Requests' &&(
                <th>Reject/Accept</th>
              )
            }
            <th>{I18n.t('administration.table.createdAt')}</th>

            {
              activeTab === 'Requests' && (
                 <th>Member Link</th>
              )
            }

            <th/>
          </tr>
          </thead>

          <tbody>
          {
            placesList && placesList.map(data => {
              const {
                id,
                no,
                name,
                branches,
                email,
                phoneNumber,
                createdAt,
                owner
              } = data;

              return (
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
                  {
                    activeTab === 'Requests' && owner &&(
                      <td>
                      <button
                        onClick={() => {
                          confirm(
                            `Are you sure to reject ${name || ''} ?`)
                            .then(() => {
                              resPendingAgent(owner.id)
                            })
                        }}
                        className={classes(
                          'btn btn-default',
                          s.actionBtn,
                        )}
                      >
                        <i className="glyphicon glyphicon-ban-circle"/>
                      </button>
                        <button
                          onClick={() => {
                            confirm(
                              `Are you sure to accept ${name || ''} ?`)
                              .then(() => {
                                confirmPendingAgent(owner.id)
                              })
                          }}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn,
                            )
                          }
                        >
                          <i className="glyphicon glyphicon-ok-circle text-success"/>
                        </button>
                      </td>
                    )
                  }

                  <DateTimeCell timestamp={createdAt} />
                  {
                    activeTab === 'Requests' && (
                      <td>
                        <Link
                          to={`/member/${id}`}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtn
                            )
                          }
                          title="Member View"
                        >
                          <i className="glyphicon glyphicon glyphicon-chevron-right"/>
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
                      title="Place Page"
                      to={{
                        pathname: `/administration/excel/edit/${id}`,
                        state: {data: data}
                      }}
                    >
                      <i className="glyphicon glyphicon glyphicon-chevron-right"/>
                    </Link>
                  </td>
                </tr>
              )})
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
