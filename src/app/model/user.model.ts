export class User {
  _id: number;
  username: string;
  fullname: string;
  email: string;
  groups: Array<string>;
  isAdmin: boolean;
  isSystem: boolean;
  isArchived: boolean;
  canWriteNotifications: boolean;
  canListUsersAsAdmin: boolean;
  favoritesTopics: Array<string>;
  offNotificationsTopics: Array<string>;
  favoritesTags: Array<string>;
  dateCreation: number;
  contacts: Array<Contact>;

  // UI data
  password: string;
}

export class Contact {
  username: string;
  fullname: string;
}
