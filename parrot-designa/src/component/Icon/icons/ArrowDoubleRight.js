import React from 'react';
import ArrowDoubleRightSvg from '../svg/ArrowDoubleRight';

import ParrotIcon from '../components/ParrotIcon';

const ArrowDoubleRight=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ArrowDoubleRightSvg} />;

export default React.forwardRef(ArrowDoubleRight)