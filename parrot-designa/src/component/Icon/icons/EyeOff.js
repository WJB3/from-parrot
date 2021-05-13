import React from 'react';
import EyeOffSvg from '../svg/EyeOff';

import ParrotIcon from '../components/ParrotIcon';

const EyeOff=(props,ref)=><ParrotIcon {...props} ref={ref} icon={EyeOffSvg} />;

export default React.forwardRef(EyeOff)