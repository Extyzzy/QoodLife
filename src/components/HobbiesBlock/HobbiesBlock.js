import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import update from 'immutability-helper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HobbiesBlock.scss';

class HobbiesBlock extends Component {
  static propTypes = {
    hobbiesList: PropTypes.array.isRequired,
    maxHeight: PropTypes.number.isRequired,
    isPopup: PropTypes.bool,
  };

  static defaultProps = {
    isPopup: false,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
       hobbyList: props.hobbiesList,
       displayPopover: false
    };
  };

  componentWillReceiveProps({hobbiesList}) {
    this.setState({
      hobbyList: hobbiesList,
      displayPopover: false,
    });
  }

  render() {
    const {
      hobbyList,
      displayPopover,
    } = this.state;

    const {
      hobbiesList,
      maxHeight,
      isPopup,
    } = this.props;

    return (
      <div
        className={s.root}
        ref={ref => {
          if (ref) {
            if(ref.offsetHeight >= maxHeight) {
              this.setState({
                hobbyList: update(hobbyList, {
                  $splice: [[-1, 1]],
                }),
                displayPopover: true,
              });
            }
          }
        }}
      >
        <div className={classes(s.hobbyBlock, {[s.HobbiesInPopup]: isPopup})}>
           { hobbyList.map(({name}) => name).join(', ') }
        </div>

        {
          displayPopover && (
            <OverlayTrigger
               trigger="click"
               {...(isPopup ? {container: this} : {})}
               rootClose
               placement="top"
               overlay={
                 <Popover
                   id="popover-trigger-click-root-close"
                   className={classes({[s.popoverInPopup]: isPopup})}
                 >
                   {hobbiesList.map(h => h.name).join(', ')}
                 </Popover>
               }
            >
              <span className={classes({[s.seeMoreInPopup]: isPopup})}>...</span>
            </OverlayTrigger>
          )
        }
      </div>
    );
  }
}

export default withStyles(s)(HobbiesBlock);
