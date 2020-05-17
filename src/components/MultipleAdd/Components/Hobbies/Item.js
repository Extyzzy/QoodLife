import React, { Component } from 'react';
import Popup from "../../../_popup/Popup/Popup";
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

import Form from './Form';

class ListItem extends Component {
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;

    const audienceOptions=[
      {value: 'children', label: 'copii'},
      {value: 'all', label: 'all'},
      {value: 'adults', label: 'adulti'},
    ];

    this.state = {
      editMode: false,
      hobby: data.hobby,
      __hobby: data.hobby,
      __title: data.titles ? data.titles.map(({
         id,
         name,
       }) => ({
        value: id,
        label: name,
      })) : null,
      __ageGroups: data.ageGroups,
      __audienceForCommonHobbies: audienceOptions.find(a =>
        a.value === data.audience
      ),
    };
  };

  componentWillReceiveProps(nextProps){
    const { data } = nextProps;

    this.setState({
      hobby: data.hobby,
    })
  }

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
      } else if (__hobby.titles) {
        switch (role) {
          case 'professional':
            return(
              __hobby.titles.professional.map(({
                 id: value,
                 name: label
               }) => ({value, label}))
            );
          case 'place':
            return(
              __hobby.titles.place.map(({
                id: value,
                name: label
              }) => ({value, label}))
            );
          default:
            return(
              __hobby.titles.professional.map(({
                id: value,
                name: label
              }) => ({value, label}))
            )
        }
      }
    }
  }

  render() {
    const {
      editMode,
      hobby,
      __hobby,
      __title,
      __ageGroups,
      __audienceForCommonHobbies,
    } = this.state;

    const {
      onHobbyRemove,
      hobbiesOptions,
      role,
      haveTitles,
      onUpdate,
      isMobile,
      filters,
    } = this.props;

    const hobbyAgeGroupsList = __hobby && __hobby.ageGroups && __hobby.ageGroups.map(({
      id,
      name,
    }) => ({
      value: id,
      label: name,
    }));

    return (
      <div>
        {
          editMode && (
            <Popup
              notShowCloser
              onClose={() => this.setState({editMode: !editMode})}
            >
              <Form
                isMobile={isMobile}
                filters={filters}
                hobbiesList={hobbiesOptions}
                audience={__hobby.audience}
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

                __hobby={__hobby}
                __title={__title}
                __ageGroups={__ageGroups}
                __audienceForCommonHobbies={__audienceForCommonHobbies}

                onSubmit={() => {
                  if(__hobby) {
                    const audience = __audienceForCommonHobbies
                    ? __audienceForCommonHobbies.value
                    : __hobby.audience;

                    const hobby ={
                      hobby: __hobby,
                      titles: __title,
                      ageGroups: __ageGroups,
                      audience,
                    };

                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate(hobby)
                    })
                  }
                }}

                onHobbyChange={__hobby => {
                  this.setState({
                    __hobby,
                    __title: null,
                    __audienceForCommonHobbies: null,
                    __ageGroups: null,
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
        <div className={s.listItem}>
          <span>{hobby.label}</span>
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
              onClick={onHobbyRemove}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ListItem);
