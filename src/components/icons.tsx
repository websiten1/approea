import Svg, { Line, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color: string;
  strokeWidth?: number;
}

export function CalendarIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="5" width="17" height="15.5" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="8" y1="3" x2="8" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BookIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6.5C10.5 5.3 8.3 4.7 4.5 4.7V17.8C8.3 17.8 10.5 18.4 12 19.6C13.5 18.4 15.7 17.8 19.5 17.8V4.7C15.7 4.7 13.5 5.3 12 6.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Line x1="12" y1="6.5" x2="12" y2="19.6" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function NewsIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="5.5" width="17" height="13" rx="1.2" stroke={color} strokeWidth={strokeWidth} />
      <Rect x="6" y="8" width="5.5" height="4.5" rx="0.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="14" y1="8.3" x2="17.5" y2="8.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="14" y1="11" x2="17.5" y2="11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="6" y1="15" x2="17.5" y2="15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function SoliaIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3.5H18V20.5L12 17.3L6 20.5V3.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
