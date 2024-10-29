# CDP CDK NFT Deployment Tool

A full-stack application for deploying NFTs using Coinbase Developer Platform (CDP) SDK and Pinata IPFS storage.

## Features
- Upload NFT metadata to IPFS via Pinata
- Deploy ERC-721 and ERC-1155 smart contracts
- Real-time deployment status tracking
- Automatic wallet creation and funding

## Setup

## How It Works

The Next.js frontend is mapped to a Flask backend for API interactions, ideal for running Python-based processes (like contract deployments) alongside a modern frontend. The configuration uses `next.config.js` rewrites to map `/api/:path*` requests to the Flask server running on a specified port.

On localhost, the Flask server listens on `127.0.0.1:5328`. In production, Flask functions are hosted as Python serverless functions on Vercel.

## Demo

### Install the Dependencies
```bash
npm install
# or
yarn
#or
pnpm install

```

### Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_PINATA_JWT=Your Pinata JWT token
NEXT_PUBLIC_PINATA_GATEWAY=Your Pinata gateway URL
```

#### Backend (.env)
```
CDP_API_KEY_NAME=Your CDP API key name
CDP_API_PRIVATE_KEY=Your CDP private key
```

## Usage
1. Fill in NFT metadata
2. Upload to IPFS
3. Select contract type (ERC-721 or ERC-1155)
4. Deploy and monitor progress
5. View on BaseScan when complete