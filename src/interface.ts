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

/**
 * prisma 操作符接口
 */
type TOperation =
  | 'equals'
  | 'not'
  | 'in'
  | 'notIn'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'search'
  | 'mode'
  | 'startsWith'
  | 'endsWith'
  | 'AND'
  | 'OR'
  | 'NOT';
type TPrismaOperation = Record<TOperation, any>;

// prisma where 条件Type
type TPrismaWhere<T> = Partial<Record<keyof T, any | TPrismaOperation>> | any;

export interface IPrismaSearch<T> {
  where?: TPrismaWhere<T>;
  select?: FieldSelectable<T, boolean | number>;
}

export interface IPrismaCreate<T> {
  data: Partial<T>;
}

export interface IPrismaUpdate<T> {
  data: Partial<T>;
  where: TPrismaWhere<T>;
  select?: Partial<T>;
}

export interface IPrismaUpsert<T> {
  create: Partial<T>;
  update: Partial<T>;
  where: TPrismaWhere<T>;
}

export interface IPrismaDelete<T> {
  select?: Partial<T>;
  where: TPrismaWhere<T>;
}
