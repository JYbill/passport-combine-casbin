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

/**
 * github 授权相关接口
 */
export interface GithubAuthResponse {
  code: string;
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
}

export interface GithubToken extends Pick<GithubAuthResponse, 'error' | 'error_description' | 'error_uri'> {
  access_token: string;
  token_type: string;
  scope: string;
}
