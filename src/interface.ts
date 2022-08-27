/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: string;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data: IUserOptions;
}

export interface GithubAuthResponse {
  code: string;
  error: string;
  error_description: string;
  error_uri: string;
}
