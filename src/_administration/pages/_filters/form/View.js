import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ErrorsList from '../../../../components/ErrorsList/ErrorsList';
import Widget from '../../../../components/Widget';
import s from './Filters.scss';

const View = ({
  name,
  errors,
  onCancelForm,
  isFetching,
  isLoaded,
  editMode,
  filterNameChange,
  onSubmit
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/filters">Filters</Link>
      </li>
    </ul>
    <h2>{(editMode && 'Edit filter') || 'Add new Filter'}</h2>
    <div className="row">
      <div className="col-sm-8">
        <Widget>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="control-label">Name</label>
              <input
                className="form-control"
                value={name}
                onChange={filterNameChange}
                required
              />
            </div>
            {errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={errors} />
              </Alert>
            )}
            <div className="form-group footer">
              <button
                className="btn btn-inverse"
                type="button"
                onClick={onCancelForm}
              >
                Cancel
              </button>
              <button
                className="btn btn-inverse"
                type="submit"
                disabled={isFetching}
              >
                {(editMode && 'Edit') || 'Create'}
              </button>
            </div>
          </form>
        </Widget>
      </div>
    </div>
  </div>
);

export default withStyles(s)(View);
