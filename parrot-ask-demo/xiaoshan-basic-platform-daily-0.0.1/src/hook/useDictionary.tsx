/*
 * @Author: xuhansong
 * @Date: 2020-09-03 12:06:48
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-21 15:05:45
 *
 */
import React from 'react';
import { useGlobalState } from 'src/store';
import Select, { SelectProps } from 'antd/lib/select';
import Radio, { RadioGroupProps } from 'antd/lib/radio';
const { Option } = Select;
export default function useDictionary() {
  const [state] = useGlobalState();
  return {
    /**
     * 渲染某个dicCode的 value  name
     */
    renderText: (dicCode: string, value: number) => state.dictionary.get(dicCode)?.get(value),
    /**
     *  渲染dicCode Select
     */
    renderSelect: (
      dicCode: string,
      select?: SelectProps<number>,
      enhance?: (arr: [number, string][]) => [number, string][],
    ) => {
      const map = state.dictionary.get(dicCode);
      const data = enhance ? enhance([...map?.entries()]) : [...map?.entries()];
      return (
        <Select
          placeholder={'请选择'}
          {...select}
          getPopupContainer={(node) => {
            if (node?.parentElement) {
              return node.parentElement;
            }
            return document.body;
          }} allowClear>
          {data.map(([value, label]) => (
            <Option value={value} key={value}>
              {label}
            </Option>
          ))}
        </Select>
      );
    },
    /**
     * 渲染radio
     */
    renderRadio: (
      dicCode: string,
      props?: RadioGroupProps,
      enhance?: (arr: [number, string][]) => [number, string][],
    ) => {
      const map = state.dictionary.get(dicCode);
      const data = enhance ? enhance([...map?.entries()]) : [...map?.entries()];
      return (
        <Radio.Group {...props}>
          {data.map(([value, label]) => (
            <Radio value={value} key={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      );
    },
  };
}
