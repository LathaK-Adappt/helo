
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  checkVersion: ['versionInfo'],
  fetchVersionRequest: ['data'],
  fetchVersionSuccess: ['data'],
  fetchVersionFailure: ['error']
})

export const VersionTypes = Types
export default Creators
