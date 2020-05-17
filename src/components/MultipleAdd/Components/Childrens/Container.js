import React, { Component } from 'react';
import classes from 'classnames';
import { connect } from "react-redux";
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import { fetchGenders } from '../../../../actions/genders';
import Popup from "../../../_popup/Popup/Popup";
import moment from 'moment';
import View from './View';
import Form from './Form';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

class Childrens extends Component {
  constructor(props, context) {
    super(props, context);
    const { childrens } = this.props;

    this.state = {
      childrensList: childrens || null,
      displayForm: false,
      __childGender: null,
      __childDateOfBirth: null,
      __children_in_planning: false,
    };
  };

  componentDidMount() {
    const {
      dispatch,
      gendersList,
    } = this.props;

    if ( ! gendersList || ! gendersList.length) {
      dispatch(
        fetchGenders()
      );
    }
  }

  getGendersOptions() {
    const { gendersList } = this.props;

    const male = gendersList.findIndex(i => i.slug === 'male');
    const female = gendersList.findIndex(i => i.slug === 'female');

    gendersList[male].name = I18n.t('general.components.multipleAdd.boy');
    gendersList[female].name = I18n.t('general.components.multipleAdd.girl');

    return gendersList.map(({
      id: value,
      name: label,
    }) => ({value, label}));
  }

  render() {
    const {
      onChange,
      isMobile,
    } = this.props;

    const {
      childrensList,
      displayForm,
      __childGender,
      __childDateOfBirth,
      __children_in_planning,
    } = this.state;

    return (
      <div className={s.root}>
        <View
          gendersOptions={this.getGendersOptions()}
          childrensList={childrensList}
          isMobile={isMobile}

          onUpdate={(child, index) => {
            childrensList[index] = child;
            this.setState({childrensList});
          }}

          onChildRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteChild')).then(() => {
              this.setState({
                childrensList: [
                  ...childrensList.slice(0, i),
                  ...childrensList.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...childrensList.slice(0, i),
                  ...childrensList.slice(i + 1)
                ])
              });
            });
          }}
        />
        {
          displayForm && (
            <Popup
              notShowCloser
              onClose={() => {
                this.setState({displayForm: false})
              }}
            >
              <Form
                __childGender={__childGender}
                __childDateOfBirth={__childDateOfBirth}
                __children_in_planning={__children_in_planning}
                isMobile={isMobile}

                onSubmit={() => {
                  if(__childGender || (__childDateOfBirth || __children_in_planning)) {
                    const newChild = {
                      in_planning: __children_in_planning,
                      dateOfBirth:  !__children_in_planning
                        ? moment(__childDateOfBirth).unix()
                        : 0,
                      gender: {
                        id: __childGender ? __childGender.value : null,
                        name: __childGender ? __childGender.label : '',
                    }};
                    this.setState({
                      childrensList: childrensList.concat(newChild),
                      displayForm: false,
                      __children_in_planning: false,
                      __childGender: {
                        value: null,
                        label : ''
                      },
                      __childDateOfBirth: null,
                    }, () => {
                      onChange(childrensList.concat(newChild))
                    })
                  }
                }}

                onGenderChange={__childGender => {
                  this.setState({__childGender})
                }}

                onDateOfBirthChange={__childDateOfBirth => {
                  this.setState({__childDateOfBirth})
                }}

                onChildStatusChange={() => this.setState({
                  __children_in_planning: !__children_in_planning,
                })}

                gendersOptions={this.getGendersOptions()}
              />
            </Popup>

          )
        }
        <div className={s.listItem}
          onClick={() => {this.setState({displayForm: !displayForm})}}
        >
          <span>
            {(!childrensList.length && I18n.t('general.components.multipleAdd.childrensNotFound')) || ` `}
          </span>
          <div className={classes(s.options, {
            [s.mobile]: isMobile
          })}>
            <i
              className={`${s.optionsItem} icon-plus-o`}
              onClick={() => {
                this.setState({
                  displayForm: true,
                })
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    gendersList: store.genders.list.filter(e => e.slug !== 'unisex'),
  };
}

export default connect(mapStateToProps)(withStyles(s)(Childrens));
