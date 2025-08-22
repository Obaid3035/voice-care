# Voice Care Server

A Fastify-based REST API server for the Voice Care application, providing voice cloning, audio generation, and content management features.

## Features

- 🎤 **Voice Cloning**: Clone voices using ElevenLabs API
- 🎵 **Audio Generation**: Generate audio content using OpenAI + ElevenLabs
- 🔐 **Authentication**: Supabase-based authentication
- 📊 **Content Management**: Store and manage audio content
- 🌍 **Multilingual Support**: Support for multiple languages
- 🧪 **Testing**: Comprehensive test suite with Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- ElevenLabs API key
- OpenAI API key

## Project Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd voice-care/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup

Ensure your Supabase project has the following tables:

#### `voices` table
```sql
CREATE TABLE voices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  elevenlabs_voice_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  duration INTEGER NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `audio_content` table
```sql
CREATE TABLE audio_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  voice_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  title TEXT,
  language TEXT NOT NULL,
  type TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Storage Setup

Create a Supabase storage bucket named `audio` with the following settings:
- **Public**: false
- **File size limit**: 50MB
- **Allowed MIME types**: audio/*

## Development

### Start development server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Run tests with coverage

```bash
npm run test:coverage
```

## API Documentation

### Authentication

All endpoints require authentication via Supabase JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Voice Management

#### Clone Voice
```http
POST /api/voice/clone
Content-Type: multipart/form-data

{
  "file": <audio_file>,
  "name": "string",
  "language": "string"
}
```

#### Generate Audio
```http
POST /api/voice/generate-audio
Content-Type: application/json

{
  "prompt": "string",
  "voice_id": "string",
  "language": "string"
}
```

#### Get Voices
```http
GET /api/voice/voices
```

### Supported Languages

The API supports the following languages:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and enums
│   ├── errors/          # Error handling
│   ├── features/        # Feature modules
│   │   └── voice/       # Voice-related features
│   ├── helpers/         # Helper functions
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   ├── elevenlabs/  # ElevenLabs integration
│   │   ├── openai/      # OpenAI integration
│   │   └── queries/     # Database queries
│   └── app.ts           # Main application file
├── test/                # Test configuration
└── dist/                # Build output
```

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400,
    "details": {}
  }
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Authentication required
- `NOT_FOUND` - Resource not found
- `EXTERNAL_SERVICE_ERROR` - Third-party service error

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Mock Services**: External API mocking

Run specific test files:
```bash
npm test -- voice.test.ts
```

## Deployment

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Build and Deploy

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.
