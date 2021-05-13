export interface IoT_Device {
  deviceId: number;
  deviceName: string;
  deviceCode: string;
  sn: string;
  productName: string;
  platformName: string;
  region?: string;
  position?: string;
  lifeState: 1 | 2 | 3 | 4;
  createTime: string;
}
