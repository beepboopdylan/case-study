# PartSelect Chatbot Assistant

An intelligent chatbot that helps users find, install, and troubleshoot refrigerator and dishwasher parts. Built with React, it understands natural language queries and provides relevant part information, compatibility checks, installation instructions, and troubleshooting suggestions.

## Features

- **Part Lookup** - Find parts by part number
- **Compatibility Checking** - Verify parts work with specific models
- **Installation Instructions** - Step-by-step installation guides
- **Troubleshooting** - Get suggestions for common appliance issues
- **Product Ratings** - See ratings and reviews for parts
- **Sponsored Content** - Prioritized sponsored parts (with clear labeling)
- **Natural Language** - Understands conversational queries

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

## Usage Examples

- **Installation:** "How do I install PS11752778?"
- **Compatibility:** "Is PS11752778 compatible with WDT780SAEM1?"
- **Troubleshooting:** "My refrigerator ice maker is not working"
- **Part Info:** "Tell me about PS11752778"

## Project Structure

```
src/
├── agent/          # Core agent logic (intent detection, processing)
├── api/            # API layer
├── components/     # React components (ChatWindow)
└── utils/          # Utilities (security, helpers)
```
