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

export function EventsIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="5" width="17" height="15.5" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="8" y1="3" x2="8" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path
        d="M12 12.3C11.4 11.6 10.5 11.3 9.7 11.6C8.8 11.9 8.3 12.8 8.5 13.7C8.7 14.9 10 15.9 12 17.1C14 15.9 15.3 14.9 15.5 13.7C15.7 12.8 15.2 11.9 14.3 11.6C13.5 11.3 12.6 11.6 12 12.3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SettingsIcon({ size = 22, color, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M19.4 13.5C19.5 13 19.5 12.5 19.4 12C19.4 11.5 19.5 11 19.4 10.5L21 9.3L19.5 6.7L17.6 7.4C17.2 7.1 16.8 6.8 16.3 6.6L16 4.6H13L12.7 6.6C12.2 6.8 11.8 7.1 11.4 7.4L9.5 6.7L8 9.3L9.6 10.5C9.5 11 9.5 11.5 9.5 12C9.5 12.5 9.5 13 9.6 13.5L8 14.7L9.5 17.3L11.4 16.6C11.8 16.9 12.2 17.2 12.7 17.4L13 19.4H16L16.3 17.4C16.8 17.2 17.2 16.9 17.6 16.6L19.5 17.3L21 14.7L19.4 13.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
