import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from "../../../_popup/Popup/Popup";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

import View from './View';
import Form from './Form';

class WorkingPlaces extends Component {
  constructor(props, context) {
    super(props, context);
    const { places } = this.props;

    this.state = {
      displayForm: false,
      workingPlacesList: places || null,
      __position: '',
      __institution: '',
      __location: null,
    };
  };

  render() {
    const {
      onChange,
      isMobile,
    } = this.props;

    const {
      displayForm,
      workingPlacesList,
      __position,
      __institution,
      __location,
    } = this.state;


    return (
      <div className={s.root}>
        <View
          workingPlacesList={workingPlacesList}
          isMobile={isMobile}

          onUpdate={(workingPlace, index) => {
            workingPlacesList[index] = workingPlace;
            this.setState({workingPlacesList});
          }}

          onWorkingPlaceRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteWorkingPlace')).then(() => {
              this.setState({
                workingPlacesList: [
                  ...workingPlacesList.slice(0, i),
                  ...workingPlacesList.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...workingPlacesList.slice(0, i),
                  ...workingPlacesList.slice(i + 1)
                ])
              });
            })
          }}
        />
        {
          displayForm && (
            <Popup
              className={s.popUpModifier}
              notShowCloser
              onClose={() => {
                this.setState({displayForm: false})
              }}
            >
              <Form
                __position={__position}
                __institution={__institution}
                __location={__location}
                isMobile={isMobile}

                onClose={() => {
                  this.setState({displayForm: false})
                }}
                onSubmit={() => {
                  if(__institution !== '' && __position !== '' && __location) {
                    const workingplace = {
                      institution: __institution,
                      position: __position,
                      location: __location,
                      region: __location.country_init
                    }

                    this.setState({
                      workingPlacesList: workingPlacesList.concat(workingplace),
                      displayForm: false,
                      __position: '',
                      __institution: '',
                      __location: null,
                    }, () => {
                      onChange(workingPlacesList.concat(workingplace))
                    })
                  }
                }}

                onInstitutionChange={({target: {value: __institution}}) => {
                  this.setState({__institution})
                }}

                onPositionchange={({target: {value: __position}}) => {
                  this.setState({__position})
                }}

                onLocationChange={__location => {
                  this.setState({__location})
                }}
              />
            </Popup>

          )
        }
        <div className={s.listItem}
          onClick={() => {this.setState({displayForm: !displayForm})}}
        >
          <span>
            {(!workingPlacesList.length && I18n.t('general.components.multipleAdd.workingPlacesNotFound')) || ` `}
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

export default withStyles(s)(WorkingPlaces);
