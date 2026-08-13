import Svg, { Line } from 'react-native-svg';

interface Props {
  size?: number;
  color: string;
  strokeWidth?: number;
}

/** Cruce ortodoxă cu trei brațe, în stil line-art, discretă. */
export function OrthodoxCross({ size = 20, color, strokeWidth = 1.8 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="8.5" y1="5.5" x2="15.5" y2="5.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="9" y1="19.5" x2="15.5" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
