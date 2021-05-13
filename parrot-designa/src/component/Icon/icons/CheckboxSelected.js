import React from 'react';
import CheckboxSelectedSvg from '../svg/CheckboxSelected';

import ParrotIcon from '../components/ParrotIcon';

const CheckboxSelected=(props,ref)=><ParrotIcon {...props} ref={ref} icon={CheckboxSelectedSvg} />;

export default React.forwardRef(CheckboxSelected)