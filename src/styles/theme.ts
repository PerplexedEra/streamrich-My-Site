// Theme colors and design tokens for StreamRich

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#6C63FF',       // Main brand purple
    primaryLight: '#9D94FF',  // Lighter shade for hover states
    primaryDark: '#4A42CC',   // Darker shade for active states
    
    // Accent colors
    secondary: '#00C9A7',     // Teal for earning indicators
    success: '#4CAF50',      // Success messages/buttons
    warning: '#FFC107',      // Warning messages
    danger: '#F44336',       // Error states/destructive actions
    info: '#2196F3',         // Informational messages
    
    // Grayscale
    white: '#FFFFFF',
    gray100: '#F5F7FA',
    gray200: '#E9EDF2',
    gray300: '#D9E1E7',
    gray400: '#C5D0DB',
    gray500: '#A0AEC0',
    gray600: '#718096',
    gray700: '#4A5568',
    gray800: '#2D3748',
    gray900: '#1A202C',
    black: '#000000',
    
    // Backgrounds
    background: '#0F0F1A',   // Dark theme background
    surface: '#1A1A2E',     // Cards/surfaces
    
    // Text
    textPrimary: '#FFFFFF',  // Primary text
    textSecondary: '#A0AEC0',// Secondary text
    textTertiary: '#718096', // Tertiary text
    
    // UI Elements
    border: '#2D3748',      // Borders and dividers
    disabled: '#4A5568',    // Disabled state
    hover: 'rgba(255, 255, 255, 0.1)', // Hover state overlay
    
    // Earning indicators
    earning: '#4CAF50',     // Earning color
    spending: '#F44336',    // Spending color (for creators)
  },
  
  // Typography
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Spacing
  space: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    40: '10rem',     // 160px
    48: '12rem',     // 192px
    56: '14rem',     // 224px
    64: '16rem',     // 256px
  },
  
  // Border radius
  radii: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '9999px',  // Full rounded
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(108, 99, 255, 0.5)',
    none: 'none',
  },
  
  // Z-index
  zIndices: {
    hide: -1,
    base: 1,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '30em',  // 480px
    md: '48em',  // 768px
    lg: '62em',  // 992px
    xl: '80em',  // 1280px
    '2xl': '96em', // 1536px
  },
  
  // Transitions
  transitions: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
  
  // Platform-specific values
  platform: {
    // Earning rates (in platform currency)
    earningRates: {
      videoPerMinute: 1.0,     // Earn 1 coin per minute of video watched
      musicPerMinute: 0.5,     // Earn 0.5 coins per minute of music played
      referralBonus: 10,       // Bonus for referring a friend
      dailyBonus: 5,           // Daily check-in bonus
    },
    
    // Upload costs (in platform currency)
    uploadCosts: {
      videoPerMinute: 2,       // Cost per minute of video
      musicPerMinute: 1,       // Cost per minute of music
      
      // Subscription plans for creators
      subscriptionPlans: [
        {
          id: 'basic',
          name: 'Basic',
          price: 9.99,
          features: [
            'Upload up to 10 videos/month',
            'Basic analytics',
            'Standard support'
          ]
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 29.99,
          features: [
            'Unlimited video uploads',
            'Advanced analytics',
            'Priority support',
            'Custom branding'
          ]
        }
      ]
    },
    
    // Withdrawal settings
    withdrawal: {
      minimumAmount: 100,      // Minimum coins to withdraw
      processingFee: 5,        // Fixed fee per withdrawal
      processingTime: '3-5 business days',
      methods: ['PayPal', 'Bank Transfer', 'Crypto']
    },
    
    // Content guidelines
    contentGuidelines: {
      maxVideoSize: '2GB',
      maxVideoLength: 60,      // minutes
      allowedFormats: ['mp4', 'webm', 'mov'],
      maxThumbnailSize: '5MB'
    },
    
    // Moderation settings
    moderation: {
      reportReasons: [
        'Inappropriate content',
        'Copyright infringement',
        'Spam or misleading content',
        'Harassment or bullying'
      ],
      reviewTime: '24-48 hours'
    }
  }
} as const;

export type Theme = typeof theme;
