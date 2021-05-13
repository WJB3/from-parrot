// 服务人员model
export interface Service {
    budgetedPost?: number;      // 编制
    companyId?: number;         // 公司id
    companyName?: string;       // 公司名称
    departmentIds?: [number];   // 部门id列表
    departmentName?: string;    // 部门名称
    description?: string;       // 描述
    employeeNo?: string;        // 职工号
    gender?: number;            // 性别
    icCardNo?: string;          // id卡号
    id: number;                 // 唯一标识
    idNo?: string;              // id卡号
    idType?: number;            // 证件类型
    name?: string;              // 姓名
    passResult?: number;        // 下发结果
    phone?: string;             // 手机号码
    position?: string;          // 职位

    fileId?: string;            // 人脸照片文件id
    url?: string;               // 人脸图片地址
}

// // 服务部门model
// export interface Department {
//     count?: number;             // 关联人员数量
//     defaultState?: number;      // 系统默认状态
//     departments?: Department[]; 
//     id: number;                 // id
//     name?: string;              // 部门名称
//     parentId?: number;          // 父id
//     roleId?: number;            // 角色id
//     sort?: number;              // 序号
//     teachers?: Service[];       // 服务人员列表
//     type?: 1|2;                 // 部门类型 1部门组 2部门
// }

// 所属公司model
export interface Company {
    address?: string;           // 公司地址
    contact?: string;           // 联系人
    contactPhone?: string;      // 联系人手机号
    id: number;                 // 公司id
    name?: string;              // 公司名称
    sort?: number;              // 公司序号
}