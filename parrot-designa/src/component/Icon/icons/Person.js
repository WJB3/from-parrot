import React from 'react';
import PersonSvg from '../svg/Person';

import ParrotIcon from '../components/ParrotIcon';

const Person=(props,ref)=><ParrotIcon {...props} ref={ref} icon={PersonSvg} />;

export default React.forwardRef(Person)