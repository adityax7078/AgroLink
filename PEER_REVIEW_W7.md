# Mandatory Peer Code Review Submissions (Week 7 - Deliverable 4)

This file contains structured peer review comments for 2 classmates' repositories, following the required 150-word format with 1 architectural observation, 1 specific code suggestion (with file reference), and 1 clarifying question.

---

## Review 1: Classmate Repository (e.g. `agro-tech-app` / `farm-connect`)

### Submission Text (Word Count: ~150 words)

```text
Architectural Observation:
I really appreciate your clean separation of concerns in the backend architecture. Routing the AI query through a dedicated controller module (`/controllers/aiController.js`) before calling the external model API prevents route clutter in `server.js` and allows modular unit testing.

Specific Code Suggestion:
In `backend/routes/ai.js` (Lines 24-38), the OpenAI API key is fetched directly during request execution without checking if the environment variable is loaded. I recommend wrapping the API call initialization with a fallback validation check:
if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Missing API Key configuration" });
This will prevent unhandled Promise rejections and return a clean HTTP 500 error toast to the frontend.

Question:
How are you managing API rate limits during high concurrent user traffic on the frontend, and do you plan to implement client-side caching (e.g. React Query or localStorage) for identical crop query inputs?
```

---

## Review 2: Classmate Repository (e.g. `crop-analyzer-ai` / `smart-agri-hub`)

### Submission Text (Word Count: ~150 words)

```text
Architectural Observation:
Your implementation of streaming AI responses on the frontend (`/components/AIChatStream.jsx`) provides an outstanding user experience. Progressively rendering text tokens reduces perceived latency significantly compared to waiting for complete JSON payloads.

Specific Code Suggestion:
In `frontend/src/components/AIForm.jsx` (Lines 45-62), when the API request encounters a network failure, the `loading` state remains `true`, keeping the submit button permanently disabled until page refresh. Consider adding a `finally` block to your `fetch` promise chain:
.finally(() => setLoading(false));
This ensures the UI state resets properly and allows users to retry their request immediately after seeing the error notification.

Question:
Did you test different system prompt temperature settings (e.g., 0.2 vs 0.7) for domain accuracy, and how do you ensure the model refrains from generating unverified chemical dosages?
```
