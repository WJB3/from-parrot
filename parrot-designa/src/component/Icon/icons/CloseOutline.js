import React from 'react';
import CloseOutlineSvg from '../svg/CloseOutline';

import ParrotIcon from '../components/ParrotIcon';

const CloseOutline=(props,ref)=><ParrotIcon {...props} ref={ref} icon={CloseOutlineSvg} />;

export default React.forwardRef(CloseOutline)