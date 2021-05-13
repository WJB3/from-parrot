import request from "./request";
import { AxiosProxyConfig, AxiosRequestConfig } from "axios";
import GT from "types";
export default {
  getMe: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.User>("/foundation/users/me", config),
  getTeacherMe: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.TeacherFace>(
      "/foundation/users/me/teacher",
      config
    ),
  getPermissions: (
    params?: GT.Model.MenuSearchParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Model.Menu[]>("/foundation/permissions/me", {
      ...config,
      params: {
        ...params,
        ...config?.params,
      },
    }),
  getTeacherStatistic: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.UserTeacherStatistic>(
      "/foundation/users/teachers/statistics",
      config
    ),
  getTeacherPage: (
    params: GT.DTO.SearchUserTeacherParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.Model.UserTeacher>>(
      "/foundation/users/teachers",
      {
        ...config,
        params,
      }
    ),
  updateTeacherRoles: (
    id: number,
    roleIds: number[],
    config?: AxiosRequestConfig
  ) => request.put(`/foundation/users/teachers/${id}/roles`, roleIds, config),
  /**
   * 获取教师角色ids
   */
  getTeacherRoles: (id: number, config?: AxiosRequestConfig) =>
    request.get<any, number[]>(
      `/foundation/users/teachers/roles/${id}`,
      config
    ),
  /**
   * 获取教师可选角色
   */
  getTeacherRolesOptions: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Role[]>(
      "/foundation/users/teachers/roles",
      config
    ),
  resetTeacherPassword: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/teachers/${id}/password/reset`, config),
  forbiddenTeacher: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/teachers/${id}/forbidden`, config),
  resuymeTeacher: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/teachers/${id}/resume`, config),

  getParentPage: (
    params: GT.DTO.SearchUserParentParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.Model.UserParent>>(
      "/foundation/users/parents",
      {
        ...config,
        params,
      }
    ),
  resetParentPassword: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/parents/${id}/password/reset`, config),
  forbiddenParent: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/parents/${id}/forbidden`, config),
  resuymeParent: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/parents/${id}/resume`, config),
  getParentStatistic: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.UserParentStatistic>(
      "/foundation/users/parents/statistics",
      config
    ),

  getPasswordState: (config?: AxiosRequestConfig) =>
    request.get<any, boolean>("/foundation/users/me/password/state", config),

  updatePassword: (
    params: { oldPassword?: string; password: string; phone?: string },
    config?: AxiosRequestConfig
  ) =>
    request.put(
      "/foundation/users/me/password",
      {},
      {
        ...config,
        params,
      }
    ),
  forgetPassword: (
    params: {
      code: string;
      password: string;
      phone: string;
    },
    config?: AxiosRequestConfig
  ) =>
    request.put(
      "/foundation/users/me/password/forget",
      {},
      {
        ...config,
        params,
      }
    ),
  updatePhone: (
    params: { oldVerifyCode: string; newVerifyCode: string; newPhone: string },
    config?: AxiosRequestConfig
  ) =>
    request.put(
      "/foundation/users/me/username",
      {},
      {
        ...config,
        params,
      }
    ),
  updateAvatar: (params: { fileId: number }, config?: AxiosRequestConfig) =>
    request.put(
      "/foundation/users/me/avatar",
      {},
      {
        ...config,
        params,
      }
    ),

  /** 其他用户 */

  // 获取其它用户
  getOthersPage: (
    params: GT.DTO.SearchUserTeacherParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.Model.UserTeacher>>(
      "/foundation/users/others",
      {
        ...config,
        params,
      }
    ),

  // 创建其他用户
  createOthers: (data: GT.DTO.CreateOtherDto, config?: AxiosRequestConfig) =>
    request.post("/foundation/users/others", data, config),

  // 其他用户禁用账号
  forbiddenOther: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/others/${id}/forbidden`, config),

  // 其他用户重置密码
  resetOtherPassword: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/others/${id}/password/reset`, config),

  // 其他用户恢复账号
  resumeOther: (id: number, config?: AxiosRequestConfig) =>
    request.put(`/foundation/users/others/${id}/resume`, config),

  // 分配其他用户角色
  updateOtherRoles: (
    id: number,
    roleIds: number[],
    config?: AxiosRequestConfig
  ) => request.put(`/foundation/users/others/${id}/roles`, roleIds, config),

  // 获取其他用户统计数据
  getOtherStatistic: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.UserTeacherStatistic>(
      "/foundation/users/others/statistics",
      config
    ),

  // 获取其他用户已有角色
  getOtherRoles: (id: number, config?: AxiosRequestConfig) =>
    request.get<any, number[]>(`/foundation/users/others/roles/${id}`, config),

  // 其他用户可选角色
  getOtherRolesOptions: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Role[]>("/foundation/users/others/roles", config),
  //更新我的员工号和ic卡号
  updateNumbers: (
    params: { employeeNo?: "string"; icCardNo?: "string" },
    config?: AxiosRequestConfig
  ) => request.put("/foundation/users/me/numbers", params, config),
};
