
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  addFavourite: ['data'],
  removeFavourite: ['data'],
})

export const favouriteTypes = Types
export default Creators
