import Config from 'react-native-config';

export const VERSION_URL = `${Config.API_URL}${Config.INSTANCE}/version.json`;
export const MENU_URL_PREFIX = `${Config.API_URL}${Config.INSTANCE}/menu`;
export const NODE_URL_PREFIX = `${Config.API_URL}${Config.INSTANCE}/nodes/`;
export const NODE_VERSION_URL = `${Config.API_URL}${Config.INSTANCE}/nodeversion.json`;

export const TAGS_URL_PREFIX = `${Config.TAGS_URL}`;
export const SEARCH_URL_PREFIX = `${Config.API_URL}${Config.INSTANCE}/search`;
export const LANGUAGES_URL = `${Config.LANGUAGES_URL}`;
export const CAROUSEL_URL = `${Config.CAROUSEL_URL}`;

export const NODE_URL_SUFFIX = `${Config.EXT}`;
export const JSON_SUFFIX = `${Config.EXT}`;

export const STORE_URL = {
  appStoreURL: `${Config.APPSTOREURL}`,
  playStoreURL: `${Config.PLAYSTOREURL}`,
  deepLinkURL: `${Config.DEEPLINKURL}`,
  emailSubject: 'WHO HIV Tx',
};
export const LANGUAGES = [
  {
    name: 'English',
    code: 'en',
    primaryLabel: 'Language',
    secondaryLabel: 'Select Language',
    quickMenu: 'Quick Menu',
    search: 'Search',
    searchHere: 'Search here',
    noContent: 'No Content Available',
    noContentLabel: 'Content will become available in a future version.',
    noResultSearch: 'No results found for',
    favorites: 'Favorites',
    noFavorite: 'No Favorites Found',
    switchLanguage: 'Switching Language...',
    changeLanguageConfirmation1: 'Your current language is',
    changeLanguageConfirmation2: 'Do you want to switch to ',
    confirmation: 'Confirmation',
    ok: 'OK',
    cancel: 'Cancel',
    message1: 'The content you are trying to view is in',
    message2: 'To view it please switch to',
    message3: 'and click the shared link again.',
    related: 'Related Content',
    shareText1:
      'Somebody has shared content from the WHO HIV Tx app! If you have WHO HIV Tx installed on your device please click the link below to view the shared content',
    shareText2:
      'If you do not yet have the WHO HIV Tx installed on your device, you may download it here:',
    notificationTitle: 'Notification',
    externalNotificationMsg:
      'This is an external link. Do you want to leave WHO HIV Tx?',
    checkingUpdate: 'Checking for updates...',
    noUpdate: 'Data is up-to-date.',
    fetchingUpdate: 'Fetching updates...',
    updateSuccess: 'App updated successfully.',
    serverIssue: 'Updation failed.',
    lowInternet: 'Low internet connection.',
    noInternet: 'No internet connection.',
    noCountry: 'No Countries found',
    requestFailure: 'Web page is not available',
    internetLost: 'Please try again later',
    recommendation: 'Recommendation',
    version: 'Version:',
    calculator: 'TPT Dosage Calculator',
  },
  {
    name: 'Français',
    code: 'fr',
    primaryLabel: 'Langue',
    secondaryLabel: 'Choisir la Langue',
    quickMenu: 'Menu Rapide',
    search: 'Chercher',
    searchHere: 'Cherche ici',
    noContent: 'Pas De Contenu Disponible',
    noResultSearch: 'Aucun résultat trouvé pour',
    favorites: 'Préférés',
    noFavorite: 'Aucun Préférés trouvé',
    switchLanguage: 'Changer de langue...',
    changeLanguageConfirmation1: 'Votre langue actuelle est',
    changeLanguageConfirmation2: 'Voulez-vous passer à ',
    confirmation: 'Confirmation',
    ok: "D'accord",
    cancel: 'Annuler',
    message1: 'le contenu que vous essayez de regarder est en',
    message2: 'Pour le voir, veuillez passer à',
    message3: 'et cliquez de nouveau sur le lien partagé.',
    related: 'Contenu connexe',
    shareText1:
      "Quelqu'un a partagé le contenu de l'application ARV Guidelines! Si vous avez ARV Guidelines installé sur votre appareil s'il vous plaît cliquer sur le lien ci-dessous pour afficher le contenu partagé",
    shareText2:
      "Si vous n'avez pas encore installé ARV Guidelines sur votre appareil, vous pouvez le télécharger ici",
    notificationTitle: 'Notification',
    externalNotificationMsg:
      'Ceci est un lien externe. Voulez-vous quitter ARV Guidelines?',
    checkingUpdate: 'Vérification des mises à jour.',
    noUpdate: 'Les données sont à jour.',
    fetchingUpdate: 'Récupération des mises à jour',
    updateSuccess: 'App mis à jour avec succès.',
    serverIssue: 'La mise à jour a échoué.',
    lowInternet: 'Connexion internet basse.',
    noInternet: 'Pas de connexion Internet.',
    noCountry: 'Aucun pays trouvé',
    requestFailure: "La page Web n'est pas disponible",
    internetLost: 'Veuillez réessayer plus tard',
  },
];
