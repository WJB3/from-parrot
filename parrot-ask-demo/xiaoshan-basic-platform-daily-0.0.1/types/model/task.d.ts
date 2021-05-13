export interface Task {
    applicantId: number;        // 申请人id
    applicantName: string;      // 申请人姓名
    applicantType: number;      // 申请人类型
    toDoContent: string;        // 待办内容
    createdTime: string;        // 发起时间
    relatedId: number;          // 待办id
    relatedType: number;        // 待办类型
    serialNumber?: string;      // 序列编号
    state: number;              // 审批状态 -1 待审批 0审批中 1审批通过 2驳回
    extra?: string;             // 附加字段 json String
    id: number;
}