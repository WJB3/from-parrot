// modal 弹窗Ref和Props声明
import { Dispatch, SetStateAction } from 'react';
import { Store } from 'antd/lib/form/interface';
import { FormInstance } from 'antd/lib/form';

export interface Ref {
  setVisible: Dispatch<SetStateAction<boolean>>; // 弹窗显示控制方法
  setTitle: Dispatch<SetStateAction<string>>; // title控制方法
  form?: FormInstance; // 设置表单数据方法
  [key: string]: any;
}
interface Props {
  onRef: (ref: Ref) => void; // onRef回调，参数是Ref
  onOk?: (data?: any) => void;
}
