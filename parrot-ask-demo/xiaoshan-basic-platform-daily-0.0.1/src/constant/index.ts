import app from './app';
import pattern from './pattern';
import role from './role';

const form = {
  layout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
};

export const pagination = {
  showSizeChanger: true,
  size: 'default',
  showTotal: (total: any) => `共 ${total} 条`,
};

const dictionary = {
  useStatus: new Map([
    [0, '启用'],
    [1, '停用'],
  ]),
};
const organization = {
  type: new Map([
    [1, '部门组'],
    [2, '部门'],
  ]),
};
const classes = {
  selectOptions: new Array(50).fill(1).map((item, index) => ({
    label: index + 1,
    value: index + 1,
  })),
};

const semester = {
  orderNo: new Map([
    [1, '第一学期'],
    [2, '第二学期'],
  ]),
  state: new Map([
    [0, '历史学期'],
    [1, '当前学期'],
  ]),
};
const user = {
  state: new Map([
    [2, '禁用'],
    [0, '未激活'],
    [1, '正常'],
  ]),
};
const number = {
  month: new Map([
    [1, '一'],
    [2, '二'],
    [3, '三'],
    [4, '四'],
    [5, '五'],
    [6, '六'],
    [7, '七'],
    [8, '八'],
    [9, '九'],
    [10, '十'],
    [11, '十一'],
    [12, '十二'],
  ]),
};

const award = {
  state: new Map([
    [0, '待开始'],
    [1, '进行中'],
    [2, '已结束'],
  ]),
  
  status: new Map([
    [0, '未提交'],
    [1, '待审批'],
    [2, '已通过'],
    [3, '已驳回'],
  ]),
};

const deleteType = {
  type: new Map([
    [1, '仅删除当前公司'],
    [2, '仅删除当前公司及所有服务人员'],
  ]),
};

const messageType = {
  type: new Map([
    [1, '系统消息'],
    [2, '通知公告'],
    [3, '业务消息'],
  ]),
};

// 待办类型
const taskType = {
  type: new Map([
    [1, '信息采集'],
    [2, '学生请假'],
  ]),
};

// 待办类型子类
const relatedType = {
  type: new Map([
    [1, '信息采集'],
    [2, '信息采集'],
    [3, '学生请假'],
  ]),
};

// 待办事项 审批状态
const taskState = {
    type: new Map([
      [-1, '待审批'],
      [0, '审批中'],
      [1, '已审批'],
      [2, '驳回'],
    ]),
};

// 待办事项当前节点状态 0 待处理 1已处理 3抄送我 4 我发起
const resultState = {
  type: new Map([
    [0, '待处理'],
    [1, '已处理'],
    [2, '抄送我'],
    [3, '我发起'],
  ]),
};

// 推送类型 1 微信消息 2短信消息 3站内消息
const pushType = {
  type: new Map([
    [1, '微信小程序消息'],
    [2, '短信消息'],
    [3, '站内消息'],
    [4, '微信公众号消息'],
  ]),
};

// 教师考评
// 考评年份
const taskYear = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
// 任务状态
const progressState = {
  type: new Map([
    [0, "待开始"],
    [1, "进行中"],
    [2, "已结束"],
  ]),
};

const constant = {
  pagination,
  form,
  app,
  pattern,
  role,
  dictionary,
  organization,
  classes,
  semester,
  user,
  number,
  award,
  deleteType,
  messageType,
  taskType,
  relatedType,
  taskState,
  resultState,
  pushType,
  taskYear,
  progressState,
};

export default constant;
