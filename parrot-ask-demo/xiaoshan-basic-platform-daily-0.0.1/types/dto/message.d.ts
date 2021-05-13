export interface SearchMessageDto {
    type?: number;              // 消息类型 1系统消息 2通知公告 3 业务消息
    title?: string;             // 标题
    current?: number;           // 页码
    size?: number;              // 每页大小
    readState?: boolean;        // 是否已读
}