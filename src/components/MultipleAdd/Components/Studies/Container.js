import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from "../../../_popup/Popup/Popup";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

import View from './View';
import Form from './Form';

class Studies extends Component {
  constructor(props, context) {
    super(props, context);

    const { institutions } = this.props;

    this.state = {
      displayForm: false,
      institutionsList: institutions || null,
      __institution: '',
    };
  };

  render() {
    const {
      onChange,
      isMobile,
    } = this.props;

    const {
      institutionsList,
      displayForm,
      __institution,
    } = this.state;

    return (
      <div className={s.root}>
        <View
          institutionsList={institutionsList}
          isMobile={isMobile}

          onUpdate={(institution, index) => {
            institutionsList[index] = institution;
            this.setState({institutionsList});
          }}

          onInstitutionRemove={(i) => {
            confirm(I18n.t('general.components.multipleAdd.confirmDeleteStudyPlace')).then(() => {
              this.setState({
                institutionsList: [
                  ...institutionsList.slice(0, i),
                  ...institutionsList.slice(i + 1)
                ],
                displayForm: false
              }, () => {
                onChange([
                  ...institutionsList.slice(0, i),
                  ...institutionsList.slice(i + 1)
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
                __institution={__institution}
                isMobile={isMobile}

                onClose={() => {
                  this.setState({displayForm: false})
                }}
                onSubmit={() => {
                  if(__institution !== '') {
                    this.setState({
                      institutionsList: institutionsList.concat({institution: __institution}),
                      displayForm: false,
                      __institution: '',
                    }, () => {
                      onChange(
                        institutionsList.concat({institution: __institution})
                      )
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
        <div className={s.listItem}
          onClick={() => {this.setState({displayForm: !displayForm})}}
        >
          <span>
            {(!institutionsList.length && I18n.t('general.components.multipleAdd.studiesNotFound')) || ` `}
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

export default withStyles(s)(Studies);
