import React from 'react';
import OutlineErrorSvg from '../svg/OutlineError';

import ParrotIcon from '../components/ParrotIcon';

const OutlineError=(props,ref)=><ParrotIcon {...props} ref={ref} icon={OutlineErrorSvg} />;

export default React.forwardRef(OutlineError)