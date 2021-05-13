import React from 'react';
import KeyboardArrowUpSvg from '../svg/KeyboardArrowUp';

import ParrotIcon from '../components/ParrotIcon';

const KeyboardArrowUp=(props,ref)=><ParrotIcon {...props} ref={ref} icon={KeyboardArrowUpSvg} />;

export default React.forwardRef(KeyboardArrowUp)