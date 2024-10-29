from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from cdp import Cdp, Wallet
import time

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

CDP_API_KEY_NAME = os.getenv('CDP_API_KEY_NAME')
CDP_API_PRIVATE_KEY = os.getenv('CDP_API_PRIVATE_KEY')

# Configure CDP SDK
if not CDP_API_KEY_NAME or not CDP_API_PRIVATE_KEY:
    raise EnvironmentError("Missing CDP API credentials in environment variables")
Cdp.configure(CDP_API_KEY_NAME, CDP_API_PRIVATE_KEY)

# In-memory storage for deployment status (for demonstration purposes)
deployment_status = {
    "step": "",
    "status": ""
}

def update_deployment_status(step, status):
    deployment_status["step"] = step
    deployment_status["status"] = status

@app.route('/api/deployment_status', methods=['GET'])
def get_deployment_status():
    return jsonify(deployment_status)

def create_funded_wallet():
    """Create a wallet and ensure it has sufficient funds."""
    try:
        update_deployment_status("Creating Wallet", "loading")
        wallet = Wallet.create(network_id="base-sepolia")
        print(f"Created wallet with address: {wallet.default_address}")

        balance = float(wallet.balance("eth"))
        if balance >= 0.01:
            print("Wallet already has sufficient funds.")
            update_deployment_status("Creating Wallet", "complete")
            return wallet

        print("Requesting funds from faucet...")
        update_deployment_status("Requesting ETH from Faucet", "loading")
        wallet.faucet()

        for attempt in range(10):
            print(f"Balance check attempt {attempt + 1}...")
            time.sleep(5)
            balance = float(wallet.balance("eth"))
            if balance >= 0.01:
                print("Sufficient balance received from faucet.")
                update_deployment_status("Requesting ETH from Faucet", "complete")
                return wallet

        print("Failed to acquire sufficient funds.")
        update_deployment_status("Requesting ETH from Faucet", "error")
        return None

    except Exception as e:
        print(f"Error in create_funded_wallet: {e}")
        update_deployment_status("Creating Wallet", "error")
        return None

def wait_for_deployment(deployed_contract, timeout=60):
    """Wait for contract deployment to complete, with a manual timeout."""
    print("Waiting for deployment to complete...")
    start_time = time.time()
    while True:
        try:
            # Check if deployment has completed by verifying contract address
            if deployed_contract.contract_address:
                print(f"Deployment successful! Contract address: {deployed_contract.contract_address}")
                update_deployment_status("Deploying Contract", "complete")
                return True
        except AttributeError:
            print("Contract address not yet available, continuing to wait...")

        # Timeout check
        if time.time() - start_time > timeout:
            print("Deployment timed out.")
            update_deployment_status("Deploying Contract", "error")
            return False

        # Delay between status checks
        time.sleep(5)

@app.route('/api/deploy', methods=['POST'])
def deploy_contract():
    """Deploy a smart contract (ERC721 or ERC1155) and return contract details."""
    try:
        data = request.json
        print(f"Received deployment request: {data}")

        # Step 1: Create Wallet
        wallet = create_funded_wallet()
        if not wallet:
            return jsonify({
                "success": False,
                "error": "Unable to create wallet with sufficient funds."
            }), 400

        # Step 2: Verify Wallet Balance
        final_balance = float(wallet.balance("eth"))
        if final_balance < 0.01:
            update_deployment_status("Requesting ETH from Faucet", "error")
            return jsonify({
                "success": False,
                "error": f"Insufficient balance ({final_balance} ETH) for deployment."
            }), 400

        # Step 3: Deploy Contract
        contract_type = data['type']
        name = data['name']
        symbol = data.get('symbol', 'NFT')
        base_uri = data['baseURI']

        update_deployment_status("Deploying Contract", "loading")
        print("Starting contract deployment...")
        if contract_type == "ERC721":
            deployed_contract = wallet.deploy_nft(name, symbol, base_uri)
        elif contract_type == "ERC1155":
            deployed_contract = wallet.deploy_multi_token(base_uri)
        else:
            update_deployment_status("Deploying Contract", "error")
            return jsonify({"success": False, "error": "Unsupported contract type"}), 400

        # Wait for deployment to complete with manual timeout handling
        if not wait_for_deployment(deployed_contract, timeout=60):  # 60 seconds timeout
            return jsonify({
                "success": False,
                "error": "Smart contract deployment timed out."
            }), 500

        # Step 4: Deployment Complete
        contract_address = deployed_contract.contract_address
        update_deployment_status("Waiting for Confirmation", "complete")

        return jsonify({
            "success": True,
            "contract_address": contract_address,
            "message": "Contract deployed successfully",
            "wallet_address": str(wallet.default_address),
            "wallet_balance": str(final_balance)
        })

    except Exception as e:
        update_deployment_status("Error", "error")
        print(f"\nERROR during deployment: {e}")
        import traceback
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
            "step": "DEPLOYMENT"
        }), 500

if __name__ == '__main__':
    app.run(port=5328)
