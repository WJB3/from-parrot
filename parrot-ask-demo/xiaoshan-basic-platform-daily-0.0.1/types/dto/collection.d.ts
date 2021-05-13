export interface CreateCollectionParams {
  id?: number;
  name: string;
  type: number;
  startTime: string;
  endTime: string;
  year: number;
  enrollmentYear: number;
}
export interface CollectionTaskDetail {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  year: number;
  enrollmentYear: number;
  taskStatus: number;
}

export interface ClassListParam {
  current: number;
  size: number;
  enrollmentYear: number;
  sectionId: number;
}

export interface ClassBean {
  id: number;
  name: string;
}

export interface CollectionRecordParams {
  classId?: number;
  current: number;
  keyWord?: string;
  size: number;
  status?: number;
  taskId: number;
}

export interface CollectionRecord {
  className: string;
  graduationPhotoStatus: number;
  graduationPhotoUrl: string;
  graduationRejectReason: string;
  icCardNo: string;
  id: number;
  idNo: string;
  name: string;
  number: number;
  publishTime: string;
  status: number;
  studyPhotoStatus: number;
  studyPhotoUrl: string;
  studyRejectReason: string;
}

// 照片采集 任务model
export interface PhotoTaskModel {
  name: string;
  year: number;
  // 填报具体时间
  startTime: string;
  endTime: string;
  enrollmentYear: number;
  receive: string;
  taskStatus: number;
  status: number;
  id: number;
}

export interface SearchPreviewPhotoParams {
  current?: number;
  size?: number;
  taskId?: number;
  type?: number;
}

export interface PreviewPhotoModel {
  id: number;
  idCardNo: string;
  className: string;
  photoUrl: string;
  name: string;
  isSelected: false;
}

export interface ExportPhotoParams {
  classIds: number[];
  className: string;
  taskId: number;
  type: number;
}

export interface PeopleNumber {
  audit: boolean;
  checkPendingNum: number;
  notApprovedNum: number;
  num: number;
  passNum: number;
  uncommittedNum: number;
}
