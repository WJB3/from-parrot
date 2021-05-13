/*
 * @Author: xuhansong
 * @Date: 2020-10-16 15:46:13
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-16 15:46:37
 * table 组件中使用的单行文案，点击展示全部
 */
import React, { useState } from 'react';
export default function OneLineText(props: { maxWidth?: any; children: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => {
        setExpanded(!expanded);
      }}
      style={{
        whiteSpace: expanded ? undefined : 'nowrap',
        maxWidth: props.maxWidth || 300,
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
      }}>
      {props.children}
    </div>
  );
}
