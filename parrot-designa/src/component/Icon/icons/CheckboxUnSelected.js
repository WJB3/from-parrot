import React from 'react';
import CheckboxUnSelectedSvg from '../svg/CheckboxUnSelected';

import ParrotIcon from '../components/ParrotIcon';

const CheckboxUnSelected=(props,ref)=><ParrotIcon {...props} ref={ref} icon={CheckboxUnSelectedSvg} />;

export default React.forwardRef(CheckboxUnSelected)