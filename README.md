# Conflict Resolution Frontend

A beautiful React web application for father-son conflict resolution, featuring a guided conversation flow with AI-powered suggestions.

## Features

- 🎭 **Role Selection**: Choose between Father or Son to initiate the conversation
- 💬 **Conflict Input**: Describe the situation with emotion selection
- 🤔 **Reflection Questions**: AI-generated empathetic questions for deeper understanding
- ✉️ **Framed Messages**: Constructive message suggestions for the other party
- 🤝 **Resolution View**: Dual perspective view with personalized resolution suggestions

## Flow

1. **Select Role** → Father or Son chooses to start
2. **Describe Conflict** → Input what happened and current emotion
3. **Reflection Phase** → Answer AI-generated questions (3 questions)
4. **Waiting Room** → Message sent to other party
5. **Other Party Reflects** → Non-initiator answers questions
6. **Resolution View** → Both perspectives shown with actionable suggestions

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Backend Requirement

Make sure the backend API is running at `http://localhost:8000`

```bash
# In the backend directory
python server.py
```

## Project Structure

```
conflict-resolution-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RoleSelection.js
│   │   ├── ConflictInput.js
│   │   ├── ReflectionQuestions.js
│   │   ├── WaitingRoom.js
│   │   └── ResolutionView.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── RoleSelection.css
│   │   ├── ConflictInput.css
│   │   ├── ReflectionQuestions.css
│   │   ├── WaitingRoom.css
│   │   └── ResolutionView.css
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Technologies

- **React 18**: UI framework
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations

## Design Features

- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Intuitive user flow
- Empathetic UI/UX design

## API Integration

The app connects to these backend endpoints:

- `POST /api/conflict/topic-selection`
- `POST /api/conflict/reflection-question/initial`
- `POST /api/conflict/reflection-question/follow-up`
- `POST /api/conflict/framing`
- `POST /api/conflict/resolution-suggestions`

## Development

```bash
# Run in development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## License

Private - Selvester Project
