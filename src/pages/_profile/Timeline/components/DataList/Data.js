import React, { Component } from "react";
import ComponentsList from '../../../../../components/ComponentsList';
import EventsListItem from '../../../../_events/Events/components/ListItem';
import PostsListItem from '../../../../_blog/Blog/components/ListItem';
import ProductsListItem from '../../../../_products/Products/components/ListItem';
import GroupsListItem from '../../../../_groups/Groups/components/ListItem';

class Data extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      newData: [],
      loadMoreData: [],
    };
  }

  componentDidMount() {
    const {
      allData,
      lastSeen_2,
    } = this.props;

    const shuffle = allData.filter(data => lastSeen_2 > data.createdAt );
    const lastSeenData = allData.filter(data => data.createdAt  > lastSeen_2);

    for (let i = lastSeenData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lastSeenData[i], lastSeenData[j]] = [lastSeenData[j], lastSeenData[i]];
    }

    for (let i = shuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }

    this.setState({newData: [...lastSeenData, ...shuffle]});
  }

  componentWillReceiveProps( nextprops ){
    const { loadMoreData } = nextprops;
    const { lastSeen_2 } = this.props;

    const shuffle = loadMoreData.filter(data => lastSeen_2 > data.createdAt );
    const lastSeenData = loadMoreData.filter(data => data.createdAt  > lastSeen_2);

    for (let i = lastSeenData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lastSeenData[i], lastSeenData[j]] = [lastSeenData[j], lastSeenData[i]];
    }

    for (let i = shuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }

    this.setState({loadMoreData: [...lastSeenData, ...shuffle]});
  }

  render() {
    const {
      newData,
      loadMoreData
    } = this.state;

    const {
      onPopupComponentWillUnmount,
      itemPopupActionButtonsForProducts,
      itemPopupActionButtonsGroups,
      itemPopupActionButtonsForPosts,
      itemPopupActionButtonsForEvents,
      lastSeen_1,
      lastSeen_2,
    } = this.props;

    loadMoreData.map(data => newData.push(data));

    const uniqueArray = newData.filter(function(item, pos) {
      return newData.indexOf(item) === pos;
    });

    return (
      <div>
        {
          uniqueArray.map((element, key) => {

            let type;
            let actionButtons;

            switch(element.type) {
              case 'event':
                type = EventsListItem;
                actionButtons = itemPopupActionButtonsForEvents;
                break;
              case 'product':
                type = ProductsListItem;
                actionButtons = itemPopupActionButtonsForProducts;
                break;
              case 'group':
                type = GroupsListItem;
                actionButtons = itemPopupActionButtonsGroups;
                break;
              default:
                type = PostsListItem;
                actionButtons = itemPopupActionButtonsForPosts;
            };
            return (
              <ComponentsList
                key={key}
                list={[element]}
                component={type}
                popupActionButtons={actionButtons}
                onPopupComponentWillUnmount={onPopupComponentWillUnmount}
                lastSeen_1={lastSeen_1}
                lastSeen_2={lastSeen_2}
              />
            )
          })
        }
      </div>
    )
  }
}

export default Data;
