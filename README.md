# 🚀 AutoLynx AI Caller Portal

A professional cold calling automation system built with React, TypeScript, n8n workflows, VAPI.ai integration, and Supabase database. Features real-time campaign management, AI-powered call analysis, and comprehensive analytics.

## ✨ Features

- **🎯 Campaign Management**: Create and monitor cold calling campaigns
- **📊 Real-time Analytics**: Live dashboard with call metrics and success rates
- **🤖 AI Integration**: VAPI.ai for voice calls with GPT-powered conversations
- **💬 Chat Interface**: AI assistant for contact formatting and campaign setup
- **📈 Advanced Metrics**: Cost tracking, AI success evaluation, and performance analytics
- **🔄 Workflow Automation**: n8n-powered background processing
- **💾 Data Persistence**: Chat history and session management
- **📱 Responsive Design**: Modern UI with professional styling

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Automation**: n8n workflows
- **Voice AI**: VAPI.ai
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- n8n instance (self-hosted or cloud)
- VAPI.ai account

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/auto-lynx-caller-portal.git
cd auto-lynx-caller-portal
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **SQL Editor** and run the following commands:

#### Create Custom Types
```sql
-- Create call status enum
CREATE TYPE call_status AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');
```

#### Create Tables
```sql
-- Create campaigns table
CREATE TABLE campaigns (
  id text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create contacts table
CREATE TABLE contacts (
  row_id text NOT NULL,
  campaign_id text,
  name text,
  business_name text,
  phone text,
  status call_status,
  transcript jsonb,
  last_called_at timestamp with time zone,
  processing_order integer,
  recording_url text,
  cost numeric(10,4),
  ended_reason text,
  success_evaluation boolean
);
```

#### Add Constraints
```sql
-- Add primary keys
ALTER TABLE campaigns ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);
ALTER TABLE contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (row_id);

-- Add foreign key
ALTER TABLE contacts ADD CONSTRAINT contacts_campaign_id_fkey 
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id);
```

#### Create Analytics View
```sql
-- Create campaign statistics view
CREATE VIEW v_campaign_stats AS 
SELECT 
  c.id AS campaign_id,
  count(ct.*) AS total,
  count(CASE WHEN (ct.status = 'DONE'::call_status) THEN 1 ELSE NULL::integer END) AS completed,
  count(CASE WHEN (ct.status = 'FAILED'::call_status) THEN 1 ELSE NULL::integer END) AS failed,
  round((((count(CASE WHEN (ct.status = 'DONE'::call_status) THEN 1 ELSE NULL::integer END))::numeric / 
    (NULLIF(count(ct.*), 0))::numeric) * (100)::numeric), 2) AS success_pct,
  max(ct.last_called_at) AS last_activity,
  sum(ct.cost) AS total_cost,
  count(CASE WHEN (ct.success_evaluation = true) THEN 1 ELSE NULL::integer END) AS ai_successful,
  round((((count(CASE WHEN (ct.success_evaluation = true) THEN 1 ELSE NULL::integer END))::numeric / 
    (NULLIF(count(CASE WHEN (ct.success_evaluation IS NOT NULL) THEN 1 ELSE NULL::integer END), 0))::numeric) * 
    (100)::numeric), 2) AS ai_success_pct,
  avg(ct.cost) AS avg_cost_per_call
FROM (campaigns c LEFT JOIN contacts ct ON ((c.id = ct.campaign_id)))
GROUP BY c.id;
```

### 4. Environment Setup

Create `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# n8n Webhook URLs
VITE_CSV_WEBHOOK_URL=your_n8n_csv_webhook_url
VITE_CHAT_WEBHOOK_URL=your_n8n_chat_webhook_url

# Optional: Custom Configuration
VITE_APP_NAME=AutoLynx AI Caller Portal
```

### 5. n8n Workflow Setup

#### Import Workflows
1. Copy the workflow JSON from `n8n-PROJECT-DOCUMENTATION-FINAL.md`
2. In your n8n instance, go to **Workflows** → **Import from File/URL**
3. Paste the JSON and import both workflows:
   - **CSV Batch Processor**: Handles CSV uploads
   - **Chat Contact Processor**: Handles chat-based contact input

#### Configure Webhook URLs
1. After importing, each workflow will have webhook URLs
2. Copy these URLs to your `.env` file
3. Update the webhook URLs in the app settings

#### Configure VAPI.ai Integration
1. In n8n workflows, update VAPI.ai credentials
2. Set your VAPI.ai API key and assistant configuration
3. Configure voice settings and conversation prompts

### 6. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📋 Usage Guide

### 1. Initial Setup
- Navigate to **Settings** and configure webhook URLs
- Test the connection to ensure n8n workflows are accessible

### 2. Upload Contacts
- **CSV Upload**: Drag and drop CSV files with columns: `name`, `phone`, `business_name`
- **Chat Input**: Use the AI assistant to format and input contacts manually

### 3. Monitor Campaigns
- **Dashboard**: View real-time metrics and campaign performance
- **Campaigns**: Detailed view of each campaign with contact status
- **Campaign Detail**: Individual contact results with call recordings and transcripts

### 4. Analyze Results
- Cost tracking and ROI analysis
- AI success evaluation metrics
- Call completion rates and failure analysis

## 🔧 Configuration

### Webhook Configuration
The app requires two n8n webhook endpoints:

1. **CSV Webhook**: Processes uploaded CSV files
2. **Chat Webhook**: Handles chat-based contact input

Configure these in **Settings** → **Webhook Configuration**

### Database Schema
The system uses three main database objects:

- **campaigns**: Campaign metadata and creation timestamps
- **contacts**: Individual contact records with call results
- **v_campaign_stats**: Aggregated campaign analytics view

### Environment Variables
All configuration is handled through environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_CSV_WEBHOOK_URL`: n8n CSV processing webhook
- `VITE_CHAT_WEBHOOK_URL`: n8n chat processing webhook

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `pnpm build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform

### n8n Deployment
1. Deploy n8n to your preferred platform (Docker, cloud, etc.)
2. Import the workflow JSON files
3. Configure webhook URLs and VAPI.ai credentials
4. Update environment variables with new webhook URLs

### Database (Supabase)
- Supabase handles hosting and scaling automatically
- Ensure Row Level Security (RLS) is configured for production
- Set up proper database backups and monitoring

## 📊 Database Schema Details

### Tables Structure

#### campaigns
- `id` (text, PK): Unique campaign identifier
- `created_at` (timestamptz): Campaign creation timestamp

#### contacts
- `row_id` (text, PK): Unique contact identifier
- `campaign_id` (text, FK): Reference to campaigns table
- `name` (text): Contact name
- `business_name` (text): Company name
- `phone` (text): Phone number in E.164 format
- `status` (call_status): Call status (PENDING, PROCESSING, DONE, FAILED)
- `transcript` (jsonb): Call transcript and metadata
- `last_called_at` (timestamptz): Last call timestamp
- `processing_order` (integer): Order in processing queue
- `recording_url` (text): Call recording URL
- `cost` (numeric): Call cost in dollars
- `ended_reason` (text): Reason call ended
- `success_evaluation` (boolean): AI evaluation of call success

#### v_campaign_stats (View)
Aggregated analytics including:
- Total contacts and completion rates
- Cost metrics and averages
- AI success evaluation percentages
- Campaign activity timestamps

## 🔄 n8n Workflow Details

### CSV Batch Processor
- Validates CSV format and contact data
- Creates campaign and contact records
- Initiates VAPI.ai calls for each contact
- Updates status and results in real-time

### Chat Contact Processor
- Processes natural language contact input
- Formats and validates contact information
- Creates individual contact records
- Provides conversational feedback

### Key Features
- **Parallel Processing**: Handles multiple calls simultaneously
- **Error Handling**: Robust error recovery and logging
- **Cost Tracking**: Automatic cost calculation and storage
- **AI Evaluation**: GPT-powered success evaluation
- **Campaign ID Format**: Consistent `ALX-YYYYMMDD-HHMMSS` format

## 🛡️ Security Considerations

- Environment variables for sensitive configuration
- Supabase Row Level Security for data protection
- Input validation and sanitization
- Secure webhook endpoints with proper authentication
- CORS configuration for production deployment

## 📈 Performance Optimization

- **Frontend**: Vite for fast builds and HMR
- **Database**: Indexed foreign keys and optimized queries
- **Caching**: localStorage for chat persistence
- **Lazy Loading**: Component-based code splitting
- **Analytics**: Efficient view-based aggregations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Issues](https://github.com/yourusername/auto-lynx-caller-portal/issues) page
- Review the n8n workflow documentation
- Consult the Supabase and VAPI.ai documentation

## 🎯 Roadmap

- [ ] Dark mode implementation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced AI conversation flows
- [ ] Integration with CRM systems
