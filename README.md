# Digital Law Village 

A simple landing page showcasing CustoCare AI built with Next.js and Vapi.

## Features

- **AI Voice Agent**: Powered by Vapi for natural voice conversations
- **Mobile Responsive**: Clean, modern design that works on all devices  
- **Simple Integration**: Easy to embed and customize
- **24/7 Availability**: Always-on customer support experience

## Tech Stack

- Next.js 
- TypeScript
- Tailwind CSS
- Vapi 

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## File Structure

```
├── page.tsx          # Main page component
├── layout.tsx        # Layout
└── components    
    ├── featureCard.tsx        
    ├── hero.tsx          
    ├── VoiceAgentsButton.tsx # Renders the button and handles UI state.
├── lib
    ├── vapiService.ts  # Handles the Vapi instance and manages backend logic
    ├── vapiService.ts  # Kindly ignore 

```

## Usage

- The voice agent button is centered on the page, between the hero content and feature cards. Users can click it to start or end voice conversations with the Custocare AI Agent. 

- The button dynamically updates its label and color based on connection and speaking status.

# Digital_law_village
