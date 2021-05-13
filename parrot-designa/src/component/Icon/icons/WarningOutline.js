import React from 'react';
import OutlineWarningSvg from '../svg/OutlineWarning';

import ParrotIcon from '../components/ParrotIcon';

const OutlineWarning=(props,ref)=><ParrotIcon {...props} ref={ref} icon={OutlineWarningSvg} />;

export default React.forwardRef(OutlineWarning)