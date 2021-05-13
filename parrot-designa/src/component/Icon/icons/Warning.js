import React from 'react';
import WarningSvg from '../svg/Warning';

import ParrotIcon from '../components/ParrotIcon';

const Warning=(props,ref)=><ParrotIcon {...props} ref={ref} icon={WarningSvg} />;

export default React.forwardRef(Warning)