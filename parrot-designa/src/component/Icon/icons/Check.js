import React from 'react';
import CheckSvg from '../svg/Check';

import ParrotIcon from '../components/ParrotIcon';

const Check=(props,ref)=><ParrotIcon {...props} ref={ref} icon={CheckSvg} />;

export default React.forwardRef(Check)