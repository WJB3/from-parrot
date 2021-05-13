// 查询服务人员列表dto
export interface SearchServiceParmas {
    budgetedPost?: number;      // 编制
    companyId?: number;         // 公司id
    crossStatus?: number;       // 通行权限
    departmentIdList?: [number];// 部门id列表
    departmentIds?: string | number;     // 部门id列表
    flag?: boolean;             // true:查询没有部门的教师
    gender?: number;            // 性别
    icCardNo?: string;          // id卡号
    keyWord?: string;           // 关键字
    name?: string;              // 姓名
    passResult?: number;        // 下发结果
    phone?: string;             // 手机号码
    teacherIds?: string;        // 教师id,拼接
    current?: number;           // 页码
    size?: number;              // 每页大小
    userState?: boolean;        // 是否创建账号
    singleDepartment?: boolean; // 是否单部门导出
}

// 创建/更新服务人员dto
export interface CreateServiceDto {
    budgetedPost?: number;      // 编制
    companyId?: number;         // 公司id
    departmentIds?: string;     // 部门id列表
    employeeNo?: string;        // 职工号
    gender?: number;            // 性别
    id?: number;                // id
    idNo?: string;              // id卡号
    idType?: number;            // 证件类型
    name?: string;              // 姓名
    phone?: string;             // 手机号码
    type?: number;              // 教师类型
}

// // 查询服务商人脸dto
// export interface SearchServiceFaceParams {
//     crossStatus?: number;       // 通行权限
//     current?: number;           // 页码
//     size?: number;              // 每页大小
//     departmentIds?: string;     // 部门id列表
//     keyWord?: string;           // 关键字
//     passResult?: number;        // 下发结果
// }

// // 查询服务部门列表
// export interface SearchDepartmentDto {
//     defaultState?: 1 | 2;       // 0:自定义 1:系统默认
//     departmentType?: number;    // 部门类型
//     type?: number;              // 部门类型
//     parentId?: number;          // 父节点id
//     current?: number;           // 页码
//     size?: number;              // 每页大小
// }

// 创建/更新服务部门
export interface CreateDepartmentDto {
    id?: number;                // 部门id
    name?: string;              // 部门名称
    parentId?: number;          // 上级部门组
    sort?: number;              // 部门序号
    type?: number;              // 部门类型
}

// 创建/更新所属公司
export interface CreateCompanyDto {
    address?: string;           // 公司地址
    contact?: string;           // 联系人
    contactPhone?: string;      // 联系人手机号
    id?: number;                // 公司id
    name?: string;              // 公司名称
    sort?: number;              // 公司序号
}

// 删除公司
export interface DeleteCompanyDto {
    id: number;                // 公司id
    type?: 1 | 2;              // 1:仅删除当前公司 2:删除公司和人
}

// 其他用户-创建账号
export interface CreateOtherDto {
    id: number;                 // 人员id
    phone?: string;              // 手机号
    roleIds?: number[];          // 角色id列表
}