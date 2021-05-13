import React, { ReactNode } from 'react';
import { Row } from 'antd';
interface Step {
  title: string | ReactNode;
  desc?: string | ReactNode;
  content?: string | ReactNode;
}
interface Props {
  datasource: Step[];
}
export default function SimpleSteps(props: Props) {
  return (
    <div className='gt_steps'>
      {props.datasource.map((step, index) => (
        <Row>
          <span className='gt_step_index'>{index + 1}</span>
          <div className='gt_step_content'>
            <p className='gt_step_title'>
              <b>{step.title}</b>
            </p>
            <p className='gt_step_desc'>{step.desc}</p>
            <p>{step.content}</p>
          </div>
        </Row>
      ))}
    </div>
  );
}
