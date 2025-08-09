import 'styled-components';

// Define the theme interface
export interface ThemeType {
  colors: {
    // Brand colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    
    // Grayscale
    white: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    black: string;
    
    // Backgrounds
    background: string;
    surface: string;
    surfaceHover: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // UI Elements
    border: string;
    divider: string;
    
    // Status
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;
    
    // Social
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    
    // Earning specific
    earning: string;
    spending: string;
    premium: string;
  };
  
  // Typography
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  
  lineHeights: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  
  // Spacing
  space: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
  };
  
  // Border radius
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  
  // Shadows
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  
  // Z-index
  zIndices: {
    hide: number;
    base: number;
    docked: number;
    dropdown: number;
    sticky: number;
    banner: number;
    overlay: number;
    modal: number;
    popover: number;
    toast: number;
    tooltip: number;
  };
  
  // Breakpoints
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  
  // Transitions
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
  
  // Platform specific
  platform: {
    // Earning rates (in SRC - StreamRich Coins)
    earningRates: {
      videoPerMinute: number;
      audioPerMinute: number;
      premiumMultiplier: number;
      referralBonus: number;
      watchAdBonus: number;
    };
    
    // Upload costs
    uploadCosts: {
      videoPerMinute: number;
      audioPerMinute: number;
      thumbnail: number;
      promotion: {
        basic: number;
        standard: number;
        premium: number;
      };
    };
    
    // Subscription plans
    subscriptionPlans: {
      free: {
        price: number;
        features: string[];
      };
      pro: {
        price: number;
        features: string[];
      };
      premium: {
        price: number;
        features: string[];
      };
    };
    
    // Withdrawal settings
    withdrawal: {
      minimumAmount: number;
      feePercentage: number;
      processingTime: string;
    };
    
    // Content guidelines
    contentGuidelines: {
      maxVideoSize: string;
      maxAudioSize: string;
      allowedFormats: string[];
      maxDuration: string;
    };
    
    // Moderation settings
    moderation: {
      autoFlagThreshold: number;
      reviewThreshold: number;
      strikePolicy: {
        warningsBeforeStrike: number;
        strikesBeforeBan: number;
        strikeExpiryDays: number;
      };
    };
  };
}

// Extend styled-components default theme with our theme type
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
