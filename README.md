# MaintAI Platform

A comprehensive maintenance management and monitoring system built with React and Vite, featuring advanced A/B testing capabilities for continuous optimization.

## Features

- **User Authentication**: Secure login system with demo credentials
- **Dashboard Overview**: Real-time system status and quick actions
- **Key Functional Areas**: 
  - Machine Monitoring
  - Predictive Analytics
  - Security Management
  - Data Integration
- **Recent Activities**: Track maintenance activities and system events
- **A/B Testing Framework**: Built-in experimentation platform for optimizing user experience
- **Responsive Design**: Works on desktop and mobile devices

## Demo Credentials

- Username: `admin`
- Password: `password`

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **A/B Testing**: Custom-built framework with analytics
- **Build Tool**: Vite
- **Deployment**: Optimized for Vercel

## A/B Testing Features

The MaintAI Platform includes a comprehensive A/B testing framework that allows you to:

- **Run Experiments**: Test different UI variations and features
- **Track Conversions**: Monitor user interactions and conversion rates
- **Analyze Results**: View detailed analytics and performance metrics
- **User Segmentation**: Consistent assignment based on user IDs
- **Real-time Analytics**: Live dashboard showing test performance

### Current A/B Tests

1. **Dashboard Button Color Test**: Testing blue vs green button colors for better conversion
2. **Dashboard Layout Test**: Comparing standard vs compact layout designs

### A/B Testing Components

- `ABTestProvider`: React context provider for A/B testing
- `ABTestButton`: Button component with built-in conversion tracking
- `ABTestAnalytics`: Analytics dashboard for monitoring test performance
- `ab-testing.js`: Core A/B testing framework and utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd maint-ai-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
pnpm build
```

The build output will be in the `dist/` directory.

## Deployment on Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Vite project and configure the build settings
6. Click "Deploy"

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Method 3: Manual Upload

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder to Vercel

## Project Structure

```
maint-ai-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (50+ components)
│   │   ├── ABTestProvider.jsx    # A/B testing context provider
│   │   ├── ABTestButton.jsx      # A/B test enabled button component
│   │   ├── ABTestAnalytics.jsx   # A/B test analytics dashboard
│   │   ├── Dashboard.jsx         # Main dashboard component
│   │   └── LoginForm.jsx         # Authentication component
│   ├── lib/
│   │   ├── ab-testing.js         # A/B testing framework
│   │   └── utils.js              # Utility functions
│   ├── hooks/
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Application styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── dist/                         # Build output (generated)
├── components.json               # shadcn/ui configuration
├── jsconfig.json                 # JavaScript configuration
├── package.json
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
└── README.md
```

## Configuration

The application is pre-configured for Vercel deployment with:

- `base: './'` in `vite.config.js` for proper asset resolution
- Responsive design with Tailwind CSS
- Modern React patterns with hooks
- Component-based architecture
- Built-in A/B testing framework

## A/B Testing Usage

### Basic Usage

```jsx
import { useABTest } from '../lib/ab-testing'

function MyComponent() {
  const { variantId, config, trackConversion, isInVariant } = useABTest('myTestId')
  
  const handleClick = () => {
    trackConversion('button_click', 1)
  }
  
  return (
    <button 
      className={config?.buttonClass || 'default-class'}
      onClick={handleClick}
    >
      {isInVariant('variant_a') ? 'New Text' : 'Original Text'}
    </button>
  )
}
```

### Using ABTestButton Component

```jsx
import ABTestButton from './ABTestButton'

function Dashboard() {
  return (
    <ABTestButton
      testId="dashboardButtonColor"
      conversionType="schedule_maintenance_click"
      variant="outline"
      className="h-20 flex-col"
    >
      Schedule Maintenance
    </ABTestButton>
  )
}
```

### Configuring A/B Tests

Edit `src/lib/ab-testing.js` to add new tests:

```javascript
export const AB_TESTS = {
  myNewTest: {
    id: 'my-new-test',
    name: 'My New Test',
    description: 'Testing a new feature',
    variants: {
      control: {
        id: 'control',
        name: 'Control Version',
        weight: 50,
        config: { /* configuration */ }
      },
      variant_a: {
        id: 'variant_a',
        name: 'New Version',
        weight: 50,
        config: { /* configuration */ }
      }
    },
    active: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  }
}
```

## Features Overview

### Authentication
- Simple login form with validation
- Demo credentials for testing
- Session management with localStorage
- Secure logout functionality

### Dashboard
- Real-time statistics display
- System status monitoring
- Quick action buttons with A/B testing
- Tabbed interface for different views
- A/B test analytics dashboard

### Key Functional Areas
- Machine Monitoring with real-time tracking
- Predictive Analytics for maintenance scheduling
- Security Management for access control
- Data Integration for third-party systems
- A/B Testing for continuous optimization

### Recent Activities
- Activity timeline with status indicators
- Different activity types (maintenance, alerts, inspections, repairs)
- Time-based sorting
- Status-based color coding

### A/B Testing Analytics
- Real-time experiment monitoring
- Conversion rate tracking
- User assignment visualization
- Test performance comparison
- Data export capabilities

## Customization

### Adding New Components
1. Create component in `src/components/`
2. Import and use in parent components
3. Follow the existing pattern for styling with Tailwind CSS

### Modifying Styles
- Global styles: `src/index.css` and `src/App.css`
- Component styles: Use Tailwind CSS classes
- Custom themes: Modify CSS variables in `App.css`

### Adding New A/B Tests
1. Define test configuration in `src/lib/ab-testing.js`
2. Use `useABTest` hook or `ABTestButton` component
3. Track conversions with appropriate event names
4. Monitor results in the A/B Tests dashboard tab

### Adding New Features
1. Create new components in `src/components/`
2. Add routing if needed (react-router-dom is available)
3. Update the main App.jsx to include new features
4. Consider A/B testing new features for optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized bundle size with tree shaking
- Lazy loading for better performance
- Efficient A/B testing with minimal overhead
- Responsive design for all device sizes

## Analytics and Tracking

The A/B testing framework includes:
- User assignment tracking
- Conversion event tracking
- Local storage for demo purposes
- Extensible for integration with analytics services

## License

This project is created as a demonstration of the MaintAI platform interface with advanced A/B testing capabilities.

## Support

For deployment issues or questions, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly including A/B testing functionality
5. Submit a pull request

## Changelog

### v1.1.0 - A/B Testing Release
- Added comprehensive A/B testing framework
- Implemented button color and layout experiments
- Added A/B testing analytics dashboard
- Enhanced UI components with shadcn/ui
- Improved responsive design
- Added conversion tracking

### v1.0.0 - Initial Release
- Basic dashboard functionality
- User authentication
- Machine monitoring
- Predictive analytics
- Security management

