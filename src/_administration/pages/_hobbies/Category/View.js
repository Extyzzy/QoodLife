import React  from 'react';
import classes from 'classnames';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './List.scss';
import Widget from '../../../../components/Widget';

const View = ({
  isFetching,
  hobbyDetails,
  hobbyDetails: {
    parent,
    category,
    children,
    hobbies,
  },
  canManageHobbies,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/hobbies">
          {I18n.t('administration.hobbies.hobbies')}
        </Link>
      </li>
      {
        parent && (
          <li>
            <Link to={`/administration/hobbies/${parent.id}`}>
              {parent.name}
            </Link>
          </li>
        )
      }
      <li className="active">
        {category.name}
      </li>
    </ul>
    <h2>{I18n.t('administration.hobbies.categoryDetails')}</h2>
    <Widget
      title={
        <div>
          {
            canManageHobbies && (
              <div className="pull-right mt-n-xs">
                <Link
                  className="btn btn-sm btn-inverse"
                  to={`/administration/hobbies/${category.id}/edit`}
                >
                  {I18n.t('administration.hobbies.edit')}
                </Link>
                {
                  (!hobbyDetails.children.length > 0 && (
                    <Link
                      className="btn btn-sm btn-inverse"
                      to={`/administration/hobbies/${category.id}/new`}
                    >
                      {I18n.t('administration.hobbies.addHobby')}
                    </Link>
                  )) || (
                    <Link
                      className="btn btn-sm btn-inverse"
                      to={`/administration/hobbies/new`}
                    >
                      {I18n.t('administration.hobbies.addCategory')}
                    </Link>
                  )
                }
              </div>
            )
          }

          <h4 className="mt-0 mb-0">
            <span className="fw-semi-bold">
              {category.name}
              {
                category.for_children && (
                  ` (${I18n.t('administration.hobbies.forChildrens')})`
                )
              }
            </span>
          </h4>
        </div>
      }
    >
      <div className={s.root}>
        <img
          src={category.image.src}
          className={s.categoryImage}
          alt={category.name}
        />
        <div className={s.details}>
          <div className="table-responsive">
            <table
              className={
                classes(
                  'table', {
                    'table-striped': !!hobbies && !!hobbies.length,
                  }
                )
              }
            >
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                  {
                    (children && children.length && (
                      <tr>
                        <th>Nº</th>
                        <th>{I18n.t('administration.hobbies.name')}</th>
                        <th>{I18n.t('administration.hobbies.hobbies')}</th>
                        <th>{I18n.t('administration.hobbies.image')}</th>
                      </tr>
                    )) || (
                      <tr>
                        <th>Nº</th>
                        <th>{I18n.t('administration.hobbies.hobbies')}</th>
                        <th>{I18n.t('administration.hobbies.image')}</th>
                        <th></th>
                      </tr>
                    )
                  }
              </thead>
              <tbody>
                {
                  (children && children.length && (
                    children.map(({
                      category: {
                        id,
                        name,
                        image,
                      },
                      hobbies
                    }, i) => (
                      <tr key={id}>
                        <td>{i+1}</td>
                        <td>
                          <Link to={`/administration/hobbies/${id}`}>
                            {name}
                          </Link>
                        </td>
                        <td>{hobbies.length}</td>
                        <td>
                          <img
                            src={image.src}
                            alt={name}
                            className={s.hobbyImage}
                          />
                        </td>
                      </tr>
                    ))
                  )) || (
                    hobbies && hobbies.map(({
                      id,
                      name,
                      image,
                    }, i) => (
                      <tr key={id}>
                        <td>{i+1}</td>
                        <td>{name}</td>
                        <td>
                          <img
                            src={image.src}
                            alt={name}
                            className={s.hobbyImage}
                          />
                        </td>
                        <td>
                          <Link
                            to={`/administration/hobbies/${category.id}/edit/${id}`}
                          >
                            {I18n.t('administration.hobbies.edit')}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )
                }
                {
                  !((hobbies && !hobbies.length) || (children && !children.length)) && (
                    <tr>
                      <td colSpan="100">
                        {I18n.t('administration.table.emptyList')}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Widget>
  </div>
);

export default withStyles(s)(View);
