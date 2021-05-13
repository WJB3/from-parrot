import request from "./request";
import { AxiosRequestConfig } from "axios";
import GT from "types";
import sha256 from "crypto-js/sha256";
import JSEncrypt from "jsencrypt";
import Fingerprint2 from "@fingerprintjs/fingerprintjs";
let deviceSign: string;

const getDeviceSign = () => {
  if (deviceSign) {
    return Promise.resolve(deviceSign);
  } else {
    return new Promise((resolve) => {
      Fingerprint2.getV18((result) => {
        deviceSign = result;
        resolve(deviceSign);
      });
    });
  }
};
function setEncrypt(msg: string) {
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgNBj3w69peB2/TtyZmPIaA0cJ+8kARL2dYH4IUQbew356Uh5aDltdr+Ltq8B/lxvOhtoPGr5Nx/zSzOHFQwPWyoRWuNvg2ieJNKexZtguLMiugqQOvbEcW/e8c7Lbq1I8cReeo+Va8Hz8i0q0gOmmm3wIpPlgfSnJ0ucGaal3IQIDAQAB"
  );
  return jsencrypt.encrypt(msg);
}
export default {
  getDeviceSign,
  uoload: `${request.defaults.baseURL}/oss/files`,
  download: (url: string, config?: AxiosRequestConfig) =>
    request.get<Blob, Blob>(url, config),
  login: (data: GT.DTO.LoginDTO, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.LoginRes>("/sso/oauth/token", data, config),
  logout: (config?: AxiosRequestConfig) => request.get("/logout", config),
  getVerifyImage: async (data: any, config?: AxiosRequestConfig) => {
    return request.post<any, Blob>("/foundation/messages/verify_image", data, {
      ...config,
      params: {
        ...config?.params,
        deviceSign: await getDeviceSign(),
      },
    });
  },
  checkVerifyImage: async (
    params: { code: string },
    config?: AxiosRequestConfig
  ) =>
    request.get<any, boolean>("/foundation/messages/verify_image/check", {
      ...config,
      params: {
        ...params,
        deviceSign: await getDeviceSign(),
      },
    }),
  getOperateLogPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.OperateLog>("/setting/logs", config),
  getSms: async (
    data: {
      phone: string;
      time: number;
      verifyCode: string;
      /**
       * 1:忘记密码
       * 2:更新手机号码
       */
      type: 1 | 2;
    },
    config?: AxiosRequestConfig
  ) =>
    request.post(
      "/foundation/messages/sms",
      {},
      {
        ...config,
        params: {
          content: setEncrypt(
            `${data.phone},${data.time},${data.verifyCode},${
              data.type
            },${await getDeviceSign()}`
          ),
          sign: sha256(
            `${data.phone},${data.time},${data.verifyCode},${
              data.type
            },${await getDeviceSign()}`
          ).toString(),
        },
      }
    ),
  checkSms: (
    params: { code: string; phone: string },
    config?: AxiosRequestConfig
  ) =>
    request.get("/foundation/messages/verify_code/check", {
      ...config,
      params,
    }),
  getBaseInfo: (config?: AxiosRequestConfig) =>
    request.get<any, { id: number; schoolName: string; logoUrl: string }>(
      "/setting/base_info",
      config
    ),
  updateBaseInfo: (fileId: number) =>
    request.put(`/setting/base_info/${fileId}/modify`),

  getWorkflow: (id: string | number) =>
    request.get<any, any>(`/workflow/flows/template/${id}`),
  getWorkflows: (id: string | number) =>
    request.get<any, any[]>(`/workflow/flows/templates/${id}`),
  // 获取流程模板id
  getWorkflowModel: (type: any) =>
    request.get<any, any[]>(`/workflow/v2/flows/${type}/model`),  
  getPublicQrCode: () => request.get<any, string>(`/sso/qrcode`),
  getQrCodeState: (ticket?: string, config?: AxiosRequestConfig) =>
    request.get<number, any>("/sso/qrcode/state", {
      ...config,
      params: { ticket: ticket },
    }),
  bindWechat: (ticket?: string) =>
    request.post<any, string>(
      `/foundation/users/me/office_account?ticket=${ticket}`
    ),
  unbindWeChat: () =>
    request.delete<any, any>("/foundation/users/me/office_account"),
};
