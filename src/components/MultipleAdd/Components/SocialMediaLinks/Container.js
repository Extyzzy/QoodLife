import React, { Component } from 'react';
import { connect } from "react-redux";
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from "../../../_popup/Popup/Popup";
import View from './View';
import Form from './Form';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

class SocialMediaLinks extends Component {
  constructor(props, context) {
    super(props, context);
    const { links } = this.props;

    this.state = {
      linkslist: links || null,
      __mediaType: null,
      __linkUrl: '',
      displayForm: false,
    };
  };

  getMediaTypesOptions() {
    const { socialMediaTypesList } = this.props;

    return socialMediaTypesList.map(({
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
      displayForm,
      linkslist,
      __mediaType,
      __linkUrl,
    } = this.state;

    return (
      <div className={s.root}>
        <View
          mediaOptions={this.getMediaTypesOptions()}
          linkslist={linkslist}
          isMobile={isMobile}

          onUpdate={(link, index) => {
            linkslist[index] = link;
            this.setState({linkslist});
          }}

          onLinkRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteSocialMediaLink')).then(() => {
              this.setState({
                linkslist: [
                  ...linkslist.slice(0, i),
                  ...linkslist.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...linkslist.slice(0, i),
                  ...linkslist.slice(i + 1)
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
                this.setState({displayForm: false})
              }}
            >
              <Form
                mediaOptions={this.getMediaTypesOptions()}
                __mediaType={__mediaType}
                __linkUrl={__linkUrl}
                isMobile={isMobile}
                onClose={() => {
                  this.setState({displayForm: false})
                }}
                onSubmit={() => {
                  if(__mediaType && __linkUrl.length > 5) {
                    const newLink = {
                      id: __mediaType.value,
                      name: __mediaType.label,
                      url: __linkUrl,
                    }
                    this.setState({
                      linkslist: linkslist.concat(newLink),
                      displayForm: false,
                      __mediaType: null,
                      __linkUrl: '',
                    }, () => {
                      onChange(linkslist.concat(newLink))
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
        <div className={s.listItem}
          onClick={() => {this.setState({displayForm: !displayForm})}}
        >
          <div className={s.linkslist}>
            {(!linkslist.length && I18n.t('general.components.multipleAdd.socialMediaLinksNotFound')) || ` `}
          </div>
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
    socialMediaTypesList: store.socialMediaTypes.list,
  };
}

export default connect(mapStateToProps)(withStyles(s)(SocialMediaLinks));
