// 接口请求参数类型声明文件

export * from "./dto/permission";
export * from "./dto/role";
export * from "./dto/dictionary";
export * from "./dto/organization";
export * from "./dto/teacher";
export * from "./dto/section";
export * from "./dto/student";
export * from "./dto/user";
export * from "./dto/building";
export * from "./dto/group";
export * from "./dto/calendar";
export * from "./dto/schedule";
export * from "./dto/award";
export * from "./dto/service";
export * from "./dto/message";
export * from "./dto/task";
export * from "./dto/leave";
export * from "./dto/platform";
export * from "./dto/assessment";
export * from "./dto/collection";
export interface LoginDTO {
  loginName?: string;
  password?: string;
  grant_type?: string;
  refresh_token?: string | null;
  wx_ticket?: string | null;
  wx_web_code?: string|null;
  username?: string;
  thirdToken?: string;
}
