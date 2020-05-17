import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { uniqBy, sortBy } from 'lodash';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from "../../../_popup/Popup/Popup";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

import View from './View';
import Form from './Form';

class Hobbies extends Component {
  static defaultProps = {
    haveTitles: true,
  };

  constructor(props, context) {
    super(props, context);
    const { hobbies} = this.props;

    this.state = {
      displayForm: false,
      selectedHobbies: hobbies || [],
      __hobby: null,
      __title: null,
      __ageGroups: null,
      __audienceForCommonHobbies: null,
    };
  };

  getHobbyTitlesOptions(role){
    const { __hobby } = this.state;
    const { filters } = this.props;

    if(__hobby !== null){
      if(filters){
        return (
          __hobby.filters.map(({
            id: value,
            name: label
          }) => ({value, label}))
        )
      } else {
        switch (role) {
          case 'professional':

            return(
              __hobby.titles.professional.map(({
                id: value,
                name: label
              }) => ({value, label}))
            )
          case 'place':
            return(
              __hobby.titles.place.map(({
                id: value,
                name: label
              }) => ({value, label}))
            );
          default:
            return []
        }
      }
    }
  }

  render() {
    const {
      filters,
      role,
      haveTitles,
      onChange,
      isMobile,
      hobbiesList,
      profileDetails: {
        hobbies: userHobbies,
        childrenHobbies: userChildrenHobbies
      }
    } = this.props;

    const {
      selectedHobbies,
      displayForm,
      __hobby,
      __title,
      __ageGroups,
      __audienceForCommonHobbies,
    } = this.state;

    const allUserHobbies = [
      ...userHobbies,
      ...userChildrenHobbies
    ];

    const hobbiesOptions = uniqBy(hobbiesList, 'value').map(i => ({
      ...i,
      className: !!allUserHobbies.filter(h => h.id === i.value).length > 0
        ? 'ownHobbySelectItem'
        : ''
    }));

    const orderedHobbiesOptions = sortBy(hobbiesOptions, ['className']).reverse();

    const hobbyAgeGroupsList = __hobby && __hobby.ageGroups &&  __hobby.ageGroups.map(({
      id,
      name,
    }) => ({
      value: id,
      label: name,
    }));

    return (
      <div className={s.root}>
        <View
          filters={filters}
          hobbiesOptions={orderedHobbiesOptions}
          haveTitles={haveTitles}
          selectedHobbies={selectedHobbies}
          isMobile={isMobile}
          role={role}

          onUpdate={(hobby, index) => {
            selectedHobbies[index] = hobby;
            this.setState({selectedHobbies});
          }}

          onHobbyRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteHobby')).then(() => {
              this.setState({
                selectedHobbies: [
                  ...selectedHobbies.slice(0, i),
                  ...selectedHobbies.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...selectedHobbies.slice(0, i),
                  ...selectedHobbies.slice(i + 1)
                ])
              });
            });
          }}
        />
        {
          displayForm && (
            <Popup
              className={s.popUpModifier}
              notShowCloser
              onClose={() => {
                this.setState({
                  displayForm: false,
                })
              }}
            >
              <Form
                isMobile={isMobile}
                filters={filters}
                hobbiesList={orderedHobbiesOptions}
                audience={__hobby && __hobby.audience}
                hobbyAgeGroupsList={hobbyAgeGroupsList}
                hobbyTitlesList={
                  haveTitles
                  ? this.getHobbyTitlesOptions(role)
                  : null
                }
                audienceOptions={[
                  {value: 'children', label: 'copii'},
                  {value: 'all', label: 'all'},
                  {value: 'adults', label: 'adulti'},
                ]}
                __audienceForCommonHobbies={__audienceForCommonHobbies}
                __hobby={__hobby}
                __title={__title}
                __ageGroups={__ageGroups}

                onClose={() => {
                  this.setState({
                    displayForm: false,
                  })
                }}
                onSubmit={() => {
                  if(__hobby) {
                    const audience = __audienceForCommonHobbies
                    ? __audienceForCommonHobbies.value
                    : __hobby.audience;

                    const hobby ={
                      hobby: __hobby,
                      titles: __title,
                      ageGroups: audience === 'adults'? hobbyAgeGroupsList? [hobbyAgeGroupsList[0]] : null : __ageGroups,
                      audience,
                    };

                    const hobbiesToInclude = selectedHobbies.some(currentHobby => hobby.hobby.value === currentHobby.hobby.value)
                      ? selectedHobbies
                      : selectedHobbies.concat(hobby)

                    this.setState({
                      selectedHobbies: hobbiesToInclude,
                      displayForm: false,
                      __hobby: null,
                      __title: null,
                      __ageGroups: null,
                    }, () => {
                      onChange(
                        selectedHobbies.concat(hobby)
                      )
                    })
                  }
                }}

                onHobbyChange={__hobby => {
                  this.setState({
                    __hobby,
                    __title: null,
                    __ageGroups: null,
                    __audienceForCommonHobbies: null,
                  })
                }}

                onTitleChange={__title => this.setState({__title})}
                onAgeGroupsChange={__ageGroups => this.setState({__ageGroups})}
                onAudienceChange={__audienceForCommonHobbies =>
                  this.setState({__audienceForCommonHobbies})
                }
              />
            </Popup>
          )
        }
        <div className={s.listItem}
          onClick={() => {this.setState({displayForm: !displayForm})}}
        >
          <span>
            {(!selectedHobbies.length && (
              I18n.t('general.components.multipleAdd.hobbiesNotFound')
            )) || ` `}
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
    profileDetails: store.user
  };
}

export default connect(mapStateToProps)(withStyles(s)(Hobbies));
