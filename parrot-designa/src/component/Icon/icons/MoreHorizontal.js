import React from 'react';
import MoreHorizontalSvg from '../svg/MoreHorizontal';

import ParrotIcon from '../components/ParrotIcon';

const MoreHorizontal=(props,ref)=><ParrotIcon {...props} ref={ref} icon={MoreHorizontalSvg} />;

export default React.forwardRef(MoreHorizontal)