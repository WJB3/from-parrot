import React from 'react';
import KeyboardArrowDownSvg from '../svg/KeyboardArrowDown';

import ParrotIcon from '../components/ParrotIcon';

const KeyboardArrowDown=(props,ref)=><ParrotIcon {...props} ref={ref} icon={KeyboardArrowDownSvg} />;

export default React.forwardRef(KeyboardArrowDown)