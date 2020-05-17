import React, { Component } from 'react';
import classes from 'classnames';
import { I18n } from 'react-redux-i18n';
import Popup from "../../../_popup/Popup/Popup";
import moment from 'moment';
import Form from './Form';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

class ListItem extends Component {
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;

    let gender = data.gender.slug === 'male' ?
      data.gender.name = I18n.t('general.components.multipleAdd.boy')
      : data.gender.name = I18n.t('general.components.multipleAdd.girl');

    this.state = {
      __childGender: {
        value: data.gender.id,
        label: data.in_planning  ? '' :gender,
      },
      __childDateOfBirth: moment.unix(data.dateOfBirth),
      __children_in_planning: data.in_planning,
      editMode: false,
    };
  };

  componentWillReceiveProps(nextprops){
    const { data } = nextprops;

    this.setState({
      __childGender: {
        value: data.in_planning ? null : data.gender.id,
        label: data.in_planning ? '' : data.gender.name,
      },
      __childDateOfBirth: moment.unix(data.dateOfBirth),
      __children_in_planning: data.in_planning,
    })
  }

  render() {
    const {
      editMode,
      __childGender,
      __childDateOfBirth,
      __children_in_planning,
    } = this.state;

    const {
      onChildRemove,
      gendersOptions,
      onUpdate,
      isMobile,
    } = this.props;

    const age = moment().diff(__childDateOfBirth, 'years');
    const label = age < 2
      ? I18n.t('general.components.multipleAdd.year')
      : I18n.t('general.components.multipleAdd.years');

    return(
      <div>
        {
          editMode && (
            <Popup
              notShowCloser
              onClose={() => {
                this.setState({editMode: !editMode,})
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
                        name: __childGender ? __childGender.label : null,
                    }}
                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate(newChild)
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
                  __childGender: {
                    value: null,
                    label : ''
                  },
                })}

                gendersOptions={gendersOptions}
              />
            </Popup>
          )
        }
        <div className={s.listItem}>
          <span>
            {
              (__children_in_planning && (
                  `in planning`
              )) || `${__childGender.label}, ${age} ${label}`
            }
          </span>
          <div className={classes(s.options, {
            [s.mobile]: isMobile
          })}>
            <i
              className={`${s.optionsItem} icon-edit-o`}
              onClick={() => {
                this.setState({
                  editMode: !editMode,
                })
              }}
            />
            <i
              className={`${s.optionsItem} icon-remove-o`}
              onClick={onChildRemove}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ListItem);
