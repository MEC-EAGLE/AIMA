# AIMA Community App

This is a small demo app built with React and Vite. The project simulates a community platform with members and organizations. Members can join groups, chat with each other, and apply for opportunities posted by organizations.

## Features

- Register as a member or organization with optional profile photo upload.
- Direct messages with invite system similar to Instagram DMs.
- WhatsApp‑style group chats supporting file attachments and member invites.
- Organizations can create job posts, view applicants, and message them directly.
- Dashboard to manage your profile, groups, notes, and other information.
- Simple JSON file database served via a small Node server.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local database API:
   ```bash
   npm run server
   ```
3. In a separate terminal, start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

The app stores all data in `db.json` under `myapp/`. The server runs on port `3001` by default.

## Testing

The project currently includes a placeholder test script:

```bash
npm test
```

which will simply print that no tests are implemented.

---

This repository was populated with features during prior pull requests, including profile pictures, expanded chat windows, DM invites, and group invite handling.
