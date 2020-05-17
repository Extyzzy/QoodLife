import React, { Component } from 'react';
import Popup from '../../../_popup/Popup/Popup';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../MultipleAdd.scss';

import Form from './Form';

class ListItem extends Component {
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;

    this.state = {
      editMode: false,
      name: data.name,
      __title: data.name,
      __allNames: data.allNames
    };
  }

  componentWillReceiveProps(nextprops) {
    const { data } = nextprops;

    this.setState({
      name: data.name
    });
  }

  render() {
    const { editMode, name, __title, __allNames } = this.state;

    const { onUpdate, isMobile, data, onTitleRemove } = this.props;

    return (
      <div>
        {editMode && (
          <Popup
            notShowCloser
            onClose={() => {
              this.setState({ editMode: !editMode });
            }}
          >
            <Form
              __title={__title}
              isMobile={isMobile}
              __allNames={__allNames}
              onSubmit={() => {
                if (__title !== '') {
                  this.setState(
                    {
                      editMode: false
                    },
                    () => {
                      onUpdate({
                        id: data.id || null,
                        name: __title,
                        allNames: data.allNames
                      });
                    }
                  );
                }
              }}
              onTitleChange={({ target: { value: __title } }) => {
                this.setState({ __title });
              }}
            />
          </Popup>
        )}
        <div className={s.listItem}>
          {
            (window.location.href.indexOf('administration') !== -1 && (
              <span>
                {
                  __allNames &&(
                     __allNames.name_ro + ' '
                  )
                }
                  - {name}</span>
            )) || (
              <span>{name}</span>
            )
          }

          <div
            className={classes(s.options, {
              [s.mobile]: isMobile
            })}
          >
            <i
              className={`${s.optionsItem} icon-edit-o`}
              onClick={() => {
                this.setState({
                  editMode: !editMode
                });
              }}
            />
            <i
              className={`${s.optionsItem} icon-remove-o`}
              onClick={onTitleRemove}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ListItem);
