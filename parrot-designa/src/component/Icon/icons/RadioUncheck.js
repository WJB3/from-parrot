import React from 'react';
import RadioUncheckSvg from '../svg/RadioUncheck';

import ParrotIcon from '../components/ParrotIcon';

const RadioUncheck=(props,ref)=><ParrotIcon {...props} ref={ref} icon={RadioUncheckSvg} />;

export default React.forwardRef(RadioUncheck)