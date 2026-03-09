# finance-chat-bot

1. Install Docker & Docker Compose.

2. Clone repo:

    git clone https://github.com/shivaa-sahu/finance-chat-bot.git
    cd finace-chat-bot
    cp .env.example .env
    # edit .env to add API keys for search/LLM providers
    docker-compose up --build



3. npx prisma migrate deploy --schema=prisma/schema.prisma
   npx prisma generate



4. node packages/backend/scripts/seed-demo.js

5. Open http://localhost:3000 for the frontend. Use demo account demo@local / demo (seeded).

6. Run demo script:
scripts/demo-research.sh

7. Tests:
# backend unit tests
cd packages/backend
npm run test

# agent unit tests
cd packages/agent
pytest -q


