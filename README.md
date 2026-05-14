# AI Spot the Difference Generator

🎨 **Create unlimited children-friendly "Spot the Difference" puzzle games using AI-generated images.**

A production-quality web application that automatically generates unique visual puzzles for children, parents, and educators. Every puzzle is crafted by AI to ensure variety, educational value, and safety.

## Features

✨ **Core Features**
- 🤖 AI-powered puzzle generation using OpenAI DALL-E 3
- 🎯 Automatic difference detection and coordinate tracking
- 🎨 Multiple puzzle themes (playground, zoo, underwater, etc.)
- 📊 Three difficulty levels (easy: 5, medium: 8, hard: 10-15 differences)
- 🖨️ Export to PDF, A4 worksheet, PNG, and JSON formats
- 🔗 Shareable puzzle links with social media integration
- 📱 Responsive mobile-first design
- ⚡ Async job processing with progress tracking

📚 **Bonus Architecture**
- Prepared for multiplayer mode
- Daily puzzle system ready
- Classroom mode framework
- User accounts infrastructure
- Leaderboard system
- AI narration support
- Multilingual support structure

## Tech Stack

**Frontend**
- Next.js 15 with React 18
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Sharp for image processing

**Backend**
- Node.js with Next.js API routes
- OpenAI API integration (DALL-E 3, GPT-4)
- Async job processing
- File export system

**Infrastructure**
- Vercel for deployment
- PostgreSQL/Supabase (optional)
- Environment-based configuration

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── puzzle/
│   │   │   └── route.ts          # Puzzle generation API
│   │   └── export/
│   │       └── route.ts          # Export functionality
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   ├── Button.tsx                # Reusable button
│   ├── GenerationControls.tsx    # Theme/difficulty selector
│   ├── HeroSection.tsx           # Landing section
│   ├── PuzzleViewer.tsx          # Puzzle display
│   └── Skeleton.tsx              # Loading states
├── lib/
│   ├── types.ts                  # TypeScript definitions
│   ├── ai-engine.ts              # Image generation logic
│   ├── difference-engine.ts      # Difference tracking
│   └── export-engine.ts          # Export functionality
├── public/
│   └── exports/                  # Generated files
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for DALL-E 3)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spot-the-difference-generator.git
cd spot-the-difference-generator
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk_your_actual_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Create required directories**
```bash
mkdir -p public/exports
```

5. **Run development server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk_xxx                    # OpenAI API key

# Optional
DATABASE_URL=postgresql://...            # PostgreSQL connection
NEXT_PUBLIC_API_URL=http://localhost:3000

# Features
ENABLE_DATABASE=false                    # Enable database persistence
ENABLE_USER_ACCOUNTS=false               # User authentication
ENABLE_ANALYTICS=false                   # Analytics tracking

# Generation
GENERATION_TIMEOUT=30000                 # Max generation time (ms)
MAX_CONCURRENT_GENERATIONS=3             # Concurrent job limit

# Export
MAX_EXPORT_SIZE=52428800                 # Max export file size
ENABLE_PDF_EXPORT=true
ENABLE_A4_EXPORT=true
```

## API Documentation

### Generate Puzzle

**Request**
```bash
POST /api/puzzle
Content-Type: application/json

{
  "theme": "playground",
  "difficulty": "easy"
}
```

**Response**
```json
{
  "success": true,
  "jobId": "uuid-string",
  "status": "pending"
}
```

**Check Status**
```bash
GET /api/puzzle?jobId=uuid-string
```

**Response**
```json
{
  "success": true,
  "status": "complete",
  "puzzle": {
    "id": "uuid",
    "theme": "playground",
    "difficulty": "easy",
    "differenceCount": 5,
    "differences": [...],
    "originalImageUrl": "https://...",
    "modifiedImageUrl": "https://...",
    "answerImageUrl": "https://...",
    "seed": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "generationTime": 12345
  }
}
```

### Export Puzzle

**Request**
```bash
POST /api/export
Content-Type: application/json

{
  "format": "pdf",
  "puzzleData": { puzzle object },
  "includeAnswer": true
}
```

Supported formats: `pdf`, `a4`, `png`, `json`

### Share Puzzle

**Request**
```bash
GET /api/export/share?puzzleId=uuid-string
```

**Response**
```json
{
  "success": true,
  "shareUrl": "https://...",
  "shareText": "...",
  "socialLinks": {
    "twitter": "https://...",
    "facebook": "https://...",
    "whatsapp": "https://..."
  }
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Import the GitHub repository
- Add environment variables in project settings
- Deploy

3. **Environment Variables on Vercel**
```
OPENAI_API_KEY=sk_your_key
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

### Deploy to Other Platforms

**Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**Environment Setup for Production**
```bash
NODE_ENV=production
GENERATION_TIMEOUT=60000
MAX_CONCURRENT_GENERATIONS=10
```

## Usage

### For Users

1. **Visit the website**
   - Navigate to the home page
   - Select a theme (10 options)
   - Choose difficulty level

2. **Generate Puzzle**
   - Click "Generate New Puzzle"
   - Wait for AI to create unique images
   - View side-by-side puzzle images

3. **Interact with Puzzle**
   - Try to find all differences
   - Click "Show Answer" to reveal solutions
   - See numbered circles highlighting differences

4. **Export or Share**
   - Print as A4 worksheet
   - Download as PDF
   - Share with friends via link
   - Export as PNG or JSON

### For Developers

#### Adding New Themes

Edit `lib/ai-engine.ts`:
```typescript
const themeDescriptions: Record<Theme, string> = {
  // Add new themes here
  camping: 'A scenic camping scene with tents, campfire, and outdoor activities',
};
```

Update `lib/types.ts`:
```typescript
export type Theme = 
  | 'playground'
  | 'camping'  // New theme
  | ... other themes
```

#### Customizing Difficulty Levels

Edit `lib/ai-engine.ts`:
```typescript
const difficultyLevels = {
  veryeasy: 3,
  easy: 5,
  medium: 8,
  hard: 10,
  extreme: 20,
};
```

#### Implementing Database

1. Set up PostgreSQL/Supabase
2. Create schema (see below)
3. Set `ENABLE_DATABASE=true`
4. Implement database calls in API routes

### Database Schema (Optional)

```sql
CREATE TABLE puzzles (
  id UUID PRIMARY KEY,
  theme VARCHAR(50),
  difficulty VARCHAR(20),
  original_image_url TEXT,
  modified_image_url TEXT,
  answer_image_url TEXT,
  differences JSONB,
  seed VARCHAR(255),
  generation_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_puzzles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  puzzle_id UUID REFERENCES puzzles(id),
  saved_at TIMESTAMP DEFAULT NOW()
);
```

## Performance

### Generation Times
- Master scene generation: ~3-5 seconds
- Modification generation: ~3-5 seconds
- Difference detection: ~1-2 seconds
- Answer overlay: <1 second
- **Total: 10-15 seconds per puzzle**

### Optimization Tips
- Use caching for generated images (CloudFront/CDN)
- Implement rate limiting (10 requests/minute/user)
- Use async jobs to prevent blocking
- Compress images with Sharp
- Cache theme descriptions

### Scaling
- Use job queue (Bull, RabbitMQ) for high volume
- Implement database connection pooling
- Use load balancing for multiple servers
- Cache frequently used puzzles

## Troubleshooting

### Common Issues

**"Failed to generate image"**
- Check OpenAI API key validity
- Verify API credits
- Check rate limits

**"Puzzle generation timeout"**
- Increase `GENERATION_TIMEOUT` in .env
- Check internet connection
- Try again later (OpenAI rate limits)

**"Export failed"**
- Verify file permissions in `public/exports`
- Check disk space
- Ensure Sharp is properly installed

**Images not loading**
- Configure proper CORS headers
- Verify image URLs are accessible
- Check browser console for errors

## Future Roadmap

- [ ] User accounts and puzzle history
- [ ] Multiplayer mode (1v1 challenges)
- [ ] Leaderboard system
- [ ] Daily puzzle challenges
- [ ] AI narration (text-to-speech)
- [ ] Animated puzzles
- [ ] Multilingual support
- [ ] Classroom mode with teacher dashboard
- [ ] Mobile app (React Native)
- [ ] VR/3D puzzle mode

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/spot-the-difference-generator/issues)
- Email: support@spotdifference.app
- Discord: [Join our community](https://discord.gg/example)

## Acknowledgments

- OpenAI for DALL-E 3 API
- Vercel for hosting
- Next.js community
- All contributors and users

---

**Built with ❤️ for children, parents, and educators worldwide.**

Made to spark joy, creativity, and learning through interactive visual puzzles.
