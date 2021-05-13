import React from 'react';
import ArrowDoubleLeftSvg from '../svg/ArrowDoubleLeft';

import ParrotIcon from '../components/ParrotIcon';

const ArrowDoubleLeft=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ArrowDoubleLeftSvg} />;

export default React.forwardRef(ArrowDoubleLeft)