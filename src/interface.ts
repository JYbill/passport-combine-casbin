import { FieldSelectable } from './type';

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

export interface IPrismaSearch<T> {
  where?: Partial<T>;
  select?: FieldSelectable<T, boolean | number>;
}

export interface IPrismaCreate<T> {
  data: Partial<T>;
}

export interface IPrismaUpdate<T> {
  data: Partial<T>;
  where: Partial<T>;
  select?: Partial<T>;
}

export interface IPrismaUpsert<T> {
  create: Partial<T>;
  update: Partial<T>;
  where: Partial<T>;
}
