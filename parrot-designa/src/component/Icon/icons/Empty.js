import React from 'react';
import EmptySvg from '../svg/Empty';

import ParrotIcon from '../components/ParrotIcon';

const Empty=(props,ref)=><ParrotIcon {...props} ref={ref} icon={EmptySvg} />;

export default React.forwardRef(Empty)