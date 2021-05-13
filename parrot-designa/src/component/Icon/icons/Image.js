import React from 'react';
import ImageSvg from '../svg/Image';

import ParrotIcon from '../components/ParrotIcon';

const Image=(props,ref)=><ParrotIcon {...props} ref={ref} icon={ImageSvg} />;

export default React.forwardRef(Image)