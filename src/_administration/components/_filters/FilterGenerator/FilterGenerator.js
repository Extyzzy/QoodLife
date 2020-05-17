import React  from 'react';
import classes from 'classnames';
import Select from "react-select";
import "react-select/dist/react-select.css";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FilterGenerator.scss';
import ValueSelector from './ValueSelector';
import {I18n} from 'react-redux-i18n';

const FilterGenerator = ({
  open,
  toggle,
  list,
  getFiltersList,
  changeFilter,
  changeFilterValue,
  deleteFilter,
  canAddNewFilter,
  addNewFilter,
  applyFilter,
}) => (
  <div className={s.root}>
    <button
      className="btn btn-default"
      onClick={toggle}
    >
      {
        (open &&
          I18n.t('administration.filter.hideFilters')
        ) || (
          I18n.t('administration.filter.showFilters')
        )
      }
    </button>

    {
      open && (
        <div className={s.filters}>
          <div className={s.list}>
            {
              (list && !!list.length && (
                list.map(({id, name, value, data}) => {
                  return (
                    <div
                      key={id}
                      className={
                        classes(
                          'form-group',
                          s.filter
                        )
                      }
                    >
                      <div className={classes("row", s.filterSelect)}>
                        <div className="col-xs-10">
                          <div className="row">
                            <div className="col-sm-6">
                              <Select
                                value={name}
                                options={getFiltersList(id)}
                                onChange={v => {
                                  changeFilter(id, v);
                                }}
                                optionClassName="needsclick"
                                multi={false}
                              />
                            </div>

                            <div className="col-sm-6">
                              <ValueSelector
                                id={id}
                                data={data}
                                filterValue={value}
                                changeFilterValue={
                                  changeFilterValue
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-2">
                          <button
                            className={s.delete}
                            onClick={() => {
                              deleteFilter(id);
                            }}
                          >
                            <i className="glyphicon glyphicon-remove" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )) || I18n.t('administration.filter.noneFiltersAdded')
            }
          </div>

          <div className={s.footer}>
            <button
              className="btn btn-default"
              disabled={ ! canAddNewFilter}
              onClick={addNewFilter}
            >
              <i className="glyphicon glyphicon-plus" />
            </button>

            <button
              className="btn btn-default"
              onClick={applyFilter}
            >
              {I18n.t('administration.filter.apply')}
            </button>
          </div>
        </div>
      )
    }
  </div>
);

export default withStyles(s)(FilterGenerator);
