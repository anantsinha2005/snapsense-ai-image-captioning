# Project 12 — SnapSense AI Image Captioning

**Anant Sinha presents SnapSense AI**, a responsive image captioning and visual analysis web app powered by Google Gemini.

## Features
- Upload or drag-and-drop JPG, PNG, or WEBP images (up to 8MB)
- AI captions in Short, Detailed, Accessibility, or Creative styles
- Visible details list
- Preview selected image, remove/reselect, copy output
- Express backend and API key stored server-side in `.env`

## Stack
Node.js, Express, Multer, Google GenAI SDK, vanilla HTML/CSS/JavaScript.

## Setup
1. Install Node.js.
2. In the project folder, run `npm install`.
3. Copy `.env.example` to `.env` and add your Gemini API key.
4. Run `npm start`.
5. Visit `http://localhost:4000`.


## Environment
`GEMINI_API_KEY=your_key_here`
`GEMINI_MODEL=gemini-2.5-flash`
`PORT=4000`

The app uses memory upload storage and does not persist uploaded images to disk.
