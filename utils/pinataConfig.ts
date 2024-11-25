import { PinataSDK } from "pinata-web3";

interface PinataConfig {
  pinataJwt: string;
  pinataGateway: string;
}

interface UploadResponse {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  user_id: string;
}

const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

if (!pinataJwt || !pinataGateway) {
  throw new Error("Missing Pinata credentials in environment variables.");
}

export const PINATA_GATEWAY = pinataGateway;
export const pinata = new PinataSDK({
  pinataJwt,
  pinataGateway,
});

export type { UploadResponse };