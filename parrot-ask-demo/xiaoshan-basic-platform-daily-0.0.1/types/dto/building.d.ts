export interface CreateBuildingDto {
  area?: string;
  campusId: number;
  deliveryTime?: Date;
  id?: number;
  name: string;
  nature: number;
  sort: number;
  structure?: number;
}

export interface CreateBuildingRoomDto {
  floorId: number;
  area: number;
  height?: number;
  name: string;
  towards?: number;
  type: number;
}
