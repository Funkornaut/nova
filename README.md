# CDP SDK NFT Deployment Tool

This project provides a template for deploying NFTs on Base Sepolia using the Coinbase Developer Platform (CDP) SDK and Pinata IPFS storage. This setup enables efficient NFT contract deployment and metadata storage.

**NOTE:** This sample app is for demonstration purposes. Ensure to securely manage your private keys and limit any exposure to testnet funds only. In production, follow best practices like IP whitelisting and encrypted storage of private keys.

## Features

- Upload NFT metadata to IPFS via Pinata
- Deploy ERC-721 and ERC-1155 NFT smart contracts
- Real-time tracking of deployment progress
- Automatic wallet creation and funding with testnet ETH on Base Sepolia

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
1. Enter NFT metadata in the frontend form.
2. Upload metadata to IPFS via the "Upload" button.
3. Select contract type (ERC-721 or ERC-1155).
4. Click "Deploy" to deploy the contract and monitor progress.
5. View the deployed contract on BaseScan when complete.

---

For further guidance, consult:
- [Coinbase Developer Platform Documentation](https://docs.cdp.coinbase.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)

**Disclaimer**: This application is for educational purposes. Adapt and secure before production use.