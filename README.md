# Lanternade

Lanternade is a social video platform built on Farcaster, leveraging Livepeer Video, Livepeer AI, and Neynar API to provide a rich, interactive experience for content creators and viewers.

## Features

- Farcaster client with For You Feed, rich information display (recasts, follow, unfollow, reactions), and profile pages
- Video upload and playback using Livepeer Video
- AI-powered content generation using Livepeer AI pipelines
- Interaction with Farcaster social graph via Neynar API
- Livestreaming support using OBS and Livepeer
- Dynamic URLs for viewing livestreams
- Farcaster Frames support with handling of post, link, and post_redirect actions
- Rendering and interaction with Farcaster Frames

## Technologies Used

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Livepeer Video and AI
- Neynar API
- Rainbow Wallet (for future integrations)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- Yarn package manager
- A Neynar API key
- A Livepeer API key
- A WalletConnect project ID (for future wallet integrations)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
NEYNAR_API_KEY=your_neynar_api_key
LIVEPEER_API_KEY=your_livepeer_api_key
LIVEPEER_AI_API_KEY=your_livepeer_ai_api_key
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

Replace `your_*` with your actual API keys and project IDs.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/lanternade.git
   cd lanternade
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Run the development server:
   ```
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Next.js app router pages and API routes
- `components/`: React components
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and API helpers
- `types/`: TypeScript type definitions
- `utils/`: Miscellaneous utility functions

## State Management and Data Fetching
- The project uses TanStack Query (React Query) for state management and data fetching.

## Authentication
- Authentication is handled using the Neynar API, with Neynar sponsored signers using Sign in With Neynar (SIWN).

## Key Components

- `Navbar`: Main navigation component
- `CastCard`: Displays individual Farcaster casts
- `CreateCast`: Component for creating new casts
- `AICreatorStudio`: Interface for AI-powered content creation
- `VideoUploader`: Component for uploading videos to Livepeer
- `PlayerWithControls`: Custom video player component utilizing Livepeer primitives

## API Routes

### Farcaster-related routes:
- `/api/farcaster/cast`: GET and POST endpoints for retrieving and creating casts
- `/api/farcaster/feed`: GET endpoint for fetching the user's feed
- `/api/farcaster/follow`: POST and DELETE endpoints for following/unfollowing users
- `/api/farcaster/reaction`: POST and DELETE endpoints for adding/removing reactions to casts
- `/api/farcaster/replies`: GET endpoint for fetching replies to a cast
- `/api/farcaster/user-casts`: GET endpoint for fetching a user's casts
- `/api/farcaster/user-replies`: GET endpoint for fetching a user's replies
- `/api/farcaster/user`: GET endpoint for fetching user information

### AI-related routes:
- `/api/ai/audio-to-text`: POST endpoint for transcribing audio to text
- `/api/ai/image-to-image`: POST endpoint for image-to-image transformation
- `/api/ai/image-to-video`: POST endpoint for generating video from an image
- `/api/ai/text-to-image`: POST endpoint for generating images from text prompts

### Livestream-related routes:
- `/api/livestream/create`: POST endpoint for creating a new livestream
- `/api/asset-status`: GET endpoint for checking the status of an uploaded asset
- `/api/get-playback-source`: GET endpoint for retrieving playback sources

### Other utility routes:
- `/api/request-upload`: POST endpoint for requesting an upload URL for assets
- `/api/frame-action`: POST endpoint for handling Farcaster Frame actions

These API routes form the backbone of Lanternade's functionality, enabling interactions with the Farcaster network, AI-powered content creation, livestreaming capabilities, and more.

## Deployment

The project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy your main branch.

## Future Goals

- Decentralized storage for video content
- Live clipping, comments, and on-chain interactions with livestreams
- On-chain Farcaster Frame interactions
- Decentralized storage for livestreaming content
- On-chain tipping and minting of clips in livestreams through Zora
- Token-gated content using Lit Protocol
- LLM generated content generation for direct casts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
