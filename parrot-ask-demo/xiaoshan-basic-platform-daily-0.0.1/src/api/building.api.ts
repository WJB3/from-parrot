import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  // building
  create: (data: GT.DTO.CreateBuildingDto, config?: AxiosRequestConfig) =>
    request.post('/setting/building', data, config),
  update: (data: GT.DTO.CreateBuildingDto, config?: AxiosRequestConfig) =>
    request.put('/setting/building', data, config),
  get: (buildingId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Building>(`/setting/building/${buildingId}`, config),

  // space
  createSpace: (data: GT.DTO.CreateBuildingDto, config?: AxiosRequestConfig) =>
    request.post('/setting/space', data, config),
  updateSpace: (data: GT.DTO.CreateBuildingDto, config?: AxiosRequestConfig) =>
    request.put('/setting/space', data, config),
  // campus
  createCampus: (data: { name: string }, config?: AxiosRequestConfig) =>
    request.post('/setting/building/campus', data, config),
  getBuildingTree: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingTreeNode[]>('/setting/building/tree', config),
  getSpaceTree: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingTreeNode[]>('/setting/space/tree', config),
  getBuildingPage: (campusId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Building>>(
      `/setting/building/campus/${campusId}`,
      config,
    ),
  getSpacePage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Building>>(`/setting/space`, config),
  getBuildingStatistic: (campusId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingStatistic>(`/setting/building/survey/${campusId}`, config),
  getSpaceStatistic: (campusId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingSpaceStatistic>(`/setting/space/survey/${campusId}`, config),
  // floor
  getFloors: (buildingId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingFloor[]>(`/setting/floors/${buildingId}`, config),
  updateFloor: (data: { id: number; level: number }, config?: AxiosRequestConfig) =>
    request.put('/setting/floors', data, config),
  deleteFloor: (
    data: {
      floorIds?: number[];
      roomIds?: number[];
    },
    config?: AxiosRequestConfig,
  ) =>
    request.delete('/setting/floors', {
      ...config,
      data,
    }),
  createFloors: (
    data: {
      buildingId: number;
      min: number;
      max: number;
    },
    config?: AxiosRequestConfig,
  ) => request.post('/setting/floors', data, config),

  // room
  createRoom: (data: GT.DTO.CreateBuildingRoomDto, config?: AxiosRequestConfig) =>
    request.post('/setting/rooms', data, config),
  updateRoom: (data: GT.DTO.CreateBuildingRoomDto, config?: AxiosRequestConfig) =>
    request.put('/setting/rooms', data, config),
  exportRoom: (buildingId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>(`/setting/floors/${buildingId}/excel`, config),
  getRoomExcelTpl: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/setting/rooms/template', config),
  importRoomExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.BuildingRoom>>(
      '/setting/rooms/import',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
  getRoomTree: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.BuildingTree[]>('/setting/rooms/class', config),
  getMaxSort: (params: { campusId: number; type: 1 | 2 }, config?: AxiosRequestConfig) =>
    request.get<any, number>('/setting/building/sort/max', {
      ...config,
      params,
    }),
};
