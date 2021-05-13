import React from 'react';
import RadioCheckedSvg from '../svg/RadioChecked';

import ParrotIcon from '../components/ParrotIcon';

const RadioChecked=(props,ref)=><ParrotIcon {...props} ref={ref} icon={RadioCheckedSvg} />;

export default React.forwardRef(RadioChecked)