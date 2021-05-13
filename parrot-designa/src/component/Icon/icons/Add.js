import React from 'react';
import AddSvg from '../svg/Add';

import ParrotIcon from '../components/ParrotIcon';

const Add=(props,ref)=><ParrotIcon {...props} ref={ref} icon={AddSvg} />;

export default React.forwardRef(Add)