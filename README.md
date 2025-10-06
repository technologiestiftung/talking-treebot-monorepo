# Talking Treebot Monorepo

A full-stack application for collecting, storing, and visualizing conversational data from Raspberry Pi with automatic topic analysis.

## Architecture

- **Raspberry Pi**: Collects data and pushes to PostgreSQL
- **PostgreSQL**: Stores sensor data with automatic topic extraction
- **Next.js API Routes**: RESTful API for data access and analytics
- **Next.js Frontend**: Interactive dashboard "Treebot Tales" with charts and visualizations
- **Prisma**: Type-safe database ORM
- **Topic Analysis**: Automatic keyword extraction and categorization

## Features

- Real-time conversation data collection
- Automatic topic extraction from questions and answers
- Interactive analytics dashboard with:
  - Interactions over time (line chart)
  - Top trending topics (bar chart)
  - Language distribution
- Multi-language support
- RESTful API for data access

## Setup

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Database

Create a `.env` file based on `.env.example`:

\`\`\`env
DATABASE_URL="postgresql://user:password@host:port/database"
\`\`\`

### 3. Initialize Database

Run the SQL scripts to create the tables:

\`\`\`bash
# Create initial table
psql -U your_user -d your_database -f scripts/create-sensor-data-table.sql

# Add topic column
psql -U your_user -d your_database -f scripts/add-topic-column.sql
\`\`\`

Or use the v0 script runner to execute them directly.

### 4. Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the dashboard.

## API Endpoints

### GET /api/sensor-data
Fetch all sensor data with pagination.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)

**Example:**
\`\`\`bash
curl http://localhost:3000/api/sensor-data?limit=10&offset=0
\`\`\`

### POST /api/sensor-data
Create new sensor data entry with automatic topic extraction.

**Body:**
\`\`\`json
{
  "answers": ["Answer 1", "Answer 2"],
  "questions": ["Question 1", "Question 2"],
  "language": "en",
  "datetime": "2025-03-10T12:00:00Z"
}
\`\`\`

**Example:**
\`\`\`bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"answers":["Yes","No"],"questions":["Q1","Q2"],"language":"en"}'
\`\`\`

### GET /api/analytics
Fetch analytics data including interactions over time and top topics.

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)

**Example:**
\`\`\`bash
curl http://localhost:3000/api/analytics?days=30
\`\`\`

### POST /api/analyze-topic
Manually analyze topic for a specific conversation.

**Body:**
\`\`\`json
{
  "id": 123
}
\`\`\`

### GET /api/analyze-topic
Analyze all conversations without topics (batch processing).

## Topic Analysis

The system automatically extracts topics from conversations using keyword frequency analysis:

1. **Automatic Extraction**: When new data is inserted via POST, topics are automatically extracted
2. **Categorization**: Topics are categorized into: environment, technology, health, education, business, or custom keywords
3. **Manual Analysis**: Use `/api/analyze-topic` to analyze existing conversations
4. **Batch Processing**: GET `/api/analyze-topic` analyzes all conversations without topics

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your `DATABASE_URL` environment variable in Vercel project settings
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Deploy API routes as serverless functions
- Provide a production URL with HTTPS

## Raspberry Pi Integration

Update your Raspberry Pi script to POST data to your API with automatic topic extraction:

\`\`\`python
import requests
import json

data = {
    "answers": ["sensor_value_1", "sensor_value_2"],
    "questions": ["What is temp?", "What is humidity?"],
    "language": "en"
}

response = requests.post(
    "https://your-app.vercel.app/api/sensor-data",
    json=data
)
print(response.json())
\`\`\`

The API will automatically extract and categorize the topic from your conversation data.

## Dashboard Features

### Conversations Tab
- View all conversations with questions, answers, topics, and languages
- Real-time refresh capability
- Topic and language badges for quick identification

### Analytics Tab
- **Summary Statistics**: Total conversations, unique topics, languages
- **Interactions Over Time**: Line chart showing daily conversation trends
- **Top Trending Topics**: Horizontal bar chart of most discussed topics
- **Language Distribution**: Bar chart showing conversations by language

## Database Schema

\`\`\`sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL DEFAULT NOW(),
  answers JSONB NOT NULL,
  questions JSONB NOT NULL,
  language VARCHAR(50) NOT NULL,
  topic VARCHAR(255)
);
