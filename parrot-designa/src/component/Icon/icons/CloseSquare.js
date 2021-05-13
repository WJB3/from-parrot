import React from 'react';
import CloseSquareSvg from '../svg/CloseSquare';

import ParrotIcon from '../components/ParrotIcon';

const CloseSquare=(props,ref)=><ParrotIcon {...props} ref={ref} icon={CloseSquareSvg} />;

export default React.forwardRef(CloseSquare)