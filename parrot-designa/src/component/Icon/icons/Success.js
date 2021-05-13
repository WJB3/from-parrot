import React from 'react';
import SuccessSvg from '../svg/Success';

import ParrotIcon from '../components/ParrotIcon';

const Success=(props,ref)=><ParrotIcon {...props} ref={ref} icon={SuccessSvg} />;

export default React.forwardRef(Success);