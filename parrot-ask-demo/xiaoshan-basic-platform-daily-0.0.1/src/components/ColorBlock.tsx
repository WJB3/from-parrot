import React, { CSSProperties } from 'react';

export default function ColorBlock(props: {
  size: number;
  color: string;
  border: string;
  style?: CSSProperties;
}) {
  const { size, color, border, style } = props;
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundColor: color,
        border,
        marginRight: 4,
        ...style,
      }}></span>
  );
}
ColorBlock.defaultProps = {
  size: 16,
  color: '#fff',
  border: '1px solid #C6C8CC',
};
