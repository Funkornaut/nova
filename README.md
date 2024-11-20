# CDP SDK NFT Deployment Tool

This project provides a template for deploying NFTs on Base Sepolia using the Coinbase Developer Platform (CDP) SDK and Pinata IPFS storage. This setup enables efficient NFT contract deployment and metadata storage.

**NOTE:** This sample app is for demonstration purposes. Ensure to securely manage your private keys and limit any exposure to testnet funds only. In production, follow best practices like IP whitelisting and encrypted storage of private keys.

## Features

- Deploy ERC-721 and ERC-1155 NFT smart contracts
- Upload and manage token metadata through IPFS via Pinata
- Support for both single and multi-token collections
- Proper token URI structure with `<base-uri>/<token-id>` format
- Automatic token minting post-deployment
- Real-time deployment progress tracking
- Testnet ETH funding via CDP faucet

## Feature Requests

If you'd like to see specific functionalities added to the CDP SDK, feel free to submit an issue. You can also reach out via the [CDP SDK Discord Channel](https://discord.gg/cdpsdk).

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

## Technical Notes

- Metadata is stored on IPFS with individual token URIs in format `<base-uri>/<token-id>`
- ERC-721 deployments mint a single token with ID 1
- ERC-1155 deployments mint sequential tokens based on collection size
- Base URI points to IPFS directory containing all token metadata

---

For further guidance, consult:
- [Coinbase Developer Platform Documentation](https://docs.cdp.coinbase.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)

**Disclaimer**: This application is for educational purposes. Adapt and secure before production use.