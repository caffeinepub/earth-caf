import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useRef, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let storageClientInstance: StorageClient | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (storageClientInstance) return storageClientInstance;
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(console.error);
  }
  storageClientInstance = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return storageClientInstance;
}

export function useStorageClient() {
  const uploadFile = async (file: File): Promise<string> => {
    const client = await getStorageClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await client.putFile(bytes);
    return hash;
  };

  const getBlobUrl = async (blobId: string): Promise<string> => {
    if (!blobId) return "";
    const client = await getStorageClient();
    return client.getDirectURL(blobId);
  };

  return { uploadFile, getBlobUrl };
}

export function useBlobUrl(blobId: string) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!blobId) {
      setUrl("");
      return;
    }
    setLoading(true);
    getStorageClient()
      .then((client) => client.getDirectURL(blobId))
      .then((u) => {
        if (mounted.current) setUrl(u);
      })
      .catch(() => {
        if (mounted.current) setUrl("");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
  }, [blobId]);

  return { url, loading };
}
