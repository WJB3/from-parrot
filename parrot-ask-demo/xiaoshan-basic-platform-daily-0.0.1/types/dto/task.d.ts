export interface SearchTaskDto {
    applicantName?: string;     // 申请人姓名
    toDoContent?: string;       // 待办内容
    type?: number;              // 待办类型
    relatedIds?: string;        // 相关待办id列表
    resultState?: number;       // 当前节点状态 0 待处理 1已处理 3抄送我 4 我发起
    state?: number;             // 流程状态 -1 待审批 0审批中 1审批通过 2驳回
    current?: number;           // 页码
    size?: number;              // 每页大小
}