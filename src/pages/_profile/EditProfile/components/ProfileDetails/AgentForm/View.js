import React from "react";
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../ProfileDetails.scss";
import 'react-datetime/css/react-datetime.css'
import {I18n} from "react-redux-i18n";

const View = ({
  switchEditMode,
  admin,
  demo,
    agentDetails:{
      name,
      logo,
      email,
      phoneNumber,
      status
    },
    promotion,
  }) => (
  <div className={s.root}>
    <div className={s.options}>
      <div className={s.avatar}>
        {
          (logo && (
            <img src={logo.src} alt={name} />
          )) || (
            <i className='icon-man' />
          )
        }
      </div>
      <div className={classes(s.profileDetails, s.view)}>
        <h3 className={s.userName}>
          {name}
        </h3>

        {
          email && (
            <div className={s.detaildsField}>
              <i className="icon-envelope" />
              <p>{email}</p>
            </div>
          )
        }

        {
          phoneNumber && (
            <div className={s.detaildsField}>
              <i className="icon-phone" />
              <p>{phoneNumber}</p>
            </div>
          )
        }
    </div>
    </div>

        <div className={s.editMode}>
          {
            (!!admin || !demo) && (
              <button
                key="Promotion"
                className={classes(s.activate, {
                  [s.active]: status.promotion,
                })
                }
                onClick={promotion}
              >
                {I18n.t('products.promotion')}
              </button>
            )
          }
          <button
            className="edit round-button"
            onClick={switchEditMode}
          />
        </div>
  </div>
);

export default withStyles(s)(View);
