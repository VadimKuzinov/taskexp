/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthenticateReq {
  userName?: string | null;
  password?: string | null;
}

export interface AuthenticateResp {
  /** @format int32 */
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  token?: string | null;
}

export interface CreateProjectReq {
  project?: Project;
}

export interface CreateTaskReq {
  taskModel?: TaskModel;
}

export interface DeleteTaskReq {
  number?: TaskNumber;
}

export interface GetTaskByNumberReq {
  number?: TaskNumber;
}

export interface GetTaskByNumberResp {
  task?: TaskModelWithNumber;
}

export interface GetTasksByAuthorReq {
  login?: string | null;
}

export interface GetTasksByAuthorResp {
  tasks?: TaskModelWithNumber[] | null;
}

export interface GetTasksByProjectReq {
  projectTitle?: string | null;
}

export interface GetTasksByProjectResp {
  tasks?: TaskModelWithNumber[] | null;
}

export interface ListAvailableStatusesReq {
  status?: TaskStatusModel;
}

export interface ListAvailableStatusesResp {
  statuses?: TaskStatusModel[] | null;
}

export interface ListProjectsResp {
  projects?: Project[] | null;
}

export interface ListStatusesResp {
  statuses?: TaskStatusModel[] | null;
}

export interface Project {
  number?: string | null;
  title?: string | null;
}

export interface RegisterReq {
  user?: UserDto;
}

export interface TaskModel {
  title?: string | null;
  description?: string | null;
  /** @format date-time */
  dueDate?: string | null;
  /** @format int32 */
  projectId?: number | null;
  /** @format int32 */
  sprintId?: number | null;
  creatorLogin?: string | null;
  assignedToLogin?: string | null;
  reporterLogin?: string | null;
  projectTitle?: string | null;
  status?: TaskStatusModel;
}

export interface TaskModelWithNumber {
  number?: TaskNumber;
  taskModel?: TaskModel;
}

export interface TaskNumber {
  prefix?: string | null;
  /** @format int32 */
  number?: number;
}

export enum TaskStatusModel {
  ToDo = "ToDo",
  InProgress = "InProgress",
  InReview = "InReview",
  Testing = "Testing",
  DevelopmentDone = "DevelopmentDone",
  ReadyToDeploy = "ReadyToDeploy",
  Closed = "Closed",
}

export interface UpdateTaskReq {
  number?: TaskNumber;
  task?: TaskModel;
}

export interface UserDto {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  password?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:5000/" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Task Explorer API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name RegisterCreate
     * @request POST:/Auth/register
     * @secure
     */
    registerCreate: (data: RegisterReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthenticateCreate
     * @request POST:/Auth/Authenticate
     * @secure
     */
    authenticateCreate: (data: AuthenticateReq, params: RequestParams = {}) =>
      this.request<AuthenticateResp, any>({
        path: `/Auth/Authenticate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthList
     * @request GET:/Auth
     * @secure
     */
    authList: (params: RequestParams = {}) =>
      this.request<UserDto[], any>({
        path: `/Auth`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
      /**
       * No description
       *
       * @tags Auth
       * @name AuthList
       * @request GET:/Auth/info
       * @secure
       */
      authInfoList: (params: RequestParams = {}) =>
          this.request<UserDto, any>({
              path: `/Auth/info`,
              method: "GET",
              secure: true,
              format: "json",
              ...params,
          }),
  };
  project = {
    /**
     * No description
     *
     * @tags Project
     * @name CreateCreate
     * @request POST:/Project/create
     * @secure
     */
    createCreate: (data: CreateProjectReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Project/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name ListList
     * @request GET:/Project/list
     * @secure
     */
    listList: (params: RequestParams = {}) =>
      this.request<ListProjectsResp, any>({
        path: `/Project/list`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  task = {
    /**
     * No description
     *
     * @tags Task
     * @name CreateCreate
     * @request POST:/Task/create
     * @secure
     */
    createCreate: (data: CreateTaskReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Task/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name ListByAuthorCreate
     * @request POST:/Task/list/by-author
     * @secure
     */
    listByAuthorCreate: (data: GetTasksByAuthorReq, params: RequestParams = {}) =>
      this.request<GetTasksByAuthorResp, any>({
        path: `/Task/list/by-author`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name DeleteDelete
     * @request DELETE:/Task/delete
     * @secure
     */
    deleteDelete: (data: DeleteTaskReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Task/delete`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name UpdateUpdate
     * @request PUT:/Task/update
     * @secure
     */
    updateUpdate: (data: UpdateTaskReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Task/update`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name AvailableStatusesCreate
     * @request POST:/Task/available-statuses
     * @secure
     */
    availableStatusesCreate: (data: ListAvailableStatusesReq, params: RequestParams = {}) =>
      this.request<ListAvailableStatusesResp, any>({
        path: `/Task/available-statuses`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name StatusesList
     * @request GET:/Task/statuses
     * @secure
     */
    statusesList: (params: RequestParams = {}) =>
      this.request<ListStatusesResp, any>({
        path: `/Task/statuses`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name ByProjectCreate
     * @request POST:/Task/by-project
     * @secure
     */
    byProjectCreate: (data: GetTasksByProjectReq, params: RequestParams = {}) =>
      this.request<GetTasksByProjectResp, any>({
        path: `/Task/by-project`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name ByNumberCreate
     * @request POST:/Task/by-number
     * @secure
     */
    byNumberCreate: (data: GetTaskByNumberReq, params: RequestParams = {}) =>
      this.request<GetTaskByNumberResp, any>({
        path: `/Task/by-number`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
