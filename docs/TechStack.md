## Tech Stack
## Coinbase Developer Platform
Use Coinbase Developer Platfrom as much as possible.
Create Rodeo action for CDP SDK.

## Agent Kit
Build the agent multi swarm system with Coinbase's Agent Kit.
Use the lanchain twitter example to create a twitter agent or build farcsater off of it.
Use this example for front end & ipfs uploads - https://github.com/esteban-cb/cdp-sdk-nft-upload

### Examples
Agentkit quickstart - https://docs.cdp.coinbase.com/agentkit/docs/quickstart
Agentkit github - https://github.com/coinbase/agentkit
OpenAI Swarm, used for multiagent mode in example - https://github.com/openai/swarm

AgentKit Repo Structure
```
./
├── typescript/
│   ├── agentkit/
│   ├── framework-extensions/
│   |   └── langchain/
│   └── examples/
│       ├── langchain-cdp-chatbot/
│       ├── langchain-farcaster-chatbot/
│       └── langchain-twitter-chatbot/
├── python/
│   ├── cdp-agentkit-core/
│   ├── cdp-langchain/
│   ├── twitter-langchain/
│   └── examples/
│       ├── cdp-langchain-chatbot/
│       └── twitter-langchain-chatbot/
```

# based Agent Kit Example - might not be as relevant now.
### Understanding the Code Structure of Based Agent Template
The Based Agent template consists of two main files that work together to create an AI agent with blockchain capabilities:

agents.py - Core Agent Functionality
This file defines all the blockchain-related functions your agent can perform:

#### Core wallet operations
```python
def transfer_asset(amount, asset_id, destination_address):
"""Transfer crypto assets to a specified address"""

def get_balance(asset_id):
"""Check balance of a specific asset"""

# Token and NFT operations
def create_token(name, symbol, initial_supply):
"""Create a new ERC-20 token"""

def deploy_nft(name, symbol, base_uri):
"""Deploy a new NFT collection"""

def mint_nft(contract_address, mint_to):
"""Mint an NFT to a specified address"""

#Identity operations
def register_basename(basename: str, amount: float = 0.002):
"""Register a .base or .basetest domain name"""
```
The agent is initialized with a wallet and a set of functions that can be used to interact with the blockchain. You can add more functions to the agents.py file to extend the agent's capabilities, and you should also add the function to the Agent instance in the agents.py file.

run.py - Agent Operation Modes
This file defines three different ways to interact with your agent:

Chat Mode: Direct interaction through a command line interface
Autonomous Mode: Agent operates independently with a static set of instructions
Two-Agent Mode: Conversation between OpenAI and Based Agent

### Extending Agent Capabilities
You can add new capabilities to your agent by:

Define a new function in agents.py:
```python
def new_function(param1, param2):
"""
Description of what this function does.
Args:
param1 (type): Description
param2 (type): Description
Returns:
str: Status message
"""
try:
# Your implementation
return "Operation successful"
except Exception as e:
return f"Error: {str(e)}"
```

Add the function to the agent's function list:
```python
based_agent = Agent(
name="Based Agent",
instructions="...",
functions=[
# Existing functions...
new_function,
],
)
```

