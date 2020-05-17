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
      mediaType: {
        value: data.id,
        label: data.name,
      },
      linkUrl: data.url,

      __mediaType: {
        value: data.id,
        label: data.name,
      },
      __linkUrl: data.url,
    };
  };

  componentWillReceiveProps(nextprops){
    const { data } = nextprops;
    this.setState({
      linkUrl: data.url,
    })
  }

  render() {
    const {
      editMode,
      linkUrl,
      __mediaType,
      __linkUrl,
    } = this.state;

    const {
      onLinkRemove,
      mediaOptions,
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
                this.setState({editMode: !editMode})
              }}
            >
              <Form
                mediaOptions={mediaOptions}
                __mediaType={__mediaType}
                __linkUrl={__linkUrl}
                isMobile={isMobile}

                onSubmit={() => {
                  if(__mediaType && __linkUrl.length > 5) {
                    const newLink = {
                      id: __mediaType.value,
                      name: __mediaType.label,
                      url: __linkUrl,
                    }
                    this.setState({
                      editMode: false,
                    }, () => {
                      onUpdate(newLink)
                    })
                  }
                }}

                onMediaTypeChange={__mediaType => {
                  this.setState({__mediaType})
                }}

                onLinkUrlChange={({target: {value: __linkUrl}}) => {
                  this.setState({__linkUrl})
                }}
              />
            </Popup>
          )
        }
        <div className={s.listItem}>
          <div className={s.linkslist}>{linkUrl}</div>
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
              onClick={onLinkRemove}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ListItem);
