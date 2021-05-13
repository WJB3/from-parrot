import React from 'react';
import ArrowUpSvg from '../svg/ArrowUp';

import ParrotIcon from '../components/ParrotIcon';

const ArrowUp=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ArrowUpSvg} />;

export default React.forwardRef(ArrowUp)