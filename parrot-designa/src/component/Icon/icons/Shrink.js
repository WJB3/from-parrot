import React from 'react';
import ShrinkSvg from '../svg/Shrink';

import ParrotIcon from '../components/ParrotIcon';

const Shrink=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ShrinkSvg} />;

export default React.forwardRef(Shrink)