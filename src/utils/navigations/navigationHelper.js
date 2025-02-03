import * as navigationService from './navigationService'
export async function navigateHelper(data = '', navigation, nodeMap) {
  //console.log('data NH >>> ', data);
  // console.log('log >> navigation >>>', navigation);
  if (!data) {
    navigation.push('Home',{
      params: {isParent: true},
      key: 'Home',
    });
  }
  let searchText = data.searchText ? data.searchText : null;
  var nextNid = data && data.next_nid ? data.next_nid : '';
  var prevNid = data && data.prev_nid ? data.prev_nid : '';
  var parentNid = data && data.parent_nid ? data.parent_nid : '';
  var nodeMapData = nodeMap ? nodeMap[parentNid] : {};
  var nodeId = data && data.nid ? data.nid : '';
  var deeperLink = data && data.deeperlink ? data.deeperlink : [];
  var title = data && data.headerTitle ? data.headerTitle : '';
  
  switch (data.menu_type) {
    case 'mirror_content':
    case 'content':
    case 'decision_tree':
    case 'news_feed':
    case 'content-menulist':
    case 'accord':
      if (data.menu_type == 'mirror_content') {
        let original_content = data.original_content;
        navigation.navigate('CarousalView',{
          // name: 'CarousalView',
          key: original_content,
          params: {
            nid: original_content,
            nodeMap: nodeMap,
            title: nodeMapData && nodeMapData.title ? nodeMapData.title : title,
            parentNid: parentNid,
            nextNid: nextNid,
            prevNid: prevNid,
            searchText,
          },
        });
      } else {
        let myParams = {
          nid: nodeId,
          nodeMap: nodeMap,
          title: nodeMapData && nodeMapData.title ? nodeMapData.title : title,
          weight: nodeMapData.weight,
          parentNid: parentNid,
          nextNid: nextNid,
          prevNid: prevNid,
          searchText,
        };
        navigationService.push('CarousalView',{
          key: nodeId,
          myParams
        });
        navigationService.drawerClose()
        
      }
      break;
    case 'menu_list':
      navigation.navigate('MenuList', {data});
      break;
    case 'menu_squares':
      navigation.navigate('SquareMenu', {
        data,
      });
      break;
    default:
      navigation.navigate('Home',{
        params: {isParent: true},
        key: 'Home',
      });
      break;
  }
}
