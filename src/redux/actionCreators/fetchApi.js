
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  fetchRequest: [],
  fetchSuccess: ['data'],
  fetchFailure: ['error'],

  fetchMenuRequest: ['data'],
  fetchMenuSuccess: ['data'],
  fetchMenuFailure: ['error'],

  fetchTagsRequest: ['data'],
  fetchTagsSuccess: ['data'],
  fetchTagsFailure: ['error'],
  
  fetchSearchRequest: ['data'],
  fetchSearchSuccess: ['data'],
  fetchSearchFailure: ['error'],

  fetchLanguageRequest: ['data'],
  fetchLanguageSuccess: ['data'],
  fetchLanguageFailure: ['error']
})

export const fetchTypes = Types
export default Creators
