/*
 * @Author: xuhansong
 * @Date: 2020-08-30 01:25:08
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-15 14:56:03
 * 鉴权组件
 * id 可传number 或者 number数组
 * 如果是数组，默认存在其中一个权限就显示，可以通过every参数配置成拥有全部权限才显示
 */

import useApp from 'src/hook/useApp';
export default function PrivateComponent(props: {
  id: number | Array<number>;
  every?: Boolean;
  children?: any;
}) {
  const { hasPermission } = useApp();
  if (Array.isArray(props.id)) {
    const flag = props.every
      ? props.id.every((id) => hasPermission(id))
      : props.id.some((id) => hasPermission(id));
    return flag ? props.children : null;
  } else {
    return hasPermission(props.id) ? props.children : null;
  }
}
