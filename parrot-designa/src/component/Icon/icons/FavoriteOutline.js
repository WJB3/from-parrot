import React from 'react';
import FavoriteOutlineSvg from '../svg/FavoriteOutline';

import ParrotIcon from '../components/ParrotIcon';

const FavoriteOutline=(props,ref)=><ParrotIcon {...props} ref={ref} icon={FavoriteOutlineSvg} />;

export default React.forwardRef(FavoriteOutline)