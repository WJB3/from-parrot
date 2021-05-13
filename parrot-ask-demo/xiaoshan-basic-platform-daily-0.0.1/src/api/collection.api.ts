import request from "./request";
import { AxiosRequestConfig } from "axios";
import GT from "types";
export default {
  // 获取任务列表- 照片采集
  getPhotoTaskPage: (
    data: GT.DTO.SearchAwardTaskParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.Model.PhotoTaskModel>>(
      "/gathering/photo/tasks",
      {
        ...config,
        params: {
          ...data,
          ...config?.params,
        },
      }
    ),
  // 删除照片采集
  deletePhotoTask: (id: number) =>
    request.delete(`/gathering/photo/tasks/${id}`),
  //获取当前学校
  getCurrentSemester: (config?: AxiosRequestConfig) =>
    request.get<any, number>("/setting/semesters/current_year", config),
  //新建照片采集计划
  createCollectionTask: (
    data: GT.DTO.CreateCollectionParams,
    config?: AxiosRequestConfig
  ) => request.post("/gathering/photo/tasks", data, config),
  //更新照片采集计划
  updateCollectionTask: (
    data: GT.DTO.CreateCollectionParams,
    config?: AxiosRequestConfig
  ) => request.put("/gathering/photo/tasks", data, config),
  //获取采集计划详情
  getTaskDetail: (taskId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.DTO.CollectionTaskDetail>(
      `/gathering/photo/tasks/${taskId}`,
      config
    ),
  //获取班级列表
  getClasses: (data: GT.DTO.ClassListParam, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.DTO.ClassBean>>(
      `/foundation/classes`,
      {
        ...config,
        params: { ...data, ...config?.params },
      }
    ),
  //获取汇总记录
  getCollectionRecord: (
    data: GT.DTO.CollectionRecordParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.DTO.CollectionRecord>>(
      `/gathering/photo/record`,
      {
        ...config,
        params: { ...data, ...config?.params },
      }
    ),

  // 获取预览列表
  getPreviewPhotoPage: (
    data: GT.DTO.SearchPreviewPhotoParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Response.Page<GT.Model.PreviewPhotoModel>>(
      "/gathering/photo/record/preview",
      {
        ...config,
        params: {
          ...data,
          ...config?.params,
        },
      }
    ),
  // 批量审核照片
  approvalPhotos: (parmas: any, config?: AxiosRequestConfig) =>
    request.put<any, any>(
      "/gathering/photo/record/approval/batch",
      parmas,
      config
    ),

  // 审核单人
  approvalSinglePhoto: (parmas: any, config?: AxiosRequestConfig) => 
  request.put<any, any>("/gathering/photo/record/approval", parmas, config),

  //导出汇总表
  exportSummary: (
    data: GT.DTO.CollectionRecordParams,
    config?: AxiosRequestConfig
  ) =>
    request.get<any, GT.Model.ExportRes>(`/gathering/photo/record/export`, {
      ...config,
      params: {
        ...data,
        ...config?.params,
      },
    }),
  //批量导出照片
  exportPhoto: (data: GT.DTO.ExportPhotoParams, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ExportRes>(
      `/gathering/photo/record/downLoad`,
      data,
      config
    ),
  getPeopleNumber: (taskId: string, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.PeopleNumber>(
      `/gathering/photo/record/num/${taskId}`,
      config
    ),
};
