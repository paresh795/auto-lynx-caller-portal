
# AutoLynx - Product Requirements Document

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Technical Architecture](#technical-architecture)
4. [Feature Specifications](#feature-specifications)
5. [User Experience Flow](#user-experience-flow)
6. [Data Models](#data-models)
7. [Integration Points](#integration-points)
8. [Security & Compliance](#security--compliance)
9. [Performance Requirements](#performance-requirements)
10. [Deployment & Infrastructure](#deployment--infrastructure)
11. [Development Guidelines](#development-guidelines)
12. [Future Roadmap](#future-roadmap)

---

## Executive Summary

**AutoLynx** is a comprehensive web-based platform designed to streamline outbound calling campaigns through intelligent automation. The platform enables users to upload contact lists, monitor campaign progress in real-time, and analyze performance metrics through an intuitive dashboard interface.

### Key Value Propositions
- **Ease of Use**: Simplified contact upload via CSV files or interactive chat interface
- **Real-time Monitoring**: Live campaign tracking with automatic status updates
- **Data-Driven Insights**: Comprehensive analytics and performance metrics
- **Flexible Integration**: Configurable webhook endpoints for external workflow integration
- **Scalable Architecture**: Built on modern cloud infrastructure for reliability and growth

---

## Product Overview

### Target Users
- **Sales Teams**: Outbound sales representatives managing prospect lists
- **Marketing Teams**: Campaign managers running targeted outreach programs
- **Call Centers**: Operations managers overseeing calling campaigns
- **Small Businesses**: Entrepreneurs managing customer outreach

### Core Functionality
1. **Contact Management**: Upload, organize, and manage contact lists
2. **Campaign Execution**: Automated calling workflow integration
3. **Real-time Monitoring**: Live status tracking and progress updates
4. **Analytics Dashboard**: Performance metrics and trend analysis
5. **Chat Interface**: AI-powered contact input and formatting assistance

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite (latest)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/UI component library
- **State Management**: React hooks with custom state management
- **Routing**: React Router DOM v6.26.2
- **Charts**: Recharts v2.12.7 for data visualization

### Backend Infrastructure
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Authentication**: Supabase Auth (ready for implementation)
- **Real-time Updates**: Supabase Realtime subscriptions
- **File Handling**: React Dropzone for CSV uploads
- **External Integration**: Configurable webhook endpoints

### Key Dependencies
```json
{
  "react": "^18.3.1",
  "typescript": "latest",
  "tailwindcss": "latest",
  "@supabase/supabase-js": "^2.49.8",
  "@tanstack/react-query": "^5.56.2",
  "react-dropzone": "^14.3.8",
  "recharts": "^2.12.7",
  "lucide-react": "^0.462.0"
}
```

---

## Feature Specifications

### 1. Contact Upload System

#### CSV Upload Component (`CsvDropZone.tsx`)
- **File Support**: .csv and .txt files
- **Validation**: Automatic format validation and error reporting
- **Size Limits**: Maximum 50 contacts per campaign
- **Required Fields**:
  - `name`: 2-64 characters
  - `phone`: E.164 format (+1234567890)
  - `business_name`: Optional company name
- **Error Handling**: Comprehensive error messages with retry capability
- **Status Feedback**: Visual upload progress and completion status

#### Chat Interface Components
**ChatWidget.tsx** (Floating Widget):
- Collapsible floating interface (bottom-right corner)
- Multi-message conversation flow
- Real-time response handling
- Gradient purple theme design
- Auto-scroll to latest messages

**InlineChat.tsx** (Embedded Component):
- Embedded chat for upload page
- Contact parsing from natural language input
- Format validation and preview
- Multi-format support (CSV, natural language)

### 2. Dashboard & Analytics

#### Key Metrics (`useDashboardStats.ts`)
- **Total Campaigns**: Count of all created campaigns
- **Total Calls**: Sum of all contact attempts
- **Success Rate**: Percentage of successful calls (DONE status)
- **Today's Calls**: Calls made in current day
- **Active Campaigns**: Campaigns with pending contacts
- **Average Duration**: Mean call length from transcript data
- **Trend Analysis**: 7-day rolling statistics

#### Visualization Components
- **Line Charts**: Call volume and success trends
- **KPI Cards**: Key performance indicators
- **Real-time Updates**: Automatic refresh on data changes
- **Responsive Design**: Mobile-friendly chart rendering

### 3. Campaign Management

#### Campaign Tracking (`useCampaigns.ts`)
- **Status Monitoring**: NEW, CALLING, DONE, FAILED states
- **Progress Calculation**: Completion percentages
- **Last Activity**: Timestamp tracking
- **Real-time Updates**: Live status synchronization

#### Contact Management (`useContacts.ts`)
- **Individual Tracking**: Per-contact status and history
- **Processing Order**: Queue management
- **Transcript Storage**: Call recording and analysis data
- **Campaign Association**: Contact-to-campaign mapping

### 4. Configuration System

#### Webhook Configuration (`useWebhookConfig.ts`)
- **Dual Endpoints**: 
  - Chat webhook for conversational input
  - CSV upload webhook for file processing
- **Local Storage**: Persistent configuration storage
- **Event Broadcasting**: Configuration change notifications
- **Validation**: URL format validation

### 5. User Interface Components

#### Navigation & Layout
- **Responsive Sidebar**: Collapsible navigation menu
- **Route Management**: Multi-page application structure
- **Breadcrumb System**: Page hierarchy navigation
- **Toast Notifications**: User feedback system

#### Page Components
- **Index Page**: Landing page with overview
- **Upload Page**: Contact input interface
- **Dashboard Page**: Analytics and metrics
- **Campaigns Page**: Campaign management interface
- **Settings Page**: Configuration management

---

## User Experience Flow

### 1. Initial Setup Flow
```
Landing Page → Settings Configuration → Webhook URL Input → Validation → Ready State
```

### 2. Contact Upload Flow
```
Upload Page → Method Selection (CSV/Chat) → Data Input → Validation → Webhook Submission → Campaign Creation → Status Monitoring
```

### 3. Campaign Monitoring Flow
```
Dashboard/Campaigns → Real-time Status Updates → Contact Progress → Completion Analysis → Results Review
```

### 4. Chat Interaction Flow
```
Chat Interface → Natural Language Input → AI Processing → Contact Parsing → Validation → Campaign Submission
```

---

## Data Models

### Database Schema

#### `campaigns` Table
```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `contacts` Table
```sql
CREATE TABLE contacts (
  row_id TEXT PRIMARY KEY,
  campaign_id TEXT,
  name TEXT,
  business_name TEXT,
  phone TEXT,
  status USER-DEFINED, -- NEW, CALLING, DONE, FAILED
  transcript JSONB,
  last_called_at TIMESTAMP WITH TIME ZONE,
  processing_order INTEGER,
  recording_url TEXT
);
```

#### `v_campaign_stats` View
```sql
-- Aggregated view providing campaign statistics
SELECT 
  campaign_id,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'DONE') as completed,
  COUNT(*) FILTER (WHERE status = 'FAILED') as failed,
  ROUND(COUNT(*) FILTER (WHERE status = 'DONE') * 100.0 / COUNT(*), 2) as success_pct,
  MAX(last_called_at) as last_activity
FROM contacts 
GROUP BY campaign_id;
```

### Configuration Models

#### `WebhookConfig` Interface
```typescript
interface WebhookConfig {
  chatWebhookUrl: string;      // Chat interface endpoint
  csvUploadWebhookUrl: string; // File upload endpoint
}
```

#### `Contact` Interface
```typescript
interface Contact {
  row_id: string;
  name: string;
  business_name: string;
  phone: string;
  status: 'NEW' | 'CALLING' | 'DONE' | 'FAILED';
  transcript: any;
  last_called_at: string;
  processing_order: number;
  campaign_id: string;
}
```

---

## Integration Points

### External Webhook Integration

#### Request Format (Chat Endpoint)
```json
{
  "chatInput": "John Doe, +1234567890, Acme Corp",
  "sessionId": "uuid-v4-string"
}
```

#### Request Format (CSV Upload Endpoint)
```json
FormData {
  "file": File // CSV file object
}
```

#### Expected Response Format
```json
{
  "message": "Campaign started successfully",
  "campaignId": "optional-campaign-id",
  "status": "success"
}
```

### Real-time Data Synchronization

#### Supabase Realtime Channels
- **Campaign Changes**: `campaigns-changes`
- **Contact Updates**: `contacts-changes`
- **Dashboard Refresh**: `dashboard-changes`

#### Event Subscription Pattern
```typescript
const channel = supabase
  .channel('table-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'contacts'
  }, handleChange)
  .subscribe();
```

---

## Security & Compliance

### Data Protection
- **Client-side Validation**: Input sanitization and format validation
- **CORS Configuration**: Secure cross-origin request handling
- **Webhook Security**: URL validation and error handling
- **Local Storage**: Secure configuration persistence

### Authentication (Ready for Implementation)
- **Supabase Auth**: Built-in authentication system
- **Row Level Security**: Database-level access control
- **Session Management**: Secure user session handling

### Privacy Considerations
- **Contact Data**: Secure handling of personal information
- **Transcript Storage**: Encrypted call recording storage
- **Audit Logging**: Activity tracking and compliance

---

## Performance Requirements

### Frontend Performance
- **Initial Load**: < 3 seconds on 3G connection
- **Chart Rendering**: < 500ms for data visualization
- **Real-time Updates**: < 100ms update propagation
- **Memory Usage**: < 50MB baseline memory footprint

### Backend Performance
- **Database Queries**: < 200ms for standard operations
- **Webhook Response**: < 5 seconds for external calls
- **Real-time Sync**: < 1 second for status updates
- **File Processing**: < 10 seconds for 50-contact CSV

### Scalability Targets
- **Concurrent Users**: 100+ simultaneous users
- **Contact Volume**: 10,000+ contacts per hour
- **Campaign Throughput**: 500+ campaigns per day
- **Data Retention**: 1 year of historical data

---

## Deployment & Infrastructure

### Hosting Platform
- **Frontend**: Lovable.dev platform
- **Database**: Supabase cloud infrastructure
- **CDN**: Global content delivery network
- **Monitoring**: Built-in performance monitoring

### Environment Configuration
- **Production**: Optimized build with minification
- **Development**: Hot reload and debug tools
- **Testing**: Automated testing environment
- **Staging**: Pre-production validation

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui']
        }
      }
    }
  }
});
```

---

## Development Guidelines

### Code Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI components
│   ├── CsvDropZone.tsx # File upload component
│   ├── ChatWidget.tsx  # Floating chat interface
│   └── InlineChat.tsx  # Embedded chat component
├── hooks/              # Custom React hooks
│   ├── useWebhookConfig.ts
│   ├── useDashboardStats.ts
│   ├── useCampaigns.ts
│   └── useContacts.ts
├── pages/              # Application pages
│   ├── Index.tsx       # Landing page
│   ├── Upload.tsx      # Contact upload
│   ├── Dashboard.tsx   # Analytics dashboard
│   └── Campaigns.tsx   # Campaign management
├── integrations/       # External service integrations
│   └── supabase/      # Database configuration
└── lib/               # Utility functions
```

### Component Patterns

#### Custom Hook Pattern
```typescript
export const useDataHook = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await supabase.from('table').select('*');
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
```

#### Component Architecture
```typescript
interface ComponentProps {
  // Explicit prop typing
  onAction: (data: any) => void;
  isLoading: boolean;
}

const Component = ({ onAction, isLoading }: ComponentProps) => {
  // Component implementation
  return <div>Component content</div>;
};
```

### Styling Guidelines
- **Tailwind Utility Classes**: Primary styling approach
- **Custom CSS Variables**: Brand color system
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Using class-variance-authority

### State Management Patterns
- **Local State**: useState for component-specific data
- **Server State**: React Query for API data caching
- **Configuration State**: localStorage with context
- **Real-time State**: Supabase subscriptions

---

## Future Roadmap

### Phase 1: Core Stability (Current)
- ✅ Basic upload functionality
- ✅ Dashboard analytics
- ✅ Real-time monitoring
- ✅ Webhook integration
- 🔄 Bug fixes and optimization

### Phase 2: Enhanced Features
- 📋 User authentication system
- 📋 Advanced filtering and search
- 📋 Export functionality
- 📋 Email notifications
- 📋 Campaign templates

### Phase 3: Enterprise Features
- 📋 Multi-user collaboration
- 📋 Role-based permissions
- 📋 Advanced analytics
- 📋 API rate limiting
- 📋 White-label customization

### Phase 4: AI Enhancement
- 📋 Intelligent contact parsing
- 📋 Predictive analytics
- 📋 Automated optimization
- 📋 Natural language reporting
- 📋 Smart campaign recommendations

---

## Troubleshooting Guide

### Common Issues

#### Webhook Connection Problems
1. Verify webhook URL format and accessibility
2. Check network connectivity and CORS settings
3. Validate request payload format
4. Review webhook endpoint logs

#### Data Synchronization Issues
1. Check Supabase connection status
2. Verify real-time subscription setup
3. Review database permissions
4. Monitor console logs for errors

#### Performance Optimization
1. Implement data pagination for large datasets
2. Use React.memo for expensive components
3. Optimize database queries with indexes
4. Enable browser caching for static assets

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Conclusion

AutoLynx represents a comprehensive solution for outbound calling campaign management, built with modern web technologies and designed for scalability and user experience. The platform's modular architecture, comprehensive feature set, and robust integration capabilities position it as a powerful tool for sales and marketing teams.

The combination of React-based frontend, Supabase backend, and flexible webhook integration provides a solid foundation for current needs while maintaining the flexibility for future enhancements and enterprise-level features.

**Document Version**: 1.0  
**Last Updated**: 2025-01-16  
**Author**: AutoLynx Development Team  
**Review Date**: 2025-02-16
