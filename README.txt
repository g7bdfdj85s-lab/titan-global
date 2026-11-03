TITAN GLOBAL COMMAND v1.0
========================

WHAT THIS IS
A mobile-first Progressive Web App prototype plus a small FastAPI backend scaffold.
It implements a navigable command-centre UI, opportunity concept scoring, portfolio
placeholders, AI role templates, mission board, founder approval queue and a local
learning/evidence log.

IMPORTANT LIMITATIONS
- The frontend currently runs in LOCAL DEMO MODE.
- It does not connect to an AI model, browse live markets, create companies, hire staff,
  send messages, move money, or autonomously operate businesses.
- Opportunity scores are transparent illustrative heuristics, not verified predictions.
- Local demo records are stored in this browser on this device.
- Role cards are role templates, not live autonomous agents.
- The backend is a starter scaffold, not a production service.
- No user authentication, production database, AI provider, payments or integrations
  are configured.
- Never place API keys in frontend JavaScript. Secrets belong on a secured backend.

OPEN ON IPHONE
1. Upload the contents of this folder to a static HTTPS host using a cloud IDE or
   deployment service that supports static websites.
2. Open the published HTTPS address in Safari.
3. Tap Share -> Add to Home Screen.
4. Launch TITAN from the new Home Screen icon.

There is no public URL yet. The ZIP itself cannot be searched for in Safari.

NEXT ENGINEERING PHASES
1. Deploy authenticated backend + persistent database.
2. Add AI provider on the server, tool permissions and audit logging.
3. Connect live research sources with source citations and freshness checks.
4. Add workflow orchestration, task queue, retries and human approval gates.
5. Add finance ledger, budgets, accounting integrations and role-based access.
6. Add evaluated learning: store hypotheses, forecasts, actual outcomes, confidence,
   provenance and model/version changes; require tests and approval before policy updates.
7. Add legal/compliance checks per jurisdiction and business category.

SECURITY PRINCIPLES
- Least privilege.
- Human approval for incorporation, contracts, hiring commitments, payments,
  borrowing, acquisitions, regulated activity and public representations.
- Spending caps and kill switch.
- Full audit trail.
- Separate data and accounts for each subsidiary.
- Do not use unlawful access, deception, spam, market manipulation or competitor sabotage.

BACKEND QUICK START (on a computer/cloud development environment)
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

This only starts the scaffold API. It does not activate AI agents.
