import React from 'react';
import QuestionOutlineSvg from '../svg/QuestionOutline';

import ParrotIcon from '../components/ParrotIcon';

const QuestionOutline=(props,ref)=><ParrotIcon {...props} ref={ref} icon={QuestionOutlineSvg} />;

export default React.forwardRef(QuestionOutline)