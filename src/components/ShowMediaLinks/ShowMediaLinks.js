import React, { Component } from 'react';
import {FaOdnoklassniki, FaLinkedin, FaInstagram} from "react-icons/lib/fa/index";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ShowMediaLinks.scss';

class ShowMediaLinks extends Component {
  render(){
    const { linksList } = this.props;

    return(
      <div className={s.root}>
        {
          linksList.map((link, i) => {
            return (
              <div key={i} className={s.link}>
                {(() => {
                  switch (link.code) {
                    case 'facebook':
                      return (
                        <i className='icon-facebook' />
                      )
                    case 'twitter':
                      return (
                        <i className='icon-twitter' />
                      )
                    case 'instagram':
                      return (
                        <FaInstagram />
                      )
                    case 'linkedin':
                      return (
                        <FaLinkedin/>
                      )
                    case 'ok':
                      return (
                        <FaOdnoklassniki/>
                      )
                    default:
                      return (
                        <i className='icon-globe' />
                      )
                  }
                })()}
                <a href={link.url} target="_blank">{link.url}</a>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default withStyles(s)(ShowMediaLinks);
