
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  importMenuData: ['data'],
  importMenuFailure: [],

  importTagsData: ['data'],
  importTagsFailure: [],

  importSearchData: ['data'],
  importSearchFailure: [],

  importLanguageData: ['data'],
  importLanguageFailure: [],
  
  importVersion: ['versionInfo'],
  
  importContentFromAssets: ['data']
})

export const importTypes = Types
export default Creators
