import privateKeyPem from './WalmartPrivateKey';
const consumerId = process.env.REACT_APP_WALMART_CONSUMER_ID;
const keyVersion = process.env.REACT_APP_WALMART_KEY_VERSION;

async function generateWalmartSignature(timestamp) {
    const headers = {
      "WM_CONSUMER.ID": consumerId,
      "WM_CONSUMER.INTIMESTAMP": String(timestamp),
      "WM_SEC.KEY_VERSION": keyVersion,
    };
    const sortedKeys = Object.keys(headers).sort();
    let canonicalString = "";
    for (const key of sortedKeys) {
      canonicalString += headers[key].trim() + "\n";
    }
  
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = privateKeyPem
      .replace(pemHeader, "")
      .replace(pemFooter, "")
      .replace(/\s+/g, "");
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
  
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
  
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalString);
    const signatureBuffer = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data);
  
    const signatureBytes = new Uint8Array(signatureBuffer);
    let binary = "";
    for (let i = 0; i < signatureBytes.byteLength; i++) {
      binary += String.fromCharCode(signatureBytes[i]);
    }
    return window.btoa(binary);
  }

export async function searchCatalog(searchTerm) {
    const timestamp = Date.now()
    const signature = await generateWalmartSignature(timestamp);
    const url = new URL("https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?");
    url.searchParams.set("query", searchTerm);
    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "WM_CONSUMER.ID": consumerId,
                "WM_CONSUMER.INTIMESTAMP": timestamp,
                "WM_SEC.KEY_VERSION": keyVersion,
                "WM_SEC.AUTH_SIGNATURE": signature,
            }
        });
        if (!response.ok) {
            throw new Error(`Search request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during Walmart search API call:", error);
        throw error;
    }

}  