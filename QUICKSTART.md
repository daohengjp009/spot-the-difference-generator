# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- OpenAI API Key ([get one](https://platform.openai.com/account/api-keys))

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/spot-the-difference-generator.git
cd spot-the-difference-generator
npm install
```

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
# OPENAI_API_KEY=sk_your_actual_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🐳 Using Docker (Alternative)

### Prerequisites
- Docker & Docker Compose installed

### Run with Docker
```bash
# Create .env.local first
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local

# Start all services
docker-compose up

# App: http://localhost:3000
# Database: localhost:5432
# PgAdmin: http://localhost:5050
```

### Stop Services
```bash
docker-compose down
```

---

## 📝 Usage

### Generate a Puzzle
1. Select a **Theme** (playground, zoo, underwater, etc.)
2. Choose **Difficulty** (easy, medium, hard)
3. Click **"Generate New Puzzle"**
4. Wait 10-15 seconds for AI to create unique images

### View Puzzle
- **Picture 1**: Original image
- **Picture 2**: Modified image with differences
- **Show Answer**: Reveal highlighted differences

### Export/Share
- **Print**: Download A4 worksheet (print-friendly)
- **Download PDF**: Save as PDF with answer key
- **Share**: Get shareable link for friends

---

## 🛠️ Troubleshooting

### "OpenAI API Error"
- ✅ Check API key in `.env.local`
- ✅ Verify API credits at [platform.openai.com](https://platform.openai.com/account/billing)
- ✅ Check rate limits (max 3 requests/minute for free tier)

### "Puzzle Generation Timeout"
- Increase timeout in `.env.local`: `GENERATION_TIMEOUT=60000`
- Try again in a few minutes
- Check internet connection

### "Port 3000 Already in Use"
```bash
# Use different port
npm run dev -- -p 3001
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Project Structure

```
spot-the-difference-generator/
├── app/                 # Next.js pages & API
│   ├── api/            # API endpoints
│   ├── page.tsx        # Homepage
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Core logic
│   ├── ai-engine.ts   # Image generation
│   ├── difference-engine.ts  # Puzzle logic
│   └── export-engine.ts      # Export logic
├── public/            # Static assets
├── .env.example       # Environment template
└── README.md          # Full documentation
```

---

## 🚀 Deployment

### Deploy to Vercel (1-Click)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add `OPENAI_API_KEY` in Environment Variables
5. Deploy! 🎉

### Deploy to Other Platforms

#### Heroku
```bash
git push heroku main
```

#### Self-hosted
```bash
npm run build
npm start
```

---

## 💡 Tips & Tricks

### Performance
- Puzzles cache automatically
- Images optimized with Sharp
- Async generation prevents blocking

### Customization
- Add more themes in `lib/ai-engine.ts`
- Change difficulty levels in `lib/ai-engine.ts`
- Modify colors in `tailwind.config.js`

### Development
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Learn More

- **Next.js**: [nextjs.org](https://nextjs.org)
- **OpenAI API**: [platform.openai.com](https://platform.openai.com/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion)

---

## 🤝 Support

Need help?
- Check [README.md](./README.md) for detailed docs
- See [PROMPTS.md](./PROMPTS.md) for prompt examples
- Open an issue on GitHub
- Email: support@spotdifference.app

---

## 📋 Checklist Before Deploying

- [ ] OpenAI API key is valid and has credits
- [ ] `.env.local` is created with all required variables
- [ ] `NEXT_PUBLIC_API_URL` matches your deployment domain
- [ ] Database configured (if using PostgreSQL)
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Tests pass (if applicable)

---

**Happy puzzle creating! 🎨✨**
