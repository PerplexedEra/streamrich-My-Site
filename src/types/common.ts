// Common types and interfaces used across the application

/**
 * Represents a key-value pair
 */
export interface KeyValuePair<T = any> {
  key: string;
  value: T;
}

/**
 * Represents a select option with label and value
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Represents a breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

/**
 * Represents a tab item
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  count?: number;
  component: React.ReactNode;
}

/**
 * Represents a filter option
 */
export interface FilterOption {
  id: string;
  label: string;
  value: any;
  type?: 'checkbox' | 'radio' | 'select' | 'date' | 'range' | 'search';
  options?: SelectOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Represents a sort option
 */
export interface SortOption<T = string> {
  id: string;
  label: string;
  value: T;
  direction: 'asc' | 'desc';
  default?: boolean;
}

/**
 * Represents a pagination query
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any; // For additional query parameters
}


/**
 * Represents a file upload response
 */
export interface FileUploadResponse {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: string;
}

/**
 * Represents a date range
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Represents a time duration
 */
export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Represents a coordinate point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents a size
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Represents a rectangle
 */
export interface Rect extends Point, Size {}

/**
 * Represents a color in RGB format
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Represents a color in HSL format
 */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

/**
 * Represents a color in HEX format
 */
export type HexColor = string;

/**
 * Represents a color in any format
 */
export type AnyColor = string | RGBColor | HSLColor;

/**
 * Represents a theme color
 */
export interface ThemeColor {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

/**
 * Represents a breakpoint
 */
export interface Breakpoint {
  min: number;
  max: number;
  label: string;
}

/**
 * Represents a media query
 */
export interface MediaQuery {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'portrait' | 'landscape';
  prefersColorScheme?: 'light' | 'dark';
  prefersReducedMotion?: 'reduce' | 'no-preference';
  hover?: 'hover' | 'none';
  pointer?: 'fine' | 'coarse' | 'none';
}

/**
 * Represents a CSS transition
 */
export interface Transition {
  property: string;
  duration: string;
  timingFunction: string;
  delay?: string;
}

/**
 * Represents a CSS animation
 */
export interface Animation {
  name: string;
  duration: string;
  timingFunction: string;
  delay?: string;
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  playState?: 'running' | 'paused';
}

/**
 * Represents a CSS transform
 */
export interface Transform {
  translateX?: string | number;
  translateY?: string | number;
  translateZ?: string | number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  skewX?: string;
  skewY?: string;
  perspective?: string | number;
  transformOrigin?: string;
  transformStyle?: 'flat' | 'preserve-3d';
  backfaceVisibility?: 'visible' | 'hidden';
  transformBox?: 'border-box' | 'fill-box' | 'view-box';
}

/**
 * Represents a CSS filter
 */
export interface Filter {
  blur?: string;
  brightness?: number | string;
  contrast?: number | string;
  grayscale?: number | string;
  hueRotate?: string;
  invert?: number | string;
  opacity?: number | string;
  saturate?: number | string;
  sepia?: number | string;
  dropShadow?: string;
  backdropFilter?: string;
}

/**
 * Represents a CSS grid
 */
export interface Grid {
  display?: 'grid' | 'inline-grid' | 'subgrid';
  templateColumns?: string;
  templateRows?: string;
  templateAreas?: string;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  autoColumns?: string;
  autoRows?: string;
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  placeItems?: string;
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  justifySelf?: 'start' | 'end' | 'center' | 'stretch' | 'auto';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' | 'auto';
  placeSelf?: string;
  gridArea?: string;
  gridColumn?: string;
  gridRow?: string;
  gridColumnStart?: string | number;
  gridColumnEnd?: string | number;
  gridRowStart?: string | number;
  gridRowEnd?: string | number;
}
