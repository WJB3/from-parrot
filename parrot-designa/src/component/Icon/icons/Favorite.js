import React from 'react';
import FavoriteSvg from '../svg/Favorite';

import ParrotIcon from '../components/ParrotIcon';

const Favorite=(props,ref)=><ParrotIcon {...props} ref={ref} icon={FavoriteSvg} />;

export default React.forwardRef(Favorite)