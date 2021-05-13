import React, { useMemo, useContext, cloneElement } from 'react';
import { IButtonGroupProps } from './index';
import { ButtonGroupContext } from './context/index';
import {
    ConfigContext
} from '../ConfigProvider/index';
import classNames from '../../utils/classNames';
import toChildrenArray from '../../utils/toChildrenArray';
import capitalize from '../../utils/capitalize';
import Paper from '../Paper/index';
import useDeep from '../../hook/useDeep';

const Group:React.FC<IButtonGroupProps> = (props) => {

    const {
        color,
        children,
        orientation = 'horizontal',
        prefixCls: customizePrefixCls,
        type = 'landscape',
        deep: deepProp = 0,
        size = 'default',
        disabled
    } = props;

    const deep = useDeep(deepProp, type === 'landscape' ? 2 : 0, disabled);

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('ButtonGroup', customizePrefixCls);

    const contextValue = useMemo(() => ({
        color: color,
        type: type,
        size: size
    }), [color, type, size]);

    return (
        <ButtonGroupContext.Provider value={contextValue}>
            <Paper
                className={
                    classNames(
                        prefixCls,
                        {
                            [`${prefixCls}-${capitalize(orientation)}`]: orientation
                        }
                    )
                }
                deep={deep}
            >
                {
                    toChildrenArray(children).map((Button, index) => {
                        return cloneElement(Button, {
                            key: `button-group-${index}`,
                            isFirst: index === 0,
                            isLast: index === React.Children.count(children) - 1,
                            inGroup: true
                        })
                    })
                }
            </Paper>
        </ButtonGroupContext.Provider>
    )
}

export default Group;
