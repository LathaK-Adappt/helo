import * as React from 'react';
import { DrawerActions, StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function reset(name, params) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: name }],
  });
}
export function drawerClose() {
  navigationRef.current?.dispatch( DrawerActions.closeDrawer());
}

export function drawer() {
  navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
}
export function push(name,params) {
  navigationRef.current?.dispatch(StackActions.push(name,{
         params
         }))
}
export function goBack() {
  navigationRef.current?.goBack();
}