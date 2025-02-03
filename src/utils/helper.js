export function shouldNavigate(navArray, pageName) {
  var lastPage = navArray[navArray.length - 1];
  return lastPage.routeName != pageName;
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}