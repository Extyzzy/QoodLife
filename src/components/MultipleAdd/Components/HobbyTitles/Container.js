import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { confirm } from '../../../_popup/Confirm/confirm';
import classes from 'classnames';
import Popup from '../../../_popup/Popup/Popup';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../MultipleAdd.scss';

import View from './View';
import Form from './Form';

class HobbyTitles extends Component {
  constructor(props, context) {
    super(props, context);

    const { titlesList } = this.props;

    this.state = {
      displayForm: false,
      titlesList: titlesList || null,
      __title: '',
    };
  }

  render() {
    const { onChange, isMobile } = this.props;

    const { titlesList, displayForm, __title } = this.state;

    return (
      <div className={s.root}>
        <View
          titlesList={titlesList}
          onUpdate={(title, index) => {
            titlesList[index] = title;
            this.setState({ titlesList });
          }}
          onTitleRemove={i => {
            confirm(I18n.t('administration.confirmRemove')).then(() => {
              this.setState(
                {
                  titlesList: [
                    ...titlesList.slice(0, i),
                    ...titlesList.slice(i + 1)
                  ],
                  displayForm: false
                },
                () => {
                  onChange([
                    ...titlesList.slice(0, i),
                    ...titlesList.slice(i + 1)
                  ]);
                }
              );
            });
          }}
        />
        {displayForm && (
          <Popup
            notShowCloser
            onClose={() => {
              this.setState({ displayForm: false });
            }}
          >
            <Form
              __title={__title}
              isMobile={isMobile}
              onSubmit={() => {
                if (__title !== '') {
                  this.setState(
                    {
                      titlesList: titlesList.concat({ name: __title }),
                      displayForm: false,
                      __title: ''
                    },
                    () => {
                      onChange(titlesList.concat({ name: __title }));
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
        <div
          className={s.listItem}
          onClick={() => {
            this.setState({ displayForm: !displayForm });
          }}
        >
          <span>
            {!titlesList
              ? I18n.t('general.components.multipleAdd.titlesNotFound')
              : ` `}
          </span>
          <div
            className={classes(s.options, {
              [s.mobile]: isMobile
            })}
          >
            <i
              className={`${s.optionsItem} icon-plus-o`}
              onClick={() => {
                this.setState({
                  displayForm: true
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(HobbyTitles);
