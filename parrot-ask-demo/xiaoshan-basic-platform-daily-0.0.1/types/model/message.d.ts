export interface Message {
    content?: string;           // 消息内容
    createdTime: string;       // 创建时间
    pushType?: number;          // 推送类型
    sourceName?: string;        // 发起人/应用
    url?: string;               // url
    sourceType?: number;        // 来源类型 1系统 2个人 3应用
    title?: string;             // 消息标题
    type: number;              // 消息类型
    id: number;                 // id
    readState: boolean;         // 是否已读
    extra: string;              // "{"relatedId": 2, "relatedType": 3}"
}