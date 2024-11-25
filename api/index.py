from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from cdp import Cdp, Wallet
import time
import traceback

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

CDP_API_KEY_NAME = os.getenv('CDP_API_KEY_NAME')
CDP_API_PRIVATE_KEY = os.getenv('CDP_API_PRIVATE_KEY')
PINATA_API_KEY = os.getenv('PINATA_API_KEY')
PINATA_SECRET_API_KEY = os.getenv('PINATA_SECRET_API_KEY')



# Configure CDP SDK
if not CDP_API_KEY_NAME or not CDP_API_PRIVATE_KEY:
    print("Missing CDP API credentials in environment variables")
    raise EnvironmentError("CDP API credentials are required.")

Cdp.configure(CDP_API_KEY_NAME, CDP_API_PRIVATE_KEY)

deployment_status = {
    "step": "",
    "status": ""
}

def update_deployment_status(step, status):
    deployment_status["step"] = step
    deployment_status["status"] = status
    print(f"Status Update: {step} - {status}")

def create_funded_wallet():
    """Creates and funds a wallet according to CDP SDK documentation."""
    max_retries = 3
    retry_delay = 5

    try:
        update_deployment_status("Creating new wallet on Base Sepolia...", "loading")
        wallet = Wallet.create(network_id="base-sepolia")
        print(f"Created wallet: {wallet.default_address.address_id}")

        initial_balance = float(wallet.balance("eth"))
        if initial_balance >= 0.01:
            update_deployment_status("Wallet funded successfully.", "complete")
            return wallet

        update_deployment_status("Requesting testnet ETH from faucet...", "loading")
        
        for attempt in range(max_retries):
            try:
                wallet.faucet()
                time.sleep(10)  # Wait for faucet transaction
                
                current_balance = float(wallet.balance("eth"))
                if current_balance >= 0.01:
                    update_deployment_status("Wallet funded successfully.", "complete")
                    return wallet
                
            except Exception as e:
                print(f"Faucet attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                else:
                    raise Exception("Failed to fund wallet after multiple attempts")

        raise Exception("Failed to receive sufficient testnet ETH")

    except Exception as e:
        error_msg = str(e)
        print(f"Error in create_funded_wallet: {error_msg}")
        update_deployment_status("Creating new wallet on Base Sepolia...", "error")
        raise Exception(error_msg)


@app.route('/api/deploy', methods=['POST'])
def deploy_contract():
    try:
        data = request.get_json()
        print("\nReceived deployment request:", data)

        wallet = create_funded_wallet()
        if not wallet:
            return jsonify({"success": False, "error": "Failed to create wallet with sufficient funds"}), 500

        deployed_contract = None
        max_retries = 3

        try:
            update_deployment_status("Deploying contract...", "loading")

            for attempt in range(max_retries):
                try:
                    if data['type'] == "ERC721":
                        # Base URI should be ipfs://<hash>/ - contract will append tokenId
                        base_uri = data['baseUri']
                        if not base_uri.endswith('/'):
                            base_uri += '/'
                            
                        deployed_contract = wallet.deploy_nft(
                            name=data['name'],
                            symbol=data['symbol'],
                            base_uri=base_uri
                        )
                        deployed_contract.wait()
                        print(f"ERC721 Contract deployed at: {deployed_contract.contract_address}")

                        # Mint token with ID 1, metadata will be at baseUri/1
                        mint_tx = wallet.invoke_contract(
                            contract_address=deployed_contract.contract_address,
                            method="mint",
                            args={"to": wallet.default_address.address_id}
                        )
                        mint_tx.wait()
                        print("Minted NFT with ID 1")

                    elif data['type'] == "ERC1155":
                        base_uri = data['baseUri']
                        if not base_uri.endswith('/'):
                            base_uri += '/'
                            
                        # Deploy with base URI, contract handles {id} replacement
                        deployed_contract = wallet.deploy_multi_token(uri=base_uri)
                        deployed_contract.wait()
                        print(f"ERC1155 Contract deployed at: {deployed_contract.contract_address}")

                        # Mint tokens with sequential IDs
                        # Each token's metadata will be at baseUri/<tokenId>
                        for token_id in range(1, data.get('tokenCount', 1) + 1):
                            mint_tx = wallet.invoke_contract(
                                contract_address=deployed_contract.contract_address,
                                method="mint",
                                args={
                                    "to": wallet.default_address.address_id,
                                    "id": str(token_id),
                                    "value": "1"
                                }
                            )
                            mint_tx.wait()
                            print(f"Minted token {token_id}")

                    break  # Exit retry loop if successful
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    time.sleep(5)
                    continue

            update_deployment_status("Minting tokens...", "complete")
            return jsonify({
                "success": True,
                "contract_address": deployed_contract.contract_address,
                "wallet_address": wallet.default_address.address_id,
                "wallet_balance": str(wallet.balance("eth")),
                "metadata_mapping": data.get('metadata', {})
            })

        except Exception as deploy_error:
            print(f"Deployment error: {str(deploy_error)}")
            traceback.print_exc()
            update_deployment_status("Deploying contract...", "error")
            return jsonify({
                "success": False, 
                "error": f"Contract deployment failed: {str(deploy_error)}"
            }), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5328, debug=True)
