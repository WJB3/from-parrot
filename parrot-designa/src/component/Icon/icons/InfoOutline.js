import React from 'react';
import OutlineInfoSvg from '../svg/OutlineInfo';

import ParrotIcon from '../components/ParrotIcon';

const OutlineInfo=(props,ref)=><ParrotIcon {...props} ref={ref} icon={OutlineInfoSvg} />;

export default React.forwardRef(OutlineInfo)