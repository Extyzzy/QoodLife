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

    this.state = {
      editMode: false,
      __region: data.region,
      position: data.position,
      institution: data.institution,
      location: data.location,
      __position: data.position,
      __institution: data.institution,
      __location: data.location,
    };
  };

  componentWillReceiveProps(nextprops){
    const { data } = nextprops;

    this.setState({
      position: data.position,
      institution: data.institution,
      location: data.location,
    })
  }

  render() {
    const {
      editMode,
      institution,
      position,
      __institution,
      __position,
      __location,
      __region,
    } = this.state;

    const {
      onInstitutionRemove,
      onUpdate,
      isMobile,
    } = this.props;

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
                __institution={__institution}
                __position={__position}
                __location={__location}
                isMobile={isMobile}

                onSubmit={() => {
                  if(__institution !== '' && __position !== '' && __location) {
                    const workingplace = {
                      institution: __institution,
                      position: __position,
                      location: __location,
                      region: __location.country_init || __region,
                    }
                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate(workingplace)
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
        <div className={s.listItem}>
          <span>{`${institution}, ${position}`}</span>
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
              onClick={onInstitutionRemove}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ListItem);
