import React from 'react';
import ErrorSvg from '../svg/Error';

import ParrotIcon from '../components/ParrotIcon';

const Error=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ErrorSvg} />;

export default React.forwardRef(Error);