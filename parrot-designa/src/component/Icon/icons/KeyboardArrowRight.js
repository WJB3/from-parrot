import React from 'react';
import KeyboardArrowRightSvg from '../svg/KeyboardArrowRight';

import ParrotIcon from '../components/ParrotIcon';

const KeyboardArrowRight=(props,ref)=><ParrotIcon {...props} ref={ref} icon={KeyboardArrowRightSvg} />;

export default React.forwardRef(KeyboardArrowRight)