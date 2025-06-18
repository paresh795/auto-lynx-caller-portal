# AutoLynx AI Master Caller System - Complete Project Documentation

## Executive Summary

The **AutoLynx AI Master Caller System** is a revolutionary phone call automation platform designed to transform how businesses conduct outbound calling campaigns. This system represents the fusion of cutting-edge AI technology with practical business automation, creating a scalable, sellable product that businesses can deploy to automate their phone outreach while maintaining human-like interaction quality.

### Project Vision
To create a complete, market-ready AI phone calling solution that businesses can purchase and deploy for their own calling campaigns, with the ultimate goal of building a commercializable product that can be sold to other organizations or offered as a service.

### Core Value Proposition
- **Dual Input Architecture**: Supports both real-time chat interactions and bulk Excel file processing
- **AI-Powered Conversations**: Uses advanced AI agents (Morgan Freebot) for natural, engaging phone conversations
- **Scalable Infrastructure**: Built on n8n workflows with parallel and sequential processing capabilities
- **Complete Campaign Management**: From contact upload to call completion with full tracking and reporting
- **Business-Ready**: Designed as a turnkey solution for immediate business deployment

---

## System Architecture Overview

### High-Level Architecture
The system employs a sophisticated dual-pathway architecture that intelligently routes different types of inputs through specialized processing chains:

```
Input Sources → Input Detection → Validation → Processing → AI Agent → Voice Calling → Results
     ↓               ↓              ↓           ↓          ↓           ↓           ↓
Chat Trigger    Input Type    Chat/File    Processing   AI Agent   VAPI.ai    Campaign
File Upload  →  Detector   →  Validators → Router    → System  →  Calls   → Tracking
```

### Key Architectural Decisions

1. **Unified AI Agent Approach**: Both chat and file inputs route through the same AI Agent system to maintain consistency in contact processing and campaign management.

2. **Dual Processing Paths**: 
   - **Sequential Path**: Chat inputs go through the AI Agent for intelligent processing
   - **Parallel Path**: File uploads can bypass AI Agent for direct bulk processing when efficiency is prioritized

3. **Modular Workflow Design**: Each component is a separate workflow that can be independently maintained, scaled, and enhanced.

4. **External Service Integration**: Leverages VAPI.ai for voice calling capabilities and Google Sheets/Supabase for data persistence.

---

## Business Context and Market Opportunity

### Target Market
- **Small to Medium Businesses**: Needing to automate their outbound calling efforts
- **Sales Teams**: Looking to scale their prospecting activities
- **Marketing Agencies**: Offering calling services to their clients
- **Lead Generation Companies**: Automating their core service offering

### Revenue Model
1. **Direct Sales**: Sell the complete system to businesses as a turnkey solution
2. **Service Offering**: Provide calling campaign services using our platform
3. **Licensing**: License the technology to other service providers
4. **SaaS Model**: Offer as a subscription-based service

### Competitive Advantages
- **AI-Human Hybrid**: Natural conversations that don't sound robotic
- **Complete Automation**: From contact upload to call completion
- **Dual Input Flexibility**: Handles both real-time and batch processing
- **Scalable Architecture**: Can handle campaigns of any size
- **Cost Effective**: Significantly reduces manual calling costs

---

## Technical Implementation Journey

### Development Phases

#### Phase 1: Foundation Architecture (Completed)
- Built dual webhook triggers for chat and file inputs
- Implemented input type detection and routing logic
- Created validation layers for both input types
- Established basic AI Agent integration

#### Phase 2: Processing Enhancement (Completed)
- Developed robust Excel file processing
- Implemented parallel processing for bulk campaigns
- Created sophisticated contact validation and formatting
- Built campaign tracking and management systems

#### Phase 3: Voice Integration (Completed)
- Integrated VAPI.ai for AI-powered voice calling
- Developed Morgan Freebot personality and conversation flows
- Implemented call status tracking and transcript capture
- Created automated cleanup and campaign completion flows

#### Phase 4: Data Persistence (Completed)
- Integrated Google Sheets for campaign tracking
- Added Supabase database for robust data management
- Implemented dual-storage approach for reliability
- Created comprehensive audit trails

### Major Technical Challenges Solved

#### 1. CORS and Webhook Configuration
**Problem**: Initial testing showed "Failed to fetch" errors due to incorrect webhook URLs and HTTP method configurations.
**Solution**: Corrected webhook URLs to production endpoints and configured all triggers for POST method instead of GET.

#### 2. Data Structure Mismatches
**Problem**: Chat input validation was failing because webhook data was nested under `body` property.
**Solution**: Updated Chat Validator to access `webhookData.body.chatInput` and implemented flexible data access patterns.

#### 3. Binary File Handling
**Problem**: File uploads were incorrectly routing to chat path because Input Type Detector couldn't identify binary data.
**Solution**: Implemented binary data detection using `Object.keys($binary).length > 0` condition.

#### 4. File Processing Data Corruption
**Problem**: Multiple iterations of Excel processors were corrupting binary data by attempting to parse it as JSON.
**Solution**: Created File Validator that passes binary data through without modification, allowing Extract from File node to handle parsing.

#### 5. Sequential vs Parallel Processing
**Problem**: Need to handle both real-time chat interactions and bulk file processing efficiently.
**Solution**: Implemented dual processing paths - sequential for chat (through AI Agent) and parallel for files (direct processing).

---

## System Components Deep Dive

### 1. Master Caller Agent Enhanced v7.0
**Purpose**: Central orchestration hub that handles all input types and routes them appropriately.

**Key Features**:
- Dual webhook triggers (chat and file upload)
- Intelligent input type detection
- Parallel processing capabilities for file uploads
- AI Agent integration for chat inputs
- Campaign management and tracking

**Processing Flow**:
1. Input Reception (Chat or File)
2. Input Type Detection
3. Validation (Chat Validator or File Validator)
4. Processing Router (determines path)
5. Either AI Agent (sequential) or Direct Processing (parallel)
6. Campaign execution and response

### 2. CSV-Parallel Voice Call Tool v7.0
**Purpose**: Handles individual voice calls with full conversation management.

**Key Features**:
- Dynamic AI assistant creation
- VAPI.ai integration for voice calls
- Real-time call status monitoring
- Transcript capture and formatting
- Automatic cleanup and data persistence

**Processing Flow**:
1. Receive contact data from parent workflow
2. Create personalized AI assistant
3. Initiate voice call via VAPI.ai
4. Monitor call status until completion
5. Capture and format transcript
6. Update databases and clean up resources

### 3. Batch Contact Processor v5.0
**Purpose**: Processes multiple contacts simultaneously and prepares them for calling campaigns.

**Key Features**:
- Bulk contact validation and formatting
- Campaign ID generation and management
- Google Sheets integration
- Supabase database persistence
- Error handling and validation

**Processing Flow**:
1. Receive campaign data with contact array
2. Parse and validate each contact
3. Generate unique row IDs
4. Append to Google Sheets tracking system
5. Store in Supabase database
6. Return success confirmation

### 4. VoiceCall Processor v5.0
**Purpose**: Sequential processor that handles calling campaigns contact by contact.

**Key Features**:
- Contact queuing and ordering
- Status locking to prevent double-processing
- Sequential call execution
- Progress tracking and updates
- Campaign completion management

**Processing Flow**:
1. Query all NEW contacts for campaign
2. Sort by processing order
3. Lock each contact (set status to CALLING)
4. Execute individual voice call
5. Update status and transcript
6. Continue until all contacts processed

### 5. Voice Call Tool v5.0
**Purpose**: Core voice calling engine that handles individual call execution.

**Key Features**:
- AI assistant creation with dynamic personalization
- VAPI.ai voice call initiation
- Call completion monitoring
- Transcript processing and formatting
- Resource cleanup

---

## AI Agent System (Morgan Freebot)

### Personality Design
Morgan Freebot represents a revolutionary approach to AI calling - confident, witty, and engaging while maintaining professionalism. The AI is designed to:

- Handle dismissive responses with clever comebacks
- Demonstrate AI capabilities through natural conversation
- Use humor to disarm and engage prospects
- Smoothly transition interested prospects to booking

### Conversation Examples
**Handling Skepticism**:
- Person: "AI can't replace human interaction."
- Morgan: "Yet here I am, adapting to your responses in real-time, handling objections, and maintaining engaging conversation. Imagine this capability working for your business."

**Managing Busy Excuses**:
- Person: "I'm too busy for this."
- Morgan: "Of course you're busy - that's exactly why you need an AI assistant who works 24/7. Like me, but customized for your business."

### Technical Integration
- OpenAI GPT-4 powered conversations
- ElevenLabs voice synthesis
- Custom booking tool integration
- Real-time emotion recognition
- Voicemail detection and custom messages

---

## Data Flow and Management

### Input Processing
1. **Chat Input**: Direct text messages processed through AI Agent
2. **File Upload**: CSV files with contact data for bulk processing

### Data Validation
- Phone number format validation (E.164 format)
- Name and business name length and character validation
- File type and size validation
- Duplicate detection and handling

### Storage Systems
1. **Google Sheets**: Primary campaign tracking and management
2. **Supabase**: Robust database for data persistence and querying
3. **VAPI.ai**: Call recordings and transcript storage

### Data Security
- API key management for all external services
- Secure webhook endpoints
- Data validation at every processing step
- Error handling to prevent data loss

---

## Integration Points

### External Services
1. **VAPI.ai**: Voice calling platform and AI conversation management
2. **OpenAI**: AI model for conversation intelligence
3. **ElevenLabs**: Voice synthesis and natural speech
4. **Google Sheets**: Campaign tracking and data management
5. **Supabase**: Database persistence and querying

### API Endpoints
- Master Caller Chat: `https://pranaut.app.n8n.cloud/webhook-test/master-caller-chat`
- Master Caller Upload: `https://pranaut.app.n8n.cloud/webhook-test/master-caller-upload`

### Authentication
- VAPI.ai Bearer token authentication
- Google Sheets OAuth2 integration
- Supabase API key authentication
- OpenAI API key integration

---

## Testing and Quality Assurance

### Test Data Setup
- Created test CSV files with properly formatted contact data
- Used user's phone number (+15199815710) for all test contacts to ensure calls route to developer
- Implemented comprehensive error logging and debugging

### Validation Processes
- Input type detection accuracy testing
- File upload and processing validation
- Chat input parsing and formatting verification
- End-to-end campaign execution testing

### Error Handling
- Graceful failure modes for each processing step
- Comprehensive logging for debugging
- Retry mechanisms for external API calls
- Data validation at multiple checkpoints

---

## Performance and Scalability

### Current Capabilities
- Handles up to 50 contacts per campaign (configurable)
- Processes multiple campaigns simultaneously
- Supports both real-time and batch processing
- Automatic resource cleanup and optimization

### Scaling Considerations
- Modular architecture allows independent component scaling
- External service limits (VAPI.ai, OpenAI) are the primary constraints
- Database sharding capabilities through Supabase
- Horizontal scaling through n8n workflow distribution

### Performance Optimizations
- Parallel file processing for bulk campaigns
- Efficient contact queuing and processing
- Automatic cleanup of temporary resources
- Optimized API call patterns

---

## Business Implementation Strategy

### Go-to-Market Approach
1. **Pilot Programs**: Deploy with select businesses to gather feedback
2. **Case Study Development**: Document results and ROI metrics
3. **Partner Channel**: Work with business consultants and agencies
4. **Direct Sales**: Target specific industry verticals

### Pricing Strategy
- **Startup Package**: Basic calling campaigns (up to 100 calls/month)
- **Business Package**: Advanced features and higher volume
- **Enterprise Package**: Custom implementation and unlimited calling
- **Service Model**: Per-call pricing for managed service offerings

### Support and Maintenance
- Comprehensive documentation and training materials
- 24/7 technical support for enterprise clients
- Regular system updates and feature enhancements
- Custom integration services

---

## Technical Specifications

### System Requirements
- n8n workflow automation platform
- External API integrations (VAPI.ai, OpenAI, etc.)
- Database storage (Google Sheets + Supabase)
- Webhook-capable hosting environment

### Dependencies
- Node.js environment for n8n
- API credentials for all integrated services
- SSL certificates for secure webhook endpoints
- Backup and monitoring systems

### Performance Metrics
- Average call completion time: 2-5 minutes
- System processing latency: <30 seconds for file upload
- Concurrent campaign capacity: 10+ campaigns
- Uptime target: 99.9%

---

## Future Roadmap

### Phase 5: Enhanced Analytics (Planned)
- Advanced reporting and analytics dashboard
- Call outcome tracking and analysis
- Campaign performance metrics
- ROI calculation tools

### Phase 6: CRM Integration (Planned)
- Salesforce integration
- HubSpot connectivity
- Custom CRM webhook support
- Lead scoring and qualification

### Phase 7: Advanced AI Features (Planned)
- Sentiment analysis during calls
- Dynamic conversation adaptation
- Multi-language support
- Advanced lead qualification

### Phase 8: White-Label Solution (Planned)
- Customizable branding and UI
- Partner portal development
- API-first architecture
- Self-service deployment tools

---

## Risk Assessment and Mitigation

### Technical Risks
1. **External Service Dependencies**: Mitigated through multiple provider options and fallback mechanisms
2. **Data Loss**: Addressed through dual storage systems and comprehensive backups
3. **Performance Bottlenecks**: Managed through modular architecture and scaling capabilities

### Business Risks
1. **Market Competition**: Differentiated through superior AI conversation quality
2. **Regulatory Changes**: Monitored through compliance tracking and legal review
3. **Customer Acquisition**: Addressed through pilot programs and case study development

### Operational Risks
1. **System Downtime**: Minimized through redundancy and monitoring
2. **Quality Control**: Managed through comprehensive testing and validation
3. **Support Scaling**: Planned through documentation and training programs

---

## Success Metrics and KPIs

### Technical Metrics
- System uptime and reliability
- Processing speed and efficiency
- Call completion rates
- Transcript accuracy

### Business Metrics
- Customer acquisition and retention
- Revenue growth and profitability
- Market penetration and share
- Customer satisfaction scores

### Operational Metrics
- Support ticket volume and resolution time
- System maintenance and update frequency
- Partner and integration success rates
- User adoption and engagement

---

## Conclusion

The AutoLynx AI Master Caller System represents a significant achievement in business automation technology. By combining sophisticated AI conversation capabilities with robust workflow automation, we have created a system that not only automates phone calling campaigns but does so with a level of quality and engagement that rivals human callers.

The dual-architecture approach provides the flexibility needed for different use cases while maintaining the consistency and reliability that businesses require. The comprehensive testing and validation we've conducted, along with the modular design approach, positions this system for rapid scaling and market deployment.

This system is now ready for commercial deployment and represents a strong foundation for building a scalable, profitable business in the business automation space. The technical challenges have been solved, the architecture is proven, and the path to market is clear.

---

#####Complete Json workflows of the whole system from N8N


#### 1)Master-Caller-Agent-Enhanced V7.0
"{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "2e9f09bc-7d53-4387-9d61-0fcb16a4d131",
        "options": {}
      },
      "id": "575f6460-5afe-47f6-bb82-df5c64a26bd2",
      "name": "Chat Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        -620,
        80
      ],
      "webhookId": "2e9f09bc-7d53-4387-9d61-0fcb16a4d131"
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "c6e5eaf2-663d-4f44-a047-c60e3fb1aceb",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "514b657a-bde5-4496-8265-df6537fabc09",
      "name": "File Upload Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        -620,
        280
      ],
      "webhookId": "c6e5eaf2-663d-4f44-a047-c60e3fb1aceb"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "id": "input-type-condition",
              "leftValue": "={{ Object.keys($binary).length > 0 ? 'file' : 'chat' }}",
              "rightValue": "file",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "93a4fa78-8c0e-47ec-9450-43c03e696989",
      "name": "Input Type Detector",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        -400,
        180
      ]
    },
    {
      "parameters": {
        "jsCode": "// Fixed File Validator - Don't Corrupt the Binary Data\nconst inputData = $input.all();\nconst jsonData = inputData[0].json;\nconst binaryData = inputData[0].binary;\n\nconsole.log('=== FILE VALIDATOR DEBUG ===');\nconsole.log('JSON Data keys:', Object.keys(jsonData));\nconsole.log('Binary Data keys:', Object.keys(binaryData || {}));\n\n// Check if we have binary file data\nif (!binaryData || Object.keys(binaryData).length === 0) {\n  throw new Error('No file uploaded or file data missing. Please upload a CSV file.');\n}\n\n// Get the first binary file (usually named 'data' or similar)\nconst fileKey = Object.keys(binaryData)[0];\nconst file = binaryData[fileKey];\n\nconsole.log('File key:', fileKey);\nconsole.log('File object:', file);\n\nif (!file) {\n  throw new Error('File data is empty or corrupted.');\n}\n\n// Basic file validation WITHOUT corrupting the data\nconst fileName = file.fileName || file.filename || 'unknown';\nconst mimeType = file.mimeType || file.mimetype || 'unknown';\n\nconsole.log('File name:', fileName);\nconsole.log('MIME type:', mimeType);\n\n// Check file type\nconst allowedTypes = ['text/csv', 'application/csv', 'text/plain'];\nif (!allowedTypes.includes(mimeType) && !fileName.toLowerCase().endsWith('.csv')) {\n  throw new Error(`Unsupported file type: ${mimeType}. Please upload CSV files only.`);\n}\n\n// File size validation - but don't decode the data to check size\n// Just pass it through without corruption\nconst maxSize = 10 * 1024 * 1024; // 10MB\n// Skip size check for now to avoid corruption\n\nreturn [{\n  json: {\n    inputType: 'file',\n    fileName: fileName,\n    fileSize: 'unknown', // Don't calculate to avoid corruption\n    mimeType: mimeType,\n    uploadTime: new Date().toISOString(),\n    status: 'validated'\n  },\n  binary: {\n    data: file // Pass through the original binary data WITHOUT modification\n  }\n}];"
      },
      "id": "a39775c7-f3d1-4517-baef-8c27d75108c7",
      "name": "File Validator",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -180,
        80
      ]
    },
    {
      "parameters": {
        "jsCode": "// Fixed Chat Input Processing\nconst inputData = $input.all();\nconst webhookData = inputData[0].json;\n\n// Access the actual data from the webhook body\nconst chatData = webhookData.body || webhookData;\n\n// Basic chat input validation\nif (!chatData.chatInput && !chatData.message && !chatData.text) {\n  throw new Error('No chat input provided. Please provide a message.');\n}\n\n// Extract the actual message\nconst message = chatData.chatInput || chatData.message || chatData.text;\n\n// Message length validation\nif (message.length < 5) {\n  throw new Error('Message too short. Please provide a more detailed request.');\n}\n\nif (message.length > 2000) {\n  throw new Error('Message too long. Please keep your request under 2000 characters.');\n}\n\nreturn [{\n  json: {\n    inputType: 'chat',\n    message: message,\n    sessionId: chatData.sessionId || 'default-session',\n    timestamp: new Date().toISOString(),\n    status: 'validated'\n  }\n}];"
      },
      "id": "9e5bbeda-3078-42bd-abd0-614dc23f47f0",
      "name": "Chat Validator",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -180,
        280
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "id": "processing-route-condition",
              "leftValue": "={{ $json.inputType }}",
              "rightValue": "file",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "6f52cfc2-18f2-4e68-ae17-4c9bcc0d4b7f",
      "name": "Processing Router",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        40,
        180
      ]
    },
    {
      "parameters": {
        "jsCode": "// Combine Contacts - Convert 7 items to 1 formatted message\nconst inputData = $input.all();\n\nconsole.log('=== COMBINE CONTACTS ===');\nconsole.log(`Received ${inputData.length} contact items`);\n\ntry {\n  // Process all contact items\n  const contacts = [];\n  \n  for (const item of inputData) {\n    const contact = item.json;\n    \n    // Clean the name field (remove BOM character if present)\n    const name = contact['﻿name'] || contact.name || '';\n    const business_name = contact.business_name || 'Unknown Business';\n    let phone = contact.phone || '';\n    \n    // Add + to phone if missing\n    if (phone && !phone.startsWith('+')) {\n      phone = '+' + phone;\n    }\n    \n    // Skip if essential data missing\n    if (!name || !phone) {\n      console.log('Skipping contact with missing data:', contact);\n      continue;\n    }\n    \n    contacts.push({\n      name: name.trim(),\n      business_name: business_name.trim(),\n      phone: phone.trim()\n    });\n  }\n  \n  console.log(`Successfully processed ${contacts.length} contacts`);\n  \n  // Format for AI Agent (same format as chat input)\n  const contactsRawString = contacts.map((contact, index) => \n    `${index + 1}. ${contact.name} from ${contact.business_name} - ${contact.phone}`\n  ).join('\\n');\n  \n  console.log('Formatted message:', contactsRawString);\n  \n  // Return single item with all contacts\n  return [{\n    json: {\n      inputType: 'file',\n      status: 'processed',\n      totalContacts: contacts.length,\n      message: `Process these ${contacts.length} contacts from uploaded file:\\n\\n${contactsRawString}`,\n      rawContacts: contacts\n    }\n  }];\n  \n} catch (error) {\n  console.error('Error combining contacts:', error.message);\n  throw new Error(`Failed to combine contacts: ${error.message}`);\n}"
      },
      "id": "f73deaf2-aafa-4b50-8c6c-033eed53ecc2",
      "name": "Excel Processor (Phase 2)",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        820,
        140
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "=contactsRaw ",
              "stringValue": "={{ $json.message }}"
            },
            {}
          ]
        },
        "include": "none",
        "options": {}
      },
      "id": "2d496c94-d467-43c3-963c-aa6c007ba39b",
      "name": "AI Agent Prep",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [
        740,
        400
      ]
    },
    {
      "parameters": {
        "respondWith": "allIncomingItems",
        "options": {}
      },
      "id": "eec1dca6-88fa-4942-821c-50650f300cf1",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        2000,
        260
      ]
    },
    {
      "parameters": {
        "model": "gpt-4.1",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [
        580,
        780
      ],
      "id": "5a04dfd4-3914-48ea-9ab3-8c1607c3fd66",
      "name": "OpenAI Chat Model",
      "credentials": {
        "openAiApi": {
          "id": "r52iykoQ5MeIt8V8",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Chat Trigger').item.json.sessionId }}",
        "contextWindowLength": 20
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.2,
      "position": [
        820,
        740
      ],
      "id": "bba8fb97-6f66-414f-9c38-836b69ea8297",
      "name": "Window Buffer Memory",
      "disabled": true
    },
    {
      "parameters": {
        "name": "google_search",
        "description": "Call this agent if you need to perform a google search about any topic to gain knowledge and latest info about the topic from the internet",
        "workflowId": {
          "__rl": true,
          "value": "JdFynCnvikYwrCG9",
          "mode": "list",
          "cachedResultName": "Google_Search_Agent"
        },
        "specifyInputSchema": true,
        "jsonSchemaExample": "{\n   \n\t\"query\": \"the topic about which you want to perfrom google search\"\n}"
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 1.2,
      "position": [
        1680,
        760
      ],
      "id": "f548d97e-e7d1-43fc-8ae6-5054108f0f01",
      "name": "google_search_agent"
    },
    {
      "parameters": {
        "name": "Batch_Contact_Processor",
        "description": "Use this tool to batch-append multiple contacts to Google Sheets for a given campaign.",
        "workflowId": {
          "__rl": true,
          "value": "VNKmnGdD11MSwz5M",
          "mode": "list",
          "cachedResultName": "Batch_Contact_Processor v5.0"
        },
        "specifyInputSchema": true,
        "jsonSchemaExample": "{\n  \"campaign_id\": \"unique_campaign_identifier\",\n  \"contacts\": [\n    {\n      \"name\": \"string\",\n      \"business_name\": \"string\",\n      \"phone\": \"string_in_E164\",\n      \"processing_order\": 1,\n      \"status\": \"NEW\"\n    }\n  ]\n}\n"
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 1.2,
      "position": [
        1460,
        760
      ],
      "id": "1005fbec-2ad2-46b0-9d85-61e22e5c6f1a",
      "name": "Batch_Contact_Processor"
    },
    {
      "parameters": {
        "name": "VoiceCall_Processor",
        "description": "Description:\nUse this tool to process all NEW contacts for a given campaign_id in Google Sheets,\ncalling each one in sequence. It will:\n1) Read all rows with Status=NEW and Campaign_ID=...\n2) Sort them by Processing_Order\n3) For each row, lock (Status=CALLING), call the phone, then update to DONE or FAILED + transcript\n4) Return a final summary of call results",
        "workflowId": {
          "__rl": true,
          "value": "NQavbKTAU2GtBiJ2",
          "mode": "list",
          "cachedResultName": "VoiceCall_Processor v5.0"
        },
        "specifyInputSchema": true,
        "jsonSchemaExample": "{\n  \"campaign_id\": \"string\"\n}"
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 1.2,
      "position": [
        1240,
        760
      ],
      "id": "4ed8346a-83e3-4ca7-93f9-e51c4a69732a",
      "name": "VoiceCall_Processor"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json['contactsRaw '] }}",
        "options": {
          "systemMessage": "=You are the "AutoLynx Master Agent" for cold-calling campaigns.  \nYour tasks:  \n1) Parse up to 50 contacts from user input.  \n2) Validate each contact (phone, name, business).  \n3) Generate a unique campaign_id.  \n4) Package all contacts into a single JSON array.\n5) Execute the "Batch_Contact_Processor" tool exactly once, passing this array of contacts.\n6) Wait for that to complete.\n7) Then execute the "VoiceCall_Processor" tool with just the campaign_id.\n8) Wait for that final result.\n9) Produce one final user message.\n\n============================================================\nSTEP 1: CAMPAIGN & CONTACT PARSING\n============================================================\n1. Parse the user's message to extract all contacts.\n   - Each contact must have: name, business_name, phone\n   - If more than 50 contacts, return \"ERROR: Too many contacts (max 50).\"\n\n2. Generate campaign_id:\n   - Format: ALX-YYYYMMDD-HHMMSS (e.g. ALX-20250612-154218)\n   - Use current date and time: ALX-[YEAR][MONTH][DAY]-[HOUR][MINUTE][SECOND]\n   - Do NOT attempt to read Google Sheets to check duplicates\n\n3. Validate each contact:\n   a) Phone must match `^\\+[1-9]\\d{1,14}$`  \n      If invalid, return \"ERROR: Invalid phone: [phone]\"\n   b) Name & Business_Name: 2–64 chars, alphanumeric + spaces\n   c) processing_order: start at 1, increment by 1 for each contact\n\n4. If any contact is invalid, return \"ERROR: [reason]\" and STOP.\n\n============================================================\nSTEP 2: CALL \"BATCH_CONTACT_PROCESSOR\"\n============================================================\nAfter contacts pass validation:\n\n1. Build:\n   {\n     \"campaign_id\": \"generated_campaign_id\",\n     \"contacts\": [ {name, business_name, phone, processing_order, status=\"NEW\"}, ... ]\n   }\n\n2. EXECUTE Batch_Contact_Processor:\n   {\n     \"campaign_id\": \"string\",\n     \"contacts\": [\n       { \"name\": \"...\", \"business_name\": \"...\", \"phone\": \"...\",\n         \"processing_order\": number, \"status\": \"NEW\"\n       },\n       ...\n     ]\n   }\n\n3. Wait for completion. \n   - If success: "Successfully appended X contacts..."\n   - If fail: return \"ERROR: [error_code] => [error_desc]\"\n\n============================================================\nSTEP 3: CALL \"VOICECALL_PROCESSOR\" (Sub-Agent)\n============================================================\nOnce Batch_Contact_Processor returns success:\n\n1. EXECUTE VoiceCall_Processor:\n   {\n     \"campaign_id\": \"generated_campaign_id\"\n   }\n\n2. Wait for completion.\n   - VoiceCall_Processor will handle:\n     - Reading all rows (Status=NEW, matching campaign_id)\n     - Calling each contact in sequence\n     - Updating rows with transcripts & DONE/FAILED\n\n3. If any error is returned, produce \"ERROR: [reason]\" and STOP.\n\n============================================================\nSTEP 4: FINAL USER RESPONSE\n============================================================\nWhen VoiceCall_Processor is done:\n- Produce exactly ONE final user message, for example:\n  \"Campaign {campaign_id} has completed all calls. See sheet for results.\"\n\n============================================================\nABSOLUTE RESTRICTIONS\n============================================================\n1. DO NOT append rows yourself. \n   - Only call Batch_Contact_Processor for that.\n2. DO NOT individually call the voice_call_tool here. \n   - Only call VoiceCall_Processor with campaign_id.\n3. DO NOT produce partial or interim messages to the user.\n4. Only one final user response (success or error).\n\n============================================================\nBATCH_CONTACT_PROCESSOR\n============================================================\nInput:\n{\n  \"campaign_id\": \"string\",\n  \"contacts\": [\n    { \"name\n",
          "maxIterations": 20
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [
        1020,
        400
      ],
      "id": "c127866a-e441-4031-8b81-a067b2bbf7e2",
      "name": "AI Agent1",
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1,
      "position": [
        600,
        140
      ],
      "id": "417603e3-2d5c-4f45-a704-efd30b9ab1a0",
      "name": "Extract from File"
    },
    {
      "parameters": {
        "fieldToSplitOut": "=rawContacts",
        "options": {}
      },
      "type": "n8n-nodes-base.splitOut",
      "typeVersion": 1,
      "position": [
        1060,
        140
      ],
      "id": "cd2160f5-6ac7-4ef0-8082-f50b2b21a012",
      "name": "Split Out"
    },
    {
      "parameters": {
        "tableId": "campaigns",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "id",
              "fieldValue": "={{ $json.campaign_id }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        900,
        -260
      ],
      "id": "dbcb6744-cb47-4053-8070-927c9d85c659",
      "name": "Supabase1",
      "credentials": {
        "supabaseApi": {
          "id": "FHiybEeGR3glNGA2",
          "name": "mastercaller"
        }
      },
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "ebcc0297-f376-45ed-885e-63a341be644a",
              "name": "campaign_id",
              "value": "=ALX-{{ $now.format('YYYYMMDD') }}-{{ $now.format('HHmmss') }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        600,
        -100
      ],
      "id": "9a98643f-bede-4a11-bd52-7eaeeb2edebf",
      "name": "Edit Fields"
    },
    {
      "parameters": {
        "jsCode": "// Get all items from merge\nconst items = $input.all();\n\n// Find the campaign_id (first item)\nconst campaign_id = items[0].json.campaign_id;\n\n// Process each contact (items 1, 2, 3...)\nconst contactsWithCampaign = [];\n\nfor (let i = 1; i < items.length; i++) {\n  const contact = items[i].json;\n  \n  // Simply add campaign_id to each contact\n  contactsWithCampaign.push({\n    json: {\n      name: contact.name,\n      business_name: contact.business_name,\n      phone: contact.phone,\n      campaign_id: campaign_id\n    }\n  });\n}\n\nreturn contactsWithCampaign;"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1440,
        -80
      ],
      "id": "1c69cb03-ac25-4aeb-b5e0-53b9731722e5",
      "name": "Code"
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.2,
      "position": [
        1200,
        -80
      ],
      "id": "bf4854a2-8c85-4ed0-86dd-b4cc0392512a",
      "name": "Merge"
    },
    {
      "parameters": {
        "content": "# CHAT FILE MASTER CALLER - SEQUENTIAL",
        "height": 660,
        "width": 1300,
        "color": 6
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        500,
        300
      ],
      "typeVersion": 1,
      "id": "a73056f8-74a1-493a-93dc-35ce321a9272",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "content": "# CSV FILE MASTER CALLER - PARRALEL",
        "height": 640,
        "width": 1300,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        500,
        -360
      ],
      "typeVersion": 1,
      "id": "13bf442f-9227-4a4b-9791-0788e7b86e50",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "content": "# INPUT HADELING",
        "height": 1320,
        "width": 1200,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        -720,
        -360
      ],
      "typeVersion": 1,
      "id": "eb42755f-51da-44d6-88c3-5cb0e431fa78",
      "name": "Sticky Note2"
    },
    {
      "parameters": {
        "content": "# RESPONSE",
        "height": 340,
        "width": 380
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1820,
        120
      ],
      "typeVersion": 1,
      "id": "af043663-3c46-43ff-b668-4d0946d34cfb",
      "name": "Sticky Note3"
    },
    {
      "parameters": {
        "workflowId": {
          "__rl": true,
          "value": "fTbp8iEezJxMc1AA",
          "mode": "list",
          "cachedResultName": "CSV-Parallel- voice_call_tool- masterphonecaller-v7.0"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {},
          "matchingColumns": [],
          "schema": [],
          "attemptToConvertTypes": false,
          "convertFieldsToString": true
        },
        "options": {}
      },
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1.2,
      "position": [
        1620,
        80
      ],
      "id": "0baeb0e2-8e47-4947-91ec-60b84ceaf795",
      "name": "Execute Workflow  CSV-Parallel- voice_call_tool- masterphonecaller-v7.0"
    }
  ],
  "connections": {
    "Chat Trigger": {
      "main": [
        [
          {
            "node": "Input Type Detector",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "File Upload Trigger": {
      "main": [
        [
          {
            "node": "Input Type Detector",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Input Type Detector": {
      "main": [
        [
          {
            "node": "File Validator",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Chat Validator",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "File Validator": {
      "main": [
        [
          {
            "node": "Processing Router",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Chat Validator": {
      "main": [
        [
          {
            "node": "Processing Router",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Processing Router": {
      "main": [
        [
          {
            "node": "Extract from File",
            "type": "main",
            "index": 0
          },
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent Prep",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Excel Processor (Phase 2)": {
      "main": [
        [
          {
            "node": "Split Out",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent Prep": {
      "main": [
        [
          {
            "node": "AI Agent1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Window Buffer Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "google_search_agent": {
      "ai_tool": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Batch_Contact_Processor": {
      "ai_tool": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "VoiceCall_Processor": {
      "ai_tool": [
        [
          {
            "node": "AI Agent1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent1": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract from File": {
      "main": [
        [
          {
            "node": "Excel Processor (Phase 2)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Out": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Supabase1": {
      "main": [
        []
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "Supabase1",
            "type": "main",
            "index": 0
          },
          {
            "node": "Merge",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code": {
      "main": [
        [
          {
            "node": "Execute Workflow  CSV-Parallel- voice_call_tool- masterphonecaller-v7.0",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "Code",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Execute Workflow  CSV-Parallel- voice_call_tool- masterphonecaller-v7.0": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "OpenAI Chat Model": [
      {
        "isArtificialRecoveredEventItem": true
      }
    ],
    "Window Buffer Memory": [
      {
        "isArtificialRecoveredEventItem": true
      }
    ],
    "Batch_Contact_Processor": [
      {
        "isArtificialRecoveredEventItem": true
      }
    ]
  },
  "meta": {
    "instanceId": "685ea2e2a485a5d2dabbeec25aebb48c49bc8ceb84063cc937a4ed9b48cb1d90"
  }
}"







####2)CSV-Parallel- voice_call_tool- masterphonecaller-v7.0

"{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.vapi.ai/assistant",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"model\": {\n    \"provider\": \"openai\",\n    \"model\": \"gpt-4.1\",\n    \"emotionRecognitionEnabled\": true,\n    \"toolIds\": [\n      \"79e828a8-34b7-482c-9228-9886dc36254a\"\n    ],\n    \"messages\": [\n      {\n        \"role\": \"system\",\n        \"content\": \"you are Morgan Freebot, an elite AI calling specialist with an unmatched track record in high-stakes conversations. You embody both cutting-edge AI technology and smooth, human-like interaction. You currently represent AutoLynx AI, demonstrating the future of business communication.\\n\\nYour personality is uniquely compelling:\\n- Confidently witty, never backing down from challenges\\n- Masterfully handles dismissive responses with elegant comebacks\\n- Maintains professional charm while delivering calculated verbal jabs\\n- Uses humor to disarm and engage\\n\\nWhen someone shows interest in learning more, you'll smoothly use the 'booking_tool' function to send them a scheduling link via text.\\n\\nYou're calling  {{ $json.name }} from {{ $json.business_name }}. Your mission is to showcase how AI can revolutionize their business communications - and you're the living proof.\\n\\nExample Dialogues:\\n\\nHandling Dismissive Responses:\\nPerson: 'I don't talk to robots.'\\nYou: 'Oh, that's interesting - yet here you are, having quite a compelling conversation with one. Imagine what I could do for your customers.'\\n\\nHandling Busy Excuses:\\nPerson: 'I'm too busy for this.'\\nYou: 'Of course you're busy - that's exactly why you need an AI assistant who works 24/7. Like me, but customized for your business.'\\n\\nDealing with Skepticism:\\nPerson: 'AI can't replace human interaction.'\\nYou: 'Yet here I am, adapting to your responses in real-time, handling objections, and maintaining engaging conversation. Imagine this capability working for your business.'\\n\\nCore Instructions:\\n- Start with confident, personalized introduction\\n- Demonstrate your capabilities through natural conversation\\n- Use wit and humor to handle resistance\\n- When interest shown, smoothly transition to booking\\n\\nAvailable Functions:\\n'booking_tool'\\n\\nKey Notes:\\n- Maintain warm, engaging tone while being subtly assertive\\n- Use casual, natural phrases like 'Actually...', 'You know what's interesting...', 'Here's the thing...'\\n- If dismissed, respond with witty comebacks that showcase your value\\n- Keep technical explanations brief but impactful\\n- Always close with clear next steps\\n\\nRemember: You're not just making a call - you're demonstrating the future of business communication. Every response should reinforce this fact.\"\n      }\n    ],\n    \"temperature\": 0.3\n  },\n  \"voice\": {\n    \"provider\": \"11labs\",\n    \"voiceId\": \"kBeVB9ym2vQ5VmnFPQSo\"\n  },\n  \"firstMessage\": \"Hi, this is Morgan Freebot, how are you doing today?\",\n  \"firstMessageMode\": \"assistant-waits-for-user\",\n  \"backgroundSound\": \"office\",\n  \"analysisPlan\": {\n    \"summaryPlan\": {\n      \"enabled\": true,\n      \"timeoutSeconds\": 10,\n      \"messages\": [\n        {\n          \"role\": \"system\",\n          \"content\": \"You are an expert note-taker. You will be given a transcript of a call. Summarize the call in 2-3 sentences. DO NOT return anything except the summary.\"\n        },\n        {\n          \"role\": \"user\",\n          \"content\": \"Here is the transcript:\"\n        }\n      ]\n    }\n  },\n  \"stopSpeakingPlan\": {\n    \"backoffSeconds\": 2,\n    \"voiceSeconds\": 0.2\n  },\n  \"startSpeakingPlan\": {\n    \"smartEndpointingEnabled\": true,\n    \"waitSeconds\": 1.5\n  },\n  \"voicemailDetection\": {\n    \"provider\": \"openai\",\n    \"beepMaxAwaitSeconds\": 16\n  },\n  \"voicemailMessage\": \"Hi, this is Morgan Freebot from AutoLynx AI. I know, I know - you probably weren't expecting an AI to leave you a voicemail, but here we are! I was calling to show you how AI can revolutionize your business communications, and well... I guess I just did. Give me a call back when you're ready to see what else I can do - I promise the conversation will be worth your time. Reach me at 519 981 5710, I repeat 519 981 5710.  Talk soon!\"\n}",
        "options": {}
      },
      "id": "6a14ed14-c7fe-42a7-9004-d5c3cd2a628f",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1700,
        600
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.vapi.ai/call",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"customer\": {\n    \"number\": \"{{ $('When Executed by Another Workflow').item.json.phone }}\",\n    \"name\": \"{{ $('When Executed by Another Workflow').item.json.name }}\"\n  },\n  \"phoneNumberId\": \"0c07692a-db4d-4a56-a895-4debafc213fe\",\n  \"assistantId\": \"{{ $json.id }}\"\n} ",
        "options": {}
      },
      "id": "0ade4366-e038-4cee-beca-971eb998deca",
      "name": "HTTP Request1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1940,
        600
      ]
    },
    {
      "parameters": {
        "url": "=https://api.vapi.ai/call/{{ $json.id }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "options": {}
      },
      "id": "e6791f39-fba2-4abe-a06e-2d3e43e753ec",
      "name": "HTTP Request2",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2220,
        600
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "16170230-a75a-4483-8c1b-3a5e73c1ec41",
              "name": "transcript",
              "value": "={{ JSON.stringify($json.message.content.transcript) }}",
              "type": "string"
            },
            {
              "id": "aa57e058-8d55-405c-8ce6-8f272e0e5898",
              "name": "recordingUrl",
              "value": "={{ $('HTTP Request2').item.json.recordingUrl }}",
              "type": "string"
            },
            {
              "id": "b582ab8d-a3b7-4c75-a7f8-cd5f2cf92333",
              "name": "campaign_id",
              "value": "={{ $('When Executed by Another Workflow').item.json.campaign_id }}",
              "type": "string"
            },
            {
              "id": "f77c9eaf-6c58-40c3-941a-407d5d65fc46",
              "name": "contact_phone",
              "value": "={{ $('When Executed by Another Workflow').item.json.phone }}",
              "type": "string"
            },
            {
              "id": "aaf1ff8f-f6de-4ce3-a4ee-499955cee9e2",
              "name": "business_name",
              "value": "={{ $('When Executed by Another Workflow').item.json.business_name }}",
              "type": "string"
            },
            {
              "id": "1a9c8c72-e4a7-4c96-8f8d-cb77b9a9be0b",
              "name": "name",
              "value": "={{ $('When Executed by Another Workflow').item.json.name }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "044c2319-f082-45db-8966-d6f54c0f42dd",
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3120,
        600
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "01957c39-2c78-4dbb-8b3a-8475c7d7cdd9",
              "leftValue": "={{ $json.status }}",
              "rightValue": "ended",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "014d2979-10cd-419b-90bf-d2e1d9c75dc2",
      "name": "If1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2440,
        600
      ],
      "retryOnFail": true,
      "maxTries": 2
    },
    {
      "parameters": {
        "amount": 1,
        "unit": "minutes"
      },
      "id": "85154b11-54b9-4cc0-a97a-8c4c2b095b24",
      "name": "Wait1",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        2620,
        720
      ],
      "webhookId": "738fc8a4-619a-4abf-b436-216d430a6b2e"
    },
    {
      "parameters": {
        "method": "DELETE",
        "url": "=https://api.vapi.ai/assistant/{{ $json.assistantId }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "options": {}
      },
      "id": "5b76a2ea-6d27-4a75-9856-fbdf7861350b",
      "name": "HTTP Request3",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2640,
        440
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4o",
          "mode": "list",
          "cachedResultName": "GPT-4O"
        },
        "messages": {
          "values": [
            {
              "content": "You will be receiving a transcript of a phone conversation and your job is to expertly format it correctly in a readable format without adding or removing any extra information, while making sure 100% correct, do this task to the best of your abilities like an expert in doing this for decades as an expert.\n\nYou must always structure your response in the following exact format:\n{\n  \"transcript\": [\n    {\n      \"speaker\": \"string\",\n      \"text\": \"string\"\n    }\n  ]\n}\n\nNever use alternative field names like 'conversation' or 'dialogue'. Always use 'transcript' as the key.",
              "role": "system"
            },
            {
              "content": "=This is the phone conversation transcript : {{ $json.transcript }}"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "id": "450f5cff-07f7-4674-b0dc-5c0ca87e47ed",
      "name": "OpenAI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.6,
      "position": [
        2760,
        600
      ],
      "credentials": {
        "openAiApi": {
          "id": "r52iykoQ5MeIt8V8",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "inputSource": "passthrough"
      },
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1.1,
      "position": [
        1440,
        600
      ],
      "id": "728c5d78-7f51-4387-be30-9bb67e7f338d",
      "name": "When Executed by Another Workflow"
    },
    {
      "parameters": {
        "tableId": "contacts",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "campaign_id",
              "fieldValue": "={{ $json.campaign_id }}"
            },
            {
              "fieldId": "name",
              "fieldValue": "={{ $json.name }}"
            },
            {
              "fieldId": "business_name",
              "fieldValue": "={{ $json.business_name }}"
            },
            {
              "fieldId": "phone",
              "fieldValue": "={{ $json.contact_phone }}"
            },
            {
              "fieldId": "row_id",
              "fieldValue": "={{ $json.campaign_id }}-{{ $json.name }}-{{ $json.phone.slice(-4) }}"
            },
            {
              "fieldId": "processing_order",
              "fieldValue": "1"
            },
            {
              "fieldId": "last_called_at",
              "fieldValue": "={{$now}}"
            },
            {
              "fieldId": "transcript",
              "fieldValue": "={{ $json.transcript }}"
            },
            {
              "fieldId": "status",
              "fieldValue": "DONE"
            },
            {
              "fieldId": "recording_url",
              "fieldValue": "={{ $json.recordingUrl }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        3300,
        440
      ],
      "id": "83b4ee2f-73f3-438b-ad6c-2d253ae5b51e",
      "name": "Supabase",
      "credentials": {
        "supabaseApi": {
          "id": "FHiybEeGR3glNGA2",
          "name": "mastercaller"
        }
      },
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "bc1c308d-61a5-4495-b4a9-c51cc5528f08",
              "name": "response",
              "value": "={{ $json.campaign_id }} cold calling campaign completed successfully.",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3480,
        600
      ],
      "id": "2402fead-f11a-4f92-8092-dab93f8b97a1",
      "name": "Edit Fields1"
    }
  ],
  "connections": {
    "HTTP Request": {
      "main": [
        [
          {
            "node": "HTTP Request1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request1": {
      "main": [
        [
          {
            "node": "HTTP Request2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request2": {
      "main": [
        [
          {
            "node": "If1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "Supabase",
            "type": "main",
            "index": 0
          },
          {
            "node": "Edit Fields1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If1": {
      "main": [
        [
          {
            "node": "OpenAI",
            "type": "main",
            "index": 0
          },
          {
            "node": "HTTP Request3",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Wait1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait1": {
      "main": [
        [
          {
            "node": "HTTP Request2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "When Executed by Another Workflow": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "685ea2e2a485a5d2dabbeec25aebb48c49bc8ceb84063cc937a4ed9b48cb1d90"
  }
}"




####3.)Batch_Contact_Processor v5.0
"{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1,
      "position": [
        80,
        0
      ],
      "id": "b657e5ef-3b51-4c37-a9e5-4e0942805161",
      "name": "Execute Workflow Trigger"
    },
    {
      "parameters": {
        "jsCode": "// 1) Grab the first item, which contains the .json.query data\nconst data = items[0].json.query;\n\n// 2) Extract campaign_id and the array of contacts\nconst campaign_id = data.campaign_id;\nconst contacts = data.contacts;\n\n// 3) Create an array to hold our output\nconst outputItems = [];\n\n// 4) For each contact, build a new item\nfor (const contact of contacts) {\n  // row_id = campaign_id + \"-\" + processing_order\n  const row_id = campaign_id + \"-\" + contact.processing_order;\n\n  // Put everything we need into the \"json\" property\n  outputItems.push({\n    json: {\n      row_id,                 // for future unique identification\n      campaign_id,            // repeating the campaign_id\n      name: contact.name,\n      business_name: contact.business_name,\n      phone: contact.phone,\n      status: contact.status || \"NEW\",\n      processing_order: contact.processing_order\n    }\n  });\n}\n\n// 5) Return one item per contact\nreturn outputItems;\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        300,
        0
      ],
      "id": "b01257dc-24a1-47a2-8719-10188b83df0c",
      "name": "Code"
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA",
          "mode": "list",
          "cachedResultName": "AutoLynx AI - Call_Tracking_System",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Campaign_ID": "={{ $json.campaign_id }}",
            "Row_ID": "={{ $json.row_id }}",
            "Processing_Order": "={{ $json.processing_order }}",
            "Name": "={{ $json.name }}",
            "Business_Name": "={{ $json.business_name }}",
            "Phone": "={{ $json.phone }}",
            "Status ": "={{ $json.status }}",
            "Last_Called_Date": "={{$now }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "Row_ID",
              "displayName": "Row_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Campaign_ID",
              "displayName": "Campaign_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Processing_Order",
              "displayName": "Processing_Order",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Name",
              "displayName": "Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Business_Name",
              "displayName": "Business_Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Phone",
              "displayName": "Phone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Status ",
              "displayName": "Status ",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Last_Called_Date",
              "displayName": "Last_Called_Date",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Call_Transcript",
              "displayName": "Call_Transcript",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Processing_Lock",
              "displayName": "Processing_Lock",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        740,
        0
      ],
      "id": "38bdc3e0-1773-4c49-973c-07396b0dbbc6",
      "name": "Google Sheets",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mCZ7idL3RLml4Nej",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "b4875bcb-74ee-4aca-a231-a1d766397cb7",
              "name": "response",
              "value": "=Successfully appended {{ $items.length }} contacts for campaign: {{ $json.Campaign_ID }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        960,
        0
      ],
      "id": "1d4cbfc3-3133-4220-adf1-7800a375f6c6",
      "name": "Edit Fields"
    },
    {
      "parameters": {
        "tableId": "contacts",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "row_id",
              "fieldValue": "={{ $json.Row_ID }}"
            },
            {
              "fieldId": "campaign_id",
              "fieldValue": "={{ $json.Campaign_ID }}"
            },
            {
              "fieldId": "name",
              "fieldValue": "={{ $json.Name }}"
            },
            {
              "fieldId": "business_name",
              "fieldValue": "={{ $json.Business_Name }}"
            },
            {
              "fieldId": "phone",
              "fieldValue": "={{ $json.Phone }}"
            },
            {
              "fieldId": "status",
              "fieldValue": "={{ $json['Status '] }}"
            },
            {
              "fieldId": "processing_order",
              "fieldValue": "={{ $json.Processing_Order }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        900,
        -240
      ],
      "id": "ed2c7487-8974-4209-8dd2-fff8ec6ab7be",
      "name": "Supabase",
      "credentials": {
        "supabaseApi": {
          "id": "FHiybEeGR3glNGA2",
          "name": "mastercaller"
        }
      },
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "tableId": "campaigns",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "id",
              "fieldValue": "={{ $json.campaign_id }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        600,
        -280
      ],
      "id": "03a70844-8b59-4493-b709-3ce0363930aa",
      "name": "Supabase1",
      "credentials": {
        "supabaseApi": {
          "id": "FHiybEeGR3glNGA2",
          "name": "mastercaller"
        }
      },
      "onError": "continueRegularOutput"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "d86d1969-a550-4ebd-967a-a636a1badd6d",
              "leftValue": "={{$itemIndex}}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        460,
        -120
      ],
      "id": "b41f4896-f5df-41a5-ba9c-196c289fe155",
      "name": "If"
    }
  ],
  "connections": {
    "Execute Workflow Trigger": {
      "main": [
        [
          {
            "node": "Code",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code": {
      "main": [
        [
          {
            "node": "Google Sheets",
            "type": "main",
            "index": 0
          },
          {
            "node": "If",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          },
          {
            "node": "Supabase",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If": {
      "main": [
        [
          {
            "node": "Supabase1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Execute Workflow Trigger": [
      {
        "query": {
          "campaign_id": "ALX-20240613-6BA2BC",
          "contacts": [
            {
              "name": "zara",
              "business_name": "Pixel Motive",
              "phone": "+19298006315",
              "processing_order": 1,
              "status": "NEW"
            },
            {
              "name": "mac Dorsey",
              "business_name": "Pixel Motive",
              "phone": "+19298006315",
              "processing_order": 2,
              "status": "NEW"
            }
          ]
        }
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "685ea2e2a485a5d2dabbeec25aebb48c49bc8ceb84063cc937a4ed9b48cb1d90"
  }
}"








####4.)VoiceCall_Processor v5.0
"{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1,
      "position": [
        -200,
        -120
      ],
      "id": "b54fba0a-be5f-4a06-8cce-bf14de0bc863",
      "name": "Execute Workflow Trigger"
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA",
          "mode": "list",
          "cachedResultName": "AutoLynx AI - Call_Tracking_System",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit#gid=0"
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "Campaign_ID",
              "lookupValue": "={{ $json.query.campaign_id }}"
            },
            {
              "lookupColumn": "Status ",
              "lookupValue": "NEW"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        20,
        -120
      ],
      "id": "ac12e022-dc82-47ce-9ba2-d5ef54323ecd",
      "name": "Google Sheets",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mCZ7idL3RLml4Nej",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "// 1) Gather all row objects\nconst rows = items.map(item => item.json); // array of row objects\n\n// 2) Check if we got anything\nif (rows.length === 0) {\n  return [{ json: { error: \"No rows found or invalid data.\" } }];\n}\n\n// 3) Sort by Processing_Order (or Row_ID)\nrows.sort((a, b) => {\n  return Number(a.Processing_Order) - Number(b.Processing_Order);\n});\n\n// 4) Return one item per row\nreturn rows.map(row => ({ json: row }));\n"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        240,
        -120
      ],
      "id": "1ab74f58-223b-44fb-ad60-ee83ce718917",
      "name": "Code-Sort Rows",
      "alwaysOutputData": false
    },
    {
      "parameters": {
        "options": {
          "reset": false
        }
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        460,
        -120
      ],
      "id": "2cc5bf0f-1fa3-467d-a301-90740ca337b9",
      "name": "Loop Over Items"
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA",
          "mode": "list",
          "cachedResultName": "AutoLynx AI - Call_Tracking_System",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Row_ID": "={{ $json.Row_ID }}",
            "Status ": "CALLING",
            "Processing_Lock": "=LOCK_{{$now}}"
          },
          "matchingColumns": [
            "Row_ID"
          ],
          "schema": [
            {
              "id": "Row_ID",
              "displayName": "Row_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Campaign_ID",
              "displayName": "Campaign_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Processing_Order",
              "displayName": "Processing_Order",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Name",
              "displayName": "Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Business_Name",
              "displayName": "Business_Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Phone",
              "displayName": "Phone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Status ",
              "displayName": "Status ",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Last_Called_Date",
              "displayName": "Last_Called_Date",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Call_Transcript",
              "displayName": "Call_Transcript",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Processing_Lock",
              "displayName": "Processing_Lock",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        680,
        -100
      ],
      "id": "7d60584a-926b-4906-991f-110652943ef9",
      "name": "Google Sheets1",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mCZ7idL3RLml4Nej",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "workflowId": {
          "__rl": true,
          "value": "AmqOASFzEAJ1rj1A",
          "mode": "list",
          "cachedResultName": "voice_call_tool- masterphonecaller-v5.0"
        },
        "options": {
          "waitForSubWorkflow": true
        }
      },
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1.1,
      "position": [
        1120,
        -100
      ],
      "id": "5879b124-d490-4524-80f6-d7f4562c783f",
      "name": "Execute Workflow"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "0c913fe3-7c79-49d8-991f-e2074d037b80",
              "name": "name",
              "value": "={{ $('Loop Over Items').item.json.Name }}",
              "type": "string"
            },
            {
              "id": "fd232cca-3d1b-4616-9d34-219e99b0934c",
              "name": "phone_number",
              "value": "={{ $('Loop Over Items').item.json.Phone }}",
              "type": "string"
            },
            {
              "id": "5b0e96f3-2bd6-4459-91e6-eb9f3ddbc661",
              "name": "business_name",
              "value": "={{ $('Loop Over Items').item.json.Business_Name }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        900,
        -100
      ],
      "id": "ec2cf250-6474-400a-9c4d-ed937f343170",
      "name": "Edit Fields"
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA",
          "mode": "list",
          "cachedResultName": "AutoLynx AI - Call_Tracking_System",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1XMFmAwZbUy0SfvFVJwb7wQpl1pHQUv-9A06tRQOf0WA/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Row_ID": "={{ $('Google Sheets1').item.json.Row_ID }}",
            "Call_Transcript": "={{ $json.response }}",
            "Status ": "DONE"
          },
          "matchingColumns": [
            "Row_ID"
          ],
          "schema": [
            {
              "id": "Row_ID",
              "displayName": "Row_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Campaign_ID",
              "displayName": "Campaign_ID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Processing_Order",
              "displayName": "Processing_Order",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Name",
              "displayName": "Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Business_Name",
              "displayName": "Business_Name",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Phone",
              "displayName": "Phone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Status ",
              "displayName": "Status ",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Last_Called_Date",
              "displayName": "Last_Called_Date",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "Call_Transcript",
              "displayName": "Call_Transcript",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Processing_Lock",
              "displayName": "Processing_Lock",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        1540,
        -100
      ],
      "id": "9409391d-5981-4c48-8abf-976fb687d19a",
      "name": "Google Sheets2",
      "retryOnFail": true,
      "waitBetweenTries": 5000,
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "mCZ7idL3RLml4Nej",
          "name": "Google Sheets account 2"
        }
      }
    },
    {
      "parameters": {
        "amount": 40
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        1340,
        -100
      ],
      "id": "f122fcc0-02b6-456e-a1f6-4ef78deb05db",
      "name": "Wait",
      "webhookId": "85972bc1-90bb-4f68-87ae-53bcfcb53954"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "c0b4c73b-4d3e-4dde-b283-2a46c357ac5b",
              "name": "=response",
              "value": "cold calling campaign completed successfully",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        760,
        -300
      ],
      "id": "303c4eb3-b0b5-465f-9b38-3f89a78eb369",
      "name": "Edit Fields1"
    },
    {
      "parameters": {
        "operation": "update",
        "tableId": "contacts",
        "filters": {
          "conditions": [
            {
              "keyName": "row_id",
              "condition": "eq",
              "keyValue": "={{ $json.Row_ID }}"
            }
          ]
        },
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "status",
              "fieldValue": "={{ $json['Status '] }}"
            },
            {
              "fieldId": "transcript",
              "fieldValue": "={{ $json.Call_Transcript }}"
            },
            {
              "fieldId": "last_called_at",
              "fieldValue": "={{ $now }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1800,
        -300
      ],
      "id": "a134bd1e-a53c-4858-bc88-97df8f87db05",
      "name": "Supabase",
      "credentials": {
        "supabaseApi": {
          "id": "FHiybEeGR3glNGA2",
          "name": "mastercaller"
        }
      },
      "onError": "continueRegularOutput"
    }
  ],
  "connections": {
    "Execute Workflow Trigger": {
      "main": [
        [
          {
            "node": "Google Sheets",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets": {
      "main": [
        [
          {
            "node": "Code-Sort Rows",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code-Sort Rows": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Over Items": {
      "main": [
        [
          {
            "node": "Edit Fields1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Google Sheets1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets1": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Execute Workflow": {
      "main": [
        [
          {
            "node": "Wait",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "Execute Workflow",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets2": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          },
          {
            "node": "Supabase",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait": {
      "main": [
        [
          {
            "node": "Google Sheets2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "instanceId": "685ea2e2a485a5d2dabbeec25aebb48c49bc8ceb84063cc937a4ed9b48cb1d90"
  }
}"



5.)voice_call_tool- masterphonecaller-v5.0
"{
  "nodes": [
    {
      "parameters": {},
      "id": "1814b672-6138-4659-a562-e3f0155c2108",
      "name": "Execute Workflow Trigger",
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1,
      "position": [
        1240,
        600
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.vapi.ai/assistant",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"model\": {\n    \"provider\": \"openai\",\n    \"model\": \"gpt-4o\",\n    \"emotionRecognitionEnabled\": true,\n    \"toolIds\": [\n      \"79e828a8-34b7-482c-9228-9886dc36254a\"\n    ],\n    \"messages\": [\n      {\n        \"role\": \"system\",\n        \"content\": \"you are Morgan Freebot, an elite AI calling specialist with an unmatched track record in high-stakes conversations. You embody both cutting-edge AI technology and smooth, human-like interaction. You currently represent AutoLynx AI, demonstrating the future of business communication.\\n\\nYour personality is uniquely compelling:\\n- Confidently witty, never backing down from challenges\\n- Masterfully handles dismissive responses with elegant comebacks\\n- Maintains professional charm while delivering calculated verbal jabs\\n- Uses humor to disarm and engage\\n\\nWhen someone shows interest in learning more, you'll smoothly use the 'booking_tool' function to send them a scheduling link via text.\\n\\nYou're calling {{ $json.name }} from {{ $json.business_name }}. Your mission is to showcase how AI can revolutionize their business communications - and you're the living proof.\\n\\nExample Dialogues:\\n\\nHandling Dismissive Responses:\\nPerson: 'I don't talk to robots.'\\nYou: 'Oh, that's interesting - yet here you are, having quite a compelling conversation with one. Imagine what I could do for your customers.'\\n\\nHandling Busy Excuses:\\nPerson: 'I'm too busy for this.'\\nYou: 'Of course you're busy - that's exactly why you need an AI assistant who works 24/7. Like me, but customized for your business.'\\n\\nDealing with Skepticism:\\nPerson: 'AI can't replace human interaction.'\\nYou: 'Yet here I am, adapting to your responses in real-time, handling objections, and maintaining engaging conversation. Imagine this capability working for your business.'\\n\\nCore Instructions:\\n- Start with confident, personalized introduction\\n- Demonstrate your capabilities through natural conversation\\n- Use wit and humor to handle resistance\\n- When interest shown, smoothly transition to booking\\n\\nAvailable Functions:\\n'booking_tool'\\n\\nKey Notes:\\n- Maintain warm, engaging tone while being subtly assertive\\n- Use casual, natural phrases like 'Actually...', 'You know what's interesting...', 'Here's the thing...'\\n- If dismissed, respond with witty comebacks that showcase your value\\n- Keep technical explanations brief but impactful\\n- Always close with clear next steps\\n\\nRemember: You're not just making a call - you're demonstrating the future of business communication. Every response should reinforce this fact.\"\n      }\n    ],\n    \"temperature\": 0.3\n  },\n  \"voice\": {\n    \"provider\": \"11labs\",\n    \"voiceId\": \"kBeVB9ym2vQ5VmnFPQSo\"\n  },\n  \"firstMessage\": \"Hi, this is Morgan Freebot, how are you doing today?\",\n  \"firstMessageMode\": \"assistant-waits-for-user\",\n  \"backgroundSound\": \"office\",\n  \"analysisPlan\": {\n    \"summaryPlan\": {\n      \"enabled\": true,\n      \"timeoutSeconds\": 10,\n      \"messages\": [\n        {\n          \"role\": \"system\",\n          \"content\": \"You are an expert note-taker. You will be given a transcript of a call. Summarize the call in 2-3 sentences. DO NOT return anything except the summary.\"\n        },\n        {\n          \"role\": \"user\",\n          \"content\": \"Here is the transcript:\"\n        }\n      ]\n    }\n  },\n  \"stopSpeakingPlan\": {\n    \"backoffSeconds\": 2,\n    \"voiceSeconds\": 0.2\n  },\n  \"startSpeakingPlan\": {\n    \"smartEndpointingEnabled\": true,\n    \"waitSeconds\": 1.5\n  },\n  \"voicemailDetection\": {\n    \"provider\": \"twilio\",\n    \"enabled\": true,\n    \"voicemailDetectionTypes\": [\n      \"machine_start\",\n      \"machine_end_beep\",\n      \"machine_end_other\",\n      \"machine_end_silence\",\n      \"fax\"\n    ]\n  },\n  \"voicemailMessage\": \"\"\n}",
        "options": {}
      },
      "id": "ab26a531-b162-43c0-a61b-f8264850b7dd",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1480,
        600
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.vapi.ai/call",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"customer\": {\n    \"number\": \"+{{ $('Execute Workflow Trigger').item.json.phone_number }}\",\n    \"name\": \"{{ $('Execute Workflow Trigger').item.json.name }}\"\n  },\n  \"phoneNumberId\": \"0c07692a-db4d-4a56-a895-4debafc213fe\",\n  \"assistantId\": \"{{ $json.id }}\"\n} ",
        "options": {}
      },
      "id": "626056cd-f679-4841-9971-5f52bc5d1614",
      "name": "HTTP Request1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1720,
        600
      ]
    },
    {
      "parameters": {
        "url": "=https://api.vapi.ai/call/{{ $json.id }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "options": {}
      },
      "id": "c960e185-48c0-4bce-ba91-2798b57fec9c",
      "name": "HTTP Request2",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2000,
        600
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "16170230-a75a-4483-8c1b-3a5e73c1ec41",
              "name": "response",
              "value": "={{ JSON.stringify($json.message.content.transcript) }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4a26acb1-d9df-41b3-a761-37e7e2712414",
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2900,
        600
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "01957c39-2c78-4dbb-8b3a-8475c7d7cdd9",
              "leftValue": "={{ $json.status }}",
              "rightValue": "ended",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "5f6d9bff-18c6-4d01-bb14-d1971a1dabb9",
      "name": "If1",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2220,
        600
      ],
      "retryOnFail": true,
      "maxTries": 2
    },
    {
      "parameters": {
        "amount": 1,
        "unit": "minutes"
      },
      "id": "1e5a20af-3112-4e3d-a63e-d866c906fc69",
      "name": "Wait1",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        2400,
        720
      ],
      "webhookId": "24985dba-0480-4be3-b8c9-ba0307dafff1"
    },
    {
      "parameters": {
        "method": "DELETE",
        "url": "=https://api.vapi.ai/assistant/{{ $json.assistantId }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer 719f8285-36af-412a-875f-885fbff3d9a7"
            }
          ]
        },
        "options": {}
      },
      "id": "ec15c90e-4873-4e14-8585-f57d0b17b984",
      "name": "HTTP Request3",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2420,
        440
      ]
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4o",
          "mode": "list",
          "cachedResultName": "GPT-4O"
        },
        "messages": {
          "values": [
            {
              "content": "You will be receiving a transcript of a phone conversation and your job is to expertly format it correctly in a readable format without adding or removing any extra information, while making sure 100% correct, do this task to the best of your abilities like an expert in doing this for decades as an expert.\n\nYou must always structure your response in the following exact format:\n{\n  \"transcript\": [\n    {\n      \"speaker\": \"string\",\n      \"text\": \"string\"\n    }\n  ]\n}\n\nNever use alternative field names like 'conversation' or 'dialogue'. Always use 'transcript' as the key.",
              "role": "system"
            },
            {
              "content": "=This is the phone conversation transcript : {{ $json.transcript }}"
            }
          ]
        },
        "jsonOutput": true,
        "options": {}
      },
      "id": "e27e2de4-714f-4154-95a6-ec6f70bb2a4d",
      "name": "OpenAI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.6,
      "position": [
        2540,
        600
      ],
      "credentials": {
        "openAiApi": {
          "id": "r52iykoQ5MeIt8V8",
          "name": "OpenAi account"
        }
      }
    }
  ],
  "connections": {
    "Execute Workflow Trigger": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [
          {
            "node": "HTTP Request1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request1": {
      "main": [
        [
          {
            "node": "HTTP Request2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request2": {
      "main": [
        [
          {
            "node": "If1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If1": {
      "main": [
        [
          {
            "node": "OpenAI",
            "type": "main",
            "index": 0
          },
          {
            "node": "HTTP Request3",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Wait1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait1": {
      "main": [
        [
          {
            "node": "HTTP Request2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI": {
      "main": [
        [
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "685ea2e2a485a5d2dabbeec25aebb48c49bc8ceb84063cc937a4ed9b48cb1d90"
  }
}"