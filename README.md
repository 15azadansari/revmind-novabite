# RevMind AI — NovaBite Consumer Goods (Mini BI Chatbot)

A miniature conversational business intelligence tool for NovaBite Consumer Goods.
Managers can view a sales dashboard and ask natural language questions about
their business data, answered by an LLM grounded in real sales data.

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)
- **Frontend**: React (Vite) + Recharts
- **LLM**: Google Gemini (`gemini-2.5-flash`)

> **Note on database**: The assignment suggested SQLite as the default, which is
> exactly what was used here — no MongoDB/MERN substitution was needed.

---

## 1. How to Run Locally

### Prerequisites
- Node.js (v18+)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (copy from `.env.example`):

GEMINI_API_KEY=your_gemini_api_key_here

PORT=5000



Seed the database (one-time, loads the CSV into SQLite):

```bash
node seed.js
```

This creates `backend/data.db` and loads all rows from `data/novabite_sales_data.csv`.

Start the backend server:

```bash
node server.js
```

Server runs on `http://localhost:5000`.

### Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Open this URL in your browser.

> Make sure the backend server is running on port 5000 before using the frontend
> — the Dashboard and Chat pages call it directly.

---

## 2. Which LLM Was Used and Why

**Google Gemini (`gemini-2.5-flash`)** was used.

Initially Anthropic's Claude API was the first choice, but the free-tier signup
required a credit card in this region. Gemini via Google AI Studio offered a
free API key without a card, with generous enough rate limits for this assignment's
scope (a handful of test questions). `gemini-2.5-flash` was chosen specifically
because the default `gemini-2.0-flash` model returned a `429` quota error
(`limit: 0`) on this account's free tier, while `2.5-flash` worked reliably.

---

## 3. How the Prompt is Structured in `/api/chat`

Rather than sending the entire 1,000-row dataset to the LLM (which would be
token-expensive and could lead to inaccurate aggregation by the model), the
backend **pre-aggregates the data using SQL** before calling the LLM. This is a
lightweight RAG-style ("Retrieval-Augmented Generation") approach.

When `/api/chat` receives a question, `buildDataContext()` runs several SQL
aggregation queries against SQLite and compiles the results into a structured
text block, including:

- Region-wise total net revenue
- Category-wise net revenue and gross profit margin
- Channel-wise total net revenue
- Region-wise net revenue broken down by quarter
- Sales rep units sold, broken down by year
- Top-performing product per region (by net revenue)

This text block is then combined with the user's question into a single prompt:

QUESTION: <user's question>
ANSWER:

This grounds the model's response in actual computed numbers from the database,
rather than relying on the model to "do math" over raw rows, and keeps the
prompt compact regardless of dataset size.

All 5 example questions from the assignment were manually tested and returned
correct, data-grounded answers.

---

## 4. What I Would Improve With More Time

- **Streaming responses**: Implement a typewriter-style streaming effect for
  the chat answer (Gemini supports streaming) instead of waiting for the full
  response.
- **More dynamic context selection**: Currently all aggregation categories are
  always included in the prompt context, even if irrelevant to the question.
  A better approach would be to first classify the question's intent (e.g.
  "region comparison", "product performance") and only pull the relevant
  aggregations — reducing token usage further.
- **Conversation history**: The chat currently treats each question
  independently. Adding multi-turn memory would allow follow-up questions
  like "what about Q2?".
- **Unit tests**: Add tests for the `buildDataContext()` SQL aggregation logic
  to catch regressions if the schema changes.
- **Second chart**: Add a category/region revenue breakdown chart (bar chart)
  on the dashboard.
- **Input validation & rate limiting**: `/api/chat` currently has minimal
  validation; production use would need rate limiting to avoid LLM API abuse.
- **Better error states**: Frontend error handling is minimal — a retry button
  and more descriptive error messages would improve UX.

---

## 5. Tradeoffs and Shortcuts Taken

- **Gemini instead of Claude/OpenAI**: Due to free-tier card requirements on
  Anthropic/OpenAI in this region, Google Gemini was used instead. The
  integration pattern (build context → call LLM → return answer) would be
  nearly identical with either provider.
- **Inline styles instead of a CSS framework**: To keep the frontend simple
  and dependency-light, components use inline styles rather than
  Tailwind/Material UI. This keeps the bundle small but isn't ideal for a
  larger app.
- **No authentication**: This is a single-user demo; no login/auth was
  implemented since it wasn't part of the requirements.
- **Static data context for all questions**: As noted above, the same
  aggregation context is sent for every question regardless of relevance.
  This is simple and reliable but not the most token-efficient approach.
- **No Docker setup**: `docker-compose.yml` was not implemented (listed as
  optional in the assignment) due to time constraints; local setup via
  npm is documented above instead.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | Distinct products with total net revenue and units sold |
| GET | `/api/summary` | Top-level KPIs: total net revenue, units, gross margin %, top region/channel/product |
| GET | `/api/trends` | Monthly net revenue aggregated for chart rendering |
| POST | `/api/chat` | Accepts `{ "question": "..." }`, returns `{ "answer": "..." }` |

## Project Structure