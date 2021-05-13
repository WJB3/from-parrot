import React from 'react';
import OutlineSuccessSvg from '../svg/OutlineSuccess';

import ParrotIcon from '../components/ParrotIcon';

const OutlineSuccess=(props,ref)=><ParrotIcon {...props} ref={ref} icon={OutlineSuccessSvg} />;

export default React.forwardRef(OutlineSuccess)