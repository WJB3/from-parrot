import React from 'react';
import EditSvg from '../svg/Edit';

import ParrotIcon from '../components/ParrotIcon';

const Edit=(props,ref)=><ParrotIcon {...props} ref={ref} icon={EditSvg} />;

export default React.forwardRef(Edit)