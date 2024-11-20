// utils/pinataConfig.ts
import { PinataSDK } from "pinata-web3";

const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

if (!pinataJwt || !pinataGateway) {
  throw new Error("Missing Pinata credentials in environment variables.");
}

export const pinata = new PinataSDK({
  pinataJwt,
  pinataGateway,
});

// Function to upload a file and return IPFS link
export const uploadFileToIPFS = async (file: File) => {
    try {
      const upload = await pinata.upload.file(file);
      return {
        ipfsLink: `${pinataGateway}/ipfs/${upload.IpfsHash}`,
        ipfsHash: upload.IpfsHash,
      };
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw new Error("Failed to upload file to IPFS");
    }
  };
  