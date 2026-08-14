import { createContext, PropsWithChildren, useContext } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

/**
 * SCOPE NOTE: This is a lightweight, config-driven charting kit inspired by shadcn/ui's
 * chart.tsx (which wraps recharts on web). Here the primitives (LineChart/BarChart/PieChart)
 * are hand-rolled on top of react-native-svg instead of recharts. Full feature parity
 * (zoom, brush, animated transitions, complex multi-axis tooltips, responsive containers)
 * is explicitly OUT of scope — this gives working, readable rendering plus the
 * Container/Tooltip/Legend "chrome" components that match shadcn's config-driven API shape.
 */

// ---------------------------------------------------------------------------
// ChartContainer / config context
// ---------------------------------------------------------------------------

export interface ChartConfigEntry {
  label?: string;
  color?: string;
}

export type ChartConfig = Record<string, ChartConfigEntry>;

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChartConfig() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('Chart.* components must be used within <ChartContainer>');
  return ctx;
}

interface ChartContainerProps {
  config: ChartConfig;
  style?: ViewStyle;
}

export function ChartContainer({ config, style, children }: PropsWithChildren<ChartContainerProps>) {
  return (
    <ChartContext.Provider value={{ config }}>
      <View style={mergeStyles<ViewStyle>(styles.container, style)}>{children}</View>
    </ChartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// ChartTooltip / ChartTooltipContent — a small floating label box.
// Since RN has no hover, this renders when explicitly given an active payload
// (e.g. driven by a press/gesture handler in the consuming screen).
// ---------------------------------------------------------------------------

export interface ChartTooltipPayloadItem {
  key: string;
  value: number | string;
  color?: string;
  label?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
  style?: ViewStyle;
}

export function ChartTooltip({ active, payload, label, style }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return <ChartTooltipContent payload={payload} label={label} style={style} />;
}

interface ChartTooltipContentProps {
  payload?: ChartTooltipPayloadItem[];
  label?: string;
  style?: ViewStyle;
}

export function ChartTooltipContent({ payload, label, style }: ChartTooltipContentProps) {
  const { config } = useChartConfig();
  if (!payload || payload.length === 0) return null;

  return (
    <View style={mergeStyles<ViewStyle>(styles.tooltip, style)}>
      {label ? <Text style={styles.tooltipLabel}>{label}</Text> : null}
      {payload.map((item) => {
        const entry = config[item.key];
        const color = item.color ?? entry?.color ?? uiColors.primary;
        const displayLabel = item.label ?? entry?.label ?? item.key;
        return (
          <View key={item.key} style={styles.tooltipRow}>
            <View style={mergeStyles<ViewStyle>(styles.dot, { backgroundColor: color })} />
            <Text style={styles.tooltipRowLabel}>{displayLabel}</Text>
            <Text style={styles.tooltipRowValue}>{String(item.value)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// ChartLegend / ChartLegendContent — row of colored-dot + label items.
// ---------------------------------------------------------------------------

interface ChartLegendProps {
  keys: string[];
  style?: ViewStyle;
}

export function ChartLegend({ keys, style }: ChartLegendProps) {
  return <ChartLegendContent keys={keys} style={style} />;
}

export function ChartLegendContent({ keys, style }: ChartLegendProps) {
  const { config } = useChartConfig();
  return (
    <View style={mergeStyles<ViewStyle>(styles.legend, style)}>
      {keys.map((key) => {
        const entry = config[key];
        return (
          <View key={key} style={styles.legendItem}>
            <View style={mergeStyles<ViewStyle>(styles.dot, { backgroundColor: entry?.color ?? uiColors.primary })} />
            <Text style={styles.legendLabel}>{entry?.label ?? key}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Chart primitives (react-native-svg based)
// ---------------------------------------------------------------------------

export interface ChartPoint {
  x: number | string;
  y: number;
}

interface LineChartProps {
  /** One array of points per series/line. */
  data: ChartPoint[][];
  width: number;
  height: number;
  colors?: string[];
  strokeWidth?: number;
  style?: ViewStyle;
}

function scalePoints(points: ChartPoint[], width: number, height: number, padding: number) {
  const numericXs = points.map((p, i) => (typeof p.x === 'number' ? p.x : i));
  const ys = points.map((p) => p.y);
  const minX = Math.min(...numericXs);
  const maxX = Math.max(...numericXs);
  const minY = Math.min(0, ...ys);
  const maxY = Math.max(...ys, 1);

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  return points.map((p, i) => {
    const xv = typeof p.x === 'number' ? p.x : i;
    const nx = maxX === minX ? 0.5 : (xv - minX) / (maxX - minX);
    const ny = maxY === minY ? 0.5 : (p.y - minY) / (maxY - minY);
    return {
      cx: padding + nx * innerW,
      cy: padding + innerH - ny * innerH,
    };
  });
}

export function LineChart({ data, width, height, colors, strokeWidth = 2, style }: LineChartProps) {
  const padding = 12;
  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {data.map((series, seriesIndex) => {
          const scaled = scalePoints(series, width, height, padding);
          const d = scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ');
          const color = colors?.[seriesIndex] ?? uiColors.primary;
          return (
            <G key={seriesIndex}>
              <Path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" />
              {scaled.map((p, i) => (
                <Circle key={i} cx={p.cx} cy={p.cy} r={strokeWidth} fill={color} />
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

interface BarChartProps {
  /** One value per bar; for grouped bars, pass an array of series each aligned by index. */
  data: number[] | number[][];
  width: number;
  height: number;
  colors?: string[];
  style?: ViewStyle;
}

export function BarChart({ data, width, height, colors, style }: BarChartProps) {
  const padding = 12;
  const series: number[][] = Array.isArray(data[0]) ? (data as number[][]) : [data as number[]];
  const groupCount = series[0]?.length ?? 0;
  const seriesCount = series.length;
  const maxValue = Math.max(1, ...series.flat());

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const groupWidth = groupCount > 0 ? innerW / groupCount : 0;
  const barGap = 2;
  const barWidth = seriesCount > 0 ? Math.max(1, groupWidth / seriesCount - barGap) : 0;

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke={uiColors.border}
          strokeWidth={1}
        />
        {series.map((values, seriesIndex) =>
          values.map((value, i) => {
            const barHeight = (value / maxValue) * innerH;
            const x = padding + i * groupWidth + seriesIndex * (barWidth + barGap);
            const y = height - padding - barHeight;
            const color = colors?.[seriesIndex] ?? uiColors.primary;
            return <Rect key={`${seriesIndex}-${i}`} x={x} y={y} width={barWidth} height={barHeight} fill={color} rx={2} />;
          })
        )}
      </Svg>
    </View>
  );
}

export interface PieSlice {
  value: number;
  color?: string;
  label?: string;
}

interface PieChartProps {
  data: PieSlice[];
  width: number;
  height: number;
  colors?: string[];
  innerRadiusRatio?: number;
  style?: ViewStyle;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({ data, width, height, colors, style }: PieChartProps) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 4;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  let cursor = 0;
  const slices = data.map((slice, i) => {
    const sliceAngle = (slice.value / total) * 360;
    const startAngle = cursor;
    const endAngle = cursor + sliceAngle;
    cursor = endAngle;
    return {
      d: arcPath(cx, cy, r, startAngle, endAngle),
      color: slice.color ?? colors?.[i] ?? uiColors.primary,
      key: i,
    };
  });

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {slices.map((slice) => (
          <Path key={slice.key} d={slice.d} fill={slice.color} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  tooltip: {
    backgroundColor: uiColors.popover,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: 2,
  },
  tooltipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: uiColors.foreground,
    marginBottom: 2,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tooltipRowLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    color: uiColors.mutedForeground,
    flex: 1,
  },
  tooltipRowValue: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: uiColors.foreground,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendLabel: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: uiColors.mutedForeground,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
