import React from 'react';
import KeyboardArrowLeftSvg from '../svg/KeyboardArrowLeft';

import ParrotIcon from '../components/ParrotIcon';

const KeyboardArrowLeft=(props,ref)=><ParrotIcon {...props} ref={ref} icon={KeyboardArrowLeftSvg} />;

export default React.forwardRef(KeyboardArrowLeft)