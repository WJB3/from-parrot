import React from 'react';
import ExpandSvg from '../svg/Expand';

import ParrotIcon from '../components/ParrotIcon';

const Expand=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ExpandSvg} />;

export default React.forwardRef(Expand)