"use client";

import { useState } from "react";
import { pinata, PINATA_GATEWAY } from "@/utils/pinataConfig";
import { UploadResponse } from "@/utils/pinataConfig";

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  attributes: string;
}

interface TokenMetadataDirectory {
  [key: string]: {
    name: string;
    description: string;
    image: string;
    attributes: any;
  };
}

interface TokenURIs {
  ipfs: string;
  gateway: string;
}

interface DeploymentStep {
  message: string;
  status: "pending" | "loading" | "complete" | "error";
}

const DeploymentStatus = ({ steps }: { steps: DeploymentStep[] }) => {
  return (
    <div className="w-full max-w-md bg-white p-6 mt-6 rounded-lg shadow-md">
      <h3 className="font-bold mb-4 text-gray-800">Deployment Progress</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {step.status === "pending" && (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3" />
            )}
            {step.status === "loading" && (
              <div className="w-4 h-4 mr-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
            {step.status === "complete" && (
              <svg
                className="w-4 h-4 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {step.status === "error" && (
              <svg
                className="w-4 h-4 mr-3 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={`
              ${step.status === "complete" ? "text-green-700" : ""}
              ${step.status === "loading" ? "text-blue-700" : ""}
              ${step.status === "error" ? "text-red-700" : ""}
              ${step.status === "pending" ? "text-gray-400" : ""}
            `}
            >
              {step.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function Home() {
  const [tokenCount, setTokenCount] = useState(1);
  const [baseUri, setBaseUri] = useState("");
  const [tokens, setTokens] = useState<TokenMetadata[]>([
    {
      name: "",
      description: "",
      image: "",
      attributes: "",
    },
  ]);
  const [deploying, setDeploying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAttributeInfo, setShowAttributeInfo] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [metadata_mapping, setMetadataMapping] = useState<Record<string, TokenURIs>>({});

  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { message: "Creating new wallet on Base Sepolia...", status: "pending" },
    {
      message: "Requesting testnet ETH from faucet (this may take a few minutes)...",
      status: "pending",
    },
    { message: "Uploading metadata to IPFS...", status: "pending" },
    { message: "Deploying contract...", status: "pending" },
    { message: "Minting tokens...", status: "pending" },
    { message: "Waiting for confirmation...", status: "pending" },
  ]);

  const handleTokenChange = (
    index: number,
    field: keyof TokenMetadata,
    value: string
  ) => {
    setTokens((prevTokens) => {
      const newTokens = [...prevTokens];
      newTokens[index] = {
        ...newTokens[index],
        [field]: value,
      };
      return newTokens;
    });
  };

  const addToken = () => {
    setTokens((prevTokens) => [
      ...prevTokens,
      {
        name: "",
        description: "",
        image: "",
        attributes: "",
      },
    ]);
    setTokenCount((prev) => prev + 1);
  };

  const removeToken = (index: number) => {
    if (tokens.length > 1) {
      setTokens((prevTokens) => prevTokens.filter((_, i) => i !== index));
      setTokenCount((prev) => prev - 1);
    }
  };

  const populateERC721 = () => {
    setTokens([
      {
        name: "Sample ERC721 NFT #1",
        description:
          "This is an example metadata for an ERC721 NFT collection. It represents a unique digital asset with various attributes.",
        image:
          "https://ipfs.io/ipfs/QmZmcuY31kTMqQKFkRgAkTZM7xCkYL8XGgJrCTQbh6WFQt",
        attributes: JSON.stringify(
          [
            { trait_type: "Base", value: "Starfish" },
            { trait_type: "Eyes", value: "Big" },
            { trait_type: "Level", value: 5 },
            { trait_type: "Stamina", value: 1.4 },
            { trait_type: "Personality", value: "Sad" },
            { trait_type: "Aqua Power", value: 40 },
          ],
          null,
          2
        ),
      },
    ]);
    setTokenCount(1);
  };

  const populateERC1155 = () => {
    setTokens([
      {
        name: "Mythical Sword",
        description:
          "A powerful mythical sword imbued with ancient magic. This legendary weapon has been passed down through generations of warriors.",
        image:
          "https://ipfs.io/ipfs/QmZmcuY31kTMqQKFkRgAkTZM7xCkYL8XGgJrCTQbh6WFQt",
        attributes: JSON.stringify(
          [
            { trait_type: "Material", value: "Dragon Steel" },
            { trait_type: "Durability", value: 100 },
            { trait_type: "Damage", value: 150 },
            { trait_type: "Level Required", value: 50 },
            { trait_type: "Element", value: "Fire" },
          ],
          null,
          2
        ),
      },
      {
        name: "Magic Shield",
        description:
          "An enchanted shield that provides exceptional protection. Its magical properties ward off both physical and magical attacks.",
        image:
          "https://ipfs.io/ipfs/QmZmcuY31kTMqQKFkRgAkTZM7xCkYL8XGgJrCTQbh6WFQt",
        attributes: JSON.stringify(
          [
            { trait_type: "Material", value: "Enchanted Gold" },
            { trait_type: "Durability", value: 200 },
            { trait_type: "Defense", value: 120 },
            { trait_type: "Level Required", value: 45 },
            { trait_type: "Element", value: "Light" },
          ],
          null,
          2
        ),
      },
    ]);
    setTokenCount(2);
  };


  const deployContract = async (type: "ERC721" | "ERC1155") => {
    const updateStep = (index: number, status: DeploymentStep["status"]) => {
      setDeploymentSteps((current) =>
        current.map((step, i) => (i === index ? { ...step, status } : step))
      );
    };
  
    try {
      setDeploying(true);
      setErrorMessage("");
      setDeployedAddress("");
      setWalletAddress("");
      setWalletBalance("");
      setMetadataMapping({});
  
      setDeploymentSteps((current) =>
        current.map((step) => ({ ...step, status: "pending" }))
      );
  
      // Validation
      if (!tokens.length) throw new Error("Please add at least one token.");
      tokens.forEach((token) => {
        if (!token.name || !token.description || !token.image || !token.attributes)
          throw new Error("All fields are required for each token.");
        try {
          JSON.parse(token.attributes);
        } catch {
          throw new Error("Invalid JSON format in attributes.");
        }
      });
  
      updateStep(2, "loading");
  
      // Create metadata files with proper numeric filenames
      const metadataFiles = tokens.map((token, index) => {
        const metadata = {
          name: token.name,
          description: token.description,
          image: token.image,
          attributes: JSON.parse(token.attributes),
        };
  
        const blob = new Blob([JSON.stringify(metadata, null, 2)], {
          type: "application/json",
        });
  
        // Remove .json extension as per requirements
        return new File([blob], `${index + 1}`, {
          type: "application/json",
        });
      });
  
      console.log("Uploading metadata files:", metadataFiles);
  
      // Upload files as folder using fileArray
      const upload = await pinata.upload.fileArray(metadataFiles);
      console.log("Pinata upload response:", upload);
  
      if (!upload.IpfsHash) {
        throw new Error("Failed to get IPFS hash from upload");
      }
  
      // Construct base URI with ipfs:// protocol
      const baseUri = `ipfs://${upload.IpfsHash}/`;
      console.log("Base URI:", baseUri);
  
      // Create metadata mapping for display purposes
      const metadataMapping: Record<string, TokenURIs> = {};
      tokens.forEach((_, index) => {
        const tokenId = index + 1;
        metadataMapping[tokenId] = {
          ipfs: `${baseUri}${tokenId}`,
          gateway: `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}/${tokenId}`
        };
      });
  
      setBaseUri(baseUri);
      setMetadataMapping(metadataMapping);
  
      updateStep(2, "complete");
      updateStep(3, "loading");
  
      // Send deployment request
      const deploymentData = {
        type,
        name: type === "ERC721" ? "My NFT Collection" : "My Multi Token Collection",
        symbol: type === "ERC721" ? "NFT" : "MT",
        baseUri, // Send ipfs:// URI to contract
        tokenCount: tokens.length
      };
  
      console.log("Sending deployment data:", deploymentData);
  
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deploymentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to deploy contract");
      }
  
      const data = await response.json();
      updateStep(3, "complete");
      updateStep(4, "complete");
      updateStep(5, "complete");
  
      setDeployedAddress(data.contract_address);
      setWalletAddress(data.wallet_address);
      setWalletBalance(data.wallet_balance);
  
    } catch (error: any) {
      console.error("Deployment error:", error);
      setErrorMessage(
        typeof error === "string" ? error : error.message || "Failed to deploy contract"
      );
      setDeploymentSteps((current) =>
        current.map((step) =>
          step.status === "loading" ? { ...step, status: "error" } : step
        )
      );
    } finally {
      setDeploying(false);
    }
  };


  return (
    <main className="w-full min-h-screen p-8 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        CDP SDK NFT Collection Deployment Tool
      </h1>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={populateERC721}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            disabled={deploying}
          >
            Use ERC721 Example
          </button>
          <button
            onClick={populateERC1155}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
            disabled={deploying}
          >
            Use ERC1155 Example
          </button>
        </div>

        {tokens.map((token, index) => (
          <div key={index} className="mb-8 p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Token #{index + 1}</h3>
              {tokens.length > 1 && (
                <button
                  onClick={() => removeToken(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Token
                </button>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Token Name:
                </label>
                <input
                  type="text"
                  value={token.name}
                  onChange={(e) =>
                    handleTokenChange(index, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
                  disabled={deploying}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Description:
                </label>
                <textarea
                  value={token.description}
                  onChange={(e) =>
                    handleTokenChange(index, "description", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
                  disabled={deploying}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Image URL:
                </label>
                <input
                  type="text"
                  value={token.image}
                  onChange={(e) =>
                    handleTokenChange(index, "image", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
                  disabled={deploying}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Attributes (JSON):
                </label>
                <textarea
                  value={token.attributes}
                  onChange={(e) =>
                    handleTokenChange(index, "attributes", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder='[{"trait_type": "Base", "value": "Starfish"}]'
                  disabled={deploying}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addToken}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
          disabled={deploying}
        >
          Add Another Token
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => deployContract("ERC721")}
            className={`bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 ${
              deploying ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
            disabled={deploying}
          >
            Deploy as ERC-721
          </button>
          <button
            onClick={() => deployContract("ERC1155")}
            className={`bg-purple-500 text-white px-4 py-2 rounded-lg transition duration-200 ${
              deploying
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-600"
            }`}
            disabled={deploying}
          >
            Deploy as ERC-1155
          </button>
        </div>
      </div>

      {deploying && <DeploymentStatus steps={deploymentSteps} />}

      {deployedAddress && (
        <div className="w-full max-w-3xl bg-green-100 p-6 mt-6 rounded-lg shadow-md">
          <h3 className="font-bold text-green-800 mb-4">
            Deployment Successful!
          </h3>

          <div className="space-y-2">
            <p className="text-green-700 break-all">
              <span className="font-semibold">Contract Address:</span>{" "}
              {deployedAddress}
            </p>
            <p className="text-green-700 break-all">
              <span className="font-semibold">Wallet Address:</span>{" "}
              {walletAddress}
            </p>
            <p className="text-green-700">
              <span className="font-semibold">Wallet Balance:</span>{" "}
              {walletBalance} ETH
            </p>

            <div className="mt-4">
              <h4 className="font-semibold text-green-800 mb-2">
                Token Metadata URIs:
              </h4>
              <div className="bg-white rounded-lg p-4 space-y-2">
                {Object.keys(metadata_mapping).length > 0 ? (
                  Object.entries(metadata_mapping).map(([tokenId, uris]) => (
                    <div key={tokenId} className="break-all">
                      <span className="font-semibold">Token #{tokenId}:</span>
                      <a
                        href={uris.gateway}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-2"
                      >
                        {uris.ipfs}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No metadata URIs available.</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`https://sepolia.basescan.org/address/${deployedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                View on BaseScan
              </a>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="w-full max-w-3xl bg-red-100 p-6 mt-6 rounded-lg shadow-md">
          <h3 className="font-bold text-red-800 mb-2">Deployment Error</h3>
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="w-full max-w-3xl mt-8">
        <details className="bg-white p-6 rounded-lg shadow-md">
          <summary className="font-bold text-gray-800 cursor-pointer">
            About NFT Standards
          </summary>
          <div className="mt-4 space-y-4 text-gray-700">
            <section>
              <h4 className="font-semibold mb-2">
                ERC-721 (Non-Fungible Tokens)
              </h4>
              <p>
                Best for unique, one-of-a-kind digital assets. Each token has
                unique metadata and can't be subdivided. Common uses include
                digital art, collectibles, and certificates.
              </p>
            </section>

            <section>
              <h4 className="font-semibold mb-2">
                ERC-1155 (Multi Token Standard)
              </h4>
              <p>
                A more flexible standard that can handle both fungible and
                non-fungible tokens in a single contract. Ideal for gaming
                assets, mixed collections, and any scenario where you need both
                unique and identical items.
              </p>
            </section>

            <section>
              <h4 className="font-semibold mb-2">Metadata Structure</h4>
              <p>Each token's metadata should include:</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Name: A descriptive name for the token</li>
                <li>Description: Detailed information about the token</li>
                <li>Image: URL to the token's image</li>
                <li>
                  Attributes: Special traits or properties (in JSON format)
                </li>
              </ul>
            </section>
          </div>
        </details>
      </div>
    </main>
  );
}


