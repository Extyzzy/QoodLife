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
      institution: data.institution,
      __institution: data.institution,
    };

  };

  componentWillReceiveProps(nextprops){
    const { data } = nextprops;

    this.setState({
      institution: data.institution,
    })
  }

  render() {
    const {
      editMode,
      institution,
      __institution,
    } = this.state;

    const {
      onInstitutionRemove,
      onUpdate,
      isMobile,
    } = this.props;

    return (
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
                isMobile={isMobile}

                onSubmit={() => {
                  if(__institution !== '') {
                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate({institution: __institution})
                    })
                  }
                }}

                onInstitutionChange={({target: {value: __institution}}) => {
                  this.setState({__institution})
                }}
              />
            </Popup>
          )
        }
        <div className={s.listItem}>
          <span>{institution}</span>
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
    );
  }
}

export default withStyles(s)(ListItem);
