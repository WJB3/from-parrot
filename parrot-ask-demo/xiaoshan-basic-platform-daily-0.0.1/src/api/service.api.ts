import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
import { config } from 'process';

export default {
    // 查询全部服务人员列表
    getPage: (data: GT.DTO.SearchServiceParmas, config?: AxiosRequestConfig) => 
        request.get<any, GT.Response.Page<GT.Model.Service>>("/foundation/services",  {
            ...config,
            params: {
                ...data,
                ...config?.params
            }
        }),

    // 新增服务人员
    create: (data: GT.DTO.CreateServiceDto, config?: AxiosRequestConfig) =>
        request.post("/foundation/services", data, config),

    // 编辑
    update: (data: GT.DTO.CreateServiceDto, config?: AxiosRequestConfig) =>
        request.put("/foundation/services", data, config),

    // 批量删除/删除
    delete: (config?: AxiosRequestConfig) => request.delete("/foundation/services", config),

    // 头像上传
    updateFace: (id: number, params: {fileId: number}, config?: AxiosRequestConfig) =>
        request.put(`/foundation/services/${id}/avatar`, {}, {...config, params}),

    // 服务商头像删除
    deleteFace: (id: number, config?: AxiosRequestConfig) => 
        request.delete(`/foundation/services/${id}/avatar`, config),

    // 查询服务商人脸库
    getFacePage: (params: GT.DTO.SearchTeacherFaceParams, config?: AxiosRequestConfig) =>
        request.get<any, GT.Response.Page<GT.Model.TeacherFace>>("/foundation/services/avatars", {...config, params}),

    // 服务商头像批量导入
    importFace: (params: {fileId: number}, config?: AxiosRequestConfig) =>
        request.put("/foundation/services/avatars", {},  {
            ...config,
            params,
          }),

    // 服务商头像批量删除
    deleteFaces: (data: number[], config?: AxiosRequestConfig) =>
        request.delete("/foundation/services/avatars", {...config, data}),

    // 服务商人脸数据导出
    exportFace: (params: GT.DTO.SearchTeacherFaceParams, config?: AxiosRequestConfig) => 
        request.get<any, GT.Model.ExportRes>("/foundation/services/avatars/excel", {...config, params}),

    // 查询导入记录
    getImportRecordPage: (params: {current: number, size: number}, config?: AxiosRequestConfig) =>
        request.get<any, GT.Response.Page<GT.Model.ImportFaceRecord>>("/foundation/services/avatars/records", {...config, params}),

    // 查询服务商人脸任务状态
    getFaceStatus: (config?: AxiosRequestConfig) =>
        request.get<any, 0 | 1>("/foundation/services/avatars/status", config),

    // 服务人员数据导出
    exportExcel: (data: GT.DTO.SearchServiceParmas, config?: AxiosRequestConfig) =>
        request.get<any, GT.Model.ExportRes>("/foundation/services/excels", {
            ...config,
            params: {
              ...data,
              ...config?.params,
            },
          }),

    // 批量导入
    importExcel: (data: FormData, config?: AxiosRequestConfig) =>
        request.post<any, GT.Model.ImportExcelRes<GT.Model.Service>>("/foundation/services/excels", data,
        {...config, headers: {
            ...config?.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),

    // 获取导入模板
    getTemplate: (conifg?: AxiosRequestConfig) =>
        request.get<any, GT.Model.ExportRes>("/foundation/services/excels/template", conifg),

    /** 服务部门 */
    // 获取服务部门信息
    getDepartment: (config?: AxiosRequestConfig) => 
        request.get<any, GT.Response.Page<GT.Model.Organization>>("/foundation/service/department", config),

    // 新增部门
    addDepartment: (params: GT.DTO.CreateDepartmentDto, config?: AxiosRequestConfig) => 
        request.post("/foundation/service/department", params, config),

    // 修改部门
    updateDepartment: (data: GT.DTO.CreateDepartmentDto, config?: AxiosRequestConfig) =>
        request.put("/foundation/service/department", data, config),
    
    // 删除部门
    deleteDepartment: (config?: AxiosRequestConfig) => 
        request.delete("/foundation/service/department", config),
    
    // 获取最大排序
    getMaxSort: (params: {departmentId?: number}, config?: AxiosRequestConfig) => 
        request.get<any, number>("/foundation/service/department/maxSort", {...config, params}),

    // 根据部门组或部门id获取教师列表
    getDepartmentGroup: (departmentId: number, config?: AxiosRequestConfig) =>
        request.get<any, GT.Response.Page<GT.Model.Service>>(`/foundation/service/department/group/${departmentId}`, config),

    // 选取加入
    departmentSelectService: (data: { departmentId: number; teacherIds: number[] }, config?: AxiosRequestConfig,) =>
     request.post('/foundation/service/department/selected', data, config),

    // 移除
    deleteDepartmentService: (config?: AxiosRequestConfig) =>
        request.delete('/foundation/service/department/service', config),

    // 获取部门人员树
    getAllDepartment: (config?: AxiosRequestConfig) => {
        console.log("getAllDepartment",config)
     return request.get<any, GT.Model.Organization[]>("/foundation/service/department/tree", config)
    },

    /** 所属公司 */
    // 获取所属公司, current:-1, size: -1 即为所有
    getCompany: (data: {current: number, size: number}, config?: AxiosRequestConfig) => 
        request.get<any, GT.Response.Page<GT.Model.Company>>("/foundation/companys", {...config, params: {...data, ...config?.params}}),

    // 新增服务商
    addCompany: (data: GT.DTO.CreateCompanyDto, config?: AxiosRequestConfig) =>
        request.post("/foundation/companys", data, config),
    
    // 修改服务商
    updateCompany: (data: GT.DTO.CreateCompanyDto, config?: AxiosRequestConfig) =>
        request.put("/foundation/companys", data, config),

    // 删除公司, type: 1:仅删除当前公司 2:删除公司和人
    deleteCompany: (id: number, params: {type: 1 | 2}, config?: AxiosRequestConfig) =>
        request.delete(`/foundation/companys/${id}`, {...config, params}),
 
    // 获取公司最大排序
    getCompanyMaxSort: (config?: AxiosRequestConfig) => 
        request.get<any, number>("/foundation/companys/maxSort", config),
}