import { default as fetchCreator } from './fetchApi'
import { default as versionCreator } from './version';
import { default as importCreator } from './importData';
import { default as syncCreator } from './sync';
import { default as favouriteCreator } from './favourites';
import { default as searchCreator } from './search';

export { Types } from './fetchApi';
export { VersionTypes } from './version';
export { importDataTypes } from './importData';
export { syncTypes } from './sync';
export { favouriteTypes } from './favourites';
export { searchTypes } from './search';

export default {
    ...fetchCreator, ...versionCreator, ...importCreator, ...syncCreator, ...favouriteCreator, ...searchCreator
}