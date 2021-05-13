export interface Building {
  id: number;
  area?: number;
  name: string;
  campusId: number;
  nature: number;
  sort: number;
  structure?: number;
  createdMan: string;
  createdTime: Date;
  deliveryTime?: Date;
}

export interface BuildingTreeNode {
  parentId?: number;
  id: number;
  name: string;
  /**
   * 0:校区
   * 1:楼宇
   */
  type: 0 | 1;
  list?: BuildingTreeNode[];
}
interface BuildingStatisticRow {
  percentage: number;
  type: string;
}
export interface BuildingStatistic {
  buildingArea: BuildingStatisticRow[];
  buildingNum: BuildingStatisticRow[];
  structure: BuildingStatisticRow[];
}
export interface BuildingSpaceStatistic {
  spaceArea: BuildingStatisticRow[];
  spaceNum: BuildingStatisticRow[];
}

export interface BuildingFloor {
  id: number;
  area: number;
  level: number;
  list?: Room[];
  num: number;
}
export interface BuildingRoom {
  id: number;
  area: number;
  name: string;
  type: number;
}

export interface BuildingTree {
  buildingId: number;
  buildingName: string;
  floorTreeDTOS: BuildingFloorTree[];
}
export interface BuildingFloorTree {
  floorId: number;
  floorName: string;
  roomTreeDTOS: BuildingRoomTree[];
}

export interface BuildingRoomTree {
  roomId: number;
  roomName: string;
}
