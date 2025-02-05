# CDP SDK NFT Deployment Tool

This project provides a template for deploying NFTs on Base Sepolia using the Coinbase Developer Platform (CDP) SDK and Pinata IPFS storage.

You can find the live version of this tool here: [Replit Template](https://replit.com/@CoinbaseDev/NFT-Deployment-Tool?v=1)

## Codebase Structure

### Frontend (`app/page.tsx`)
- Main application logic and UI
- Handles metadata creation and file preparation
- Manages Pinata IPFS uploads via `pinata.upload.fileArray()`
- Creates proper token URI structure for NFT contracts

### Backend (`api/index.py`)
- Flask server implementation
- Integrates CDP SDK for contract deployment
- Handles wallet creation and funding
- Manages contract deployment and token minting
- Processes both ERC-721 and ERC-1155 deployments

### Configuration Files
- `utils/pinataConfig.ts`: Pinata SDK setup and type definitions
- `.env`: Environment variables for both frontend and backend
- `next.config.ts`: Next.js configuration including API routes

## Features

- Deploy ERC-721 and ERC-1155 NFT smart contracts
- Upload and manage token metadata through IPFS via Pinata
- Support for both single and multi-token collections
- Proper token URI structure with `<base-uri>/<token-id>` format
- Automatic token minting post-deployment
- Real-time deployment progress tracking
- Testnet ETH funding via CDP faucet

## Implementation Details

### Metadata Storage
- Located in: `app/page.tsx` (metadata creation and Pinata upload)
- Files are uploaded using Pinata's `fileArray()` function
- Each token's metadata file is named numerically (e.g., `1`, `2`, `3`)
- No file extensions are used as per IPFS best practices

### Contract Deployment
- Located in: `api/index.py` (CDP SDK integration)
- Base URI format: `ipfs://<hash>/`
- Token URIs are automatically constructed as `<base-uri>/<token-id>`
- ERC-721: Single token minted with ID 1
- ERC-1155: Sequential tokens minted based on collection size

## Set Up on Replit

1. **Clone the Repo**: Click “Use Template” or “Fork” this repository to your Replit account.

2. **Provision API Keys**:
   - **CDP API Key**: Create an API key on the [Coinbase Developer Platform](https://developer.coinbase.com/).
   - **Pinata API Keys**: Obtain your JWT and gateway settings from [Pinata](https://pinata.cloud/).

3. **Set Environment Variables**:
   - Open the **Secrets** panel in Replit.
   - Add the following secrets:

      - `CDP_API_KEY_NAME`: Your CDP API key name
      - `CDP_API_PRIVATE_KEY`: Your CDP private key
      - `NEXT_PUBLIC_PINATA_JWT`: Your Pinata JWT token
      - `NEXT_PUBLIC_PINATA_GATEWAY`: Your Pinata gateway URL

4. **Install Dependencies**:
   - Run the following in the Replit shell or ensure they’re in the `replit.nix` file if needed:

    ```bash
    npm install
    # or
    yarn
    # or
    pnpm install
    ```

5. **Run Development Server**:
   - Start the server with:

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

1. Enter metadata for one or more tokens (name, description, image URL, attributes)
2. Select contract type (ERC-721 for single tokens or ERC-1155 for multi-token collections)
3. Deploy contract - this will:
   - Upload metadata to IPFS with proper token ID structure
   - Create and fund a testnet wallet
   - Deploy the contract with correct base URI
   - Mint tokens automatically
4. View deployed contract and token metadata on BaseScan/IPFS

## Development and Contributions

Feel free to submit issues or pull requests. For feature requests specific to the CDP SDK, use the [CDP SDK Discord Channel](https://discord.gg/cdpsdk).

## Resources

- [Coinbase Developer Platform Documentation](https://docs.cdp.coinbase.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Project GitHub Repository](https://github.com/esteban-cb/cdp-sdk-nft-upload)
- [Replit Template](https://replit.com/@CoinbaseDev/NFT-Deployment-Tool?v=1)


**Disclaimer**: This application is for educational purposes. Adapt and secure before production use.


## Run / Install locally

Install Node.js Dependencies
```bash
npm install
```
Install Python Dependencies
```bash
# Create a virtual environment (recommended)
python3 -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r api/requirements.txt
```

Run the development server
```bash
npm run dev
```
