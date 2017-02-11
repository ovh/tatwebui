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


export class SignUpRequest {
  username: string;
  fullname: string;
  email: string;
  callback: string;
}

export class ResetPasswordRequest {
  username: string;
  email: string;
  callback: string;
}

export class VerifyResponse {
  message: string;
  username: string;
  password: string;
  url: string;
}

export class InfoResponse {
  info: string;
}
