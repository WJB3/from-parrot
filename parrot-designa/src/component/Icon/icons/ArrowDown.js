import React from 'react';
import ArrowDownSvg from '../svg/ArrowDown';

import ParrotIcon from '../components/ParrotIcon';

const ArrowDown=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ArrowDownSvg} />;

export default React.forwardRef(ArrowDown)