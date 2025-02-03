
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  reqSearchList: ['str'],
  setSearchList: ['searchList'],
  clearSearchList: []
})

export const searchTypes = Types
export default Creators
