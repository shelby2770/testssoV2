import { api } from "./api";

// Helper function to convert ArrayBuffer to base64url
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Helper function to convert base64url to ArrayBuffer
function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  // Add padding if needed
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/") + padding;

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper function to pretty print an ArrayBuffer
function prettyPrintArrayBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hexString = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const hex = bytes[i].toString(16).padStart(2, "0");
    hexString += hex + " ";
    if ((i + 1) % 16 === 0) hexString += "\n";
  }
  return hexString;
}

// Helper to parse and log client data JSON for better visibility
function parseAndLogClientData(clientDataJSON: ArrayBuffer) {
  try {
    const decoder = new TextDecoder("utf-8");
    const clientDataString = decoder.decode(clientDataJSON);
    const clientData = JSON.parse(clientDataString);
    console.log("📊 Parsed Client Data JSON:", {
      type: clientData.type,
      challenge: clientData.challenge,
      origin: clientData.origin,
      crossOrigin: clientData.crossOrigin,
      ...(clientData.tokenBinding && { tokenBinding: clientData.tokenBinding }),
    });
  } catch (e) {
    console.error("Failed to parse client data JSON", e);
  }
}

export async function startRegistration(
  username: string,
  firstName: string,
  lastName: string,
  email: string
) {
  console.group("🔐 WEBAUTHN REGISTRATION FLOW");
  console.log("📤 Input parameters:", { username, firstName, lastName, email });

  try {
    // Step 1: Get registration challenge from server
    console.log("🔄 Step 1: Getting registration challenge from server...");
    const challengeResponse = await api.getRegistrationChallenge({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
    });

    console.log("📥 Challenge from server:", challengeResponse);
    console.log("📊 Challenge details:", {
      challenge: challengeResponse.challenge,
      rpId: challengeResponse.rp.id,
      rpName: challengeResponse.rp.name,
      userId: challengeResponse.user.id,
      userName: challengeResponse.user.name,
      userDisplayName: challengeResponse.user.displayName,
      authenticatorSelection: challengeResponse.authenticatorSelection,
      attestation: challengeResponse.attestation,
    });

    // Step 2: Prepare credential creation options
    const credentialCreationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge: base64UrlToArrayBuffer(challengeResponse.challenge),
        rp: {
          id: challengeResponse.rp.id,
          name: challengeResponse.rp.name,
        },
        user: {
          id: base64UrlToArrayBuffer(challengeResponse.user.id),
          name: challengeResponse.user.name,
          displayName: challengeResponse.user.displayName,
        },
        pubKeyCredParams: challengeResponse.pubKeyCredParams.map(
          (param: any) => ({
            type: param.type as PublicKeyCredentialType,
            alg: param.alg,
          })
        ),
        timeout: challengeResponse.timeout,
        authenticatorSelection: {
          authenticatorAttachment: challengeResponse.authenticatorSelection
            .authenticatorAttachment as AuthenticatorAttachment,
          residentKey: challengeResponse.authenticatorSelection
            .residentKey as ResidentKeyRequirement,
          userVerification: challengeResponse.authenticatorSelection
            .userVerification as UserVerificationRequirement,
        },
        attestation:
          challengeResponse.attestation as AttestationConveyancePreference,
      },
    };

    console.log("📤 DATA SENT TO YUBIKEY:", credentialCreationOptions);
    console.log("📊 YUBIKEY REQUEST DETAILS:", {
      challengeBytes:
        prettyPrintArrayBuffer(
          base64UrlToArrayBuffer(challengeResponse.challenge)
        ).substring(0, 100) + "...",
      rpId: challengeResponse.rp.id,
      userIdBytes:
        prettyPrintArrayBuffer(
          base64UrlToArrayBuffer(challengeResponse.user.id)
        ).substring(0, 100) + "...",
      algorithms: challengeResponse.pubKeyCredParams
        .map((p: any) => `${p.type}:${p.alg}`)
        .join(", "),
      authenticatorAttachment:
        challengeResponse.authenticatorSelection.authenticatorAttachment,
      residentKey: challengeResponse.authenticatorSelection.residentKey,
      userVerification:
        challengeResponse.authenticatorSelection.userVerification,
    });

    // Step 3: Create credential using WebAuthn API
    console.log("🔄 Step 3: Requesting credential from YubiKey...");
    const credential = (await navigator.credentials.create(
      credentialCreationOptions
    )) as PublicKeyCredential;

    if (!credential) {
      throw new Error("Failed to create credential");
    }

    console.log("📥 RAW DATA FROM YUBIKEY:", credential);
    console.log("📊 CREDENTIAL DETAILS:", {
      id: credential.id,
      type: credential.type,
      rawIdLength: credential.rawId.byteLength,
      rawIdHex:
        prettyPrintArrayBuffer(credential.rawId).substring(0, 100) + "...",
    });

    // Ensure we have the required properties
    if (!credential.id) {
      throw new Error("Credential missing required id");
    }

    if (!credential.rawId) {
      throw new Error("Credential missing required rawId");
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    if (!response.clientDataJSON) {
      throw new Error("Credential response missing clientDataJSON");
    }

    if (!response.attestationObject) {
      throw new Error("Credential response missing attestationObject");
    }

    // Log response details
    console.log("📥 YUBIKEY RESPONSE DETAILS:");
    console.log("  📄 ClientDataJSON:", {
      byteLength: response.clientDataJSON.byteLength,
      hexPreview:
        prettyPrintArrayBuffer(response.clientDataJSON).substring(0, 100) +
        "...",
    });
    parseAndLogClientData(response.clientDataJSON);

    console.log("  📄 AttestationObject:", {
      byteLength: response.attestationObject.byteLength,
      hexPreview:
        prettyPrintArrayBuffer(response.attestationObject).substring(0, 100) +
        "...",
    });

    // Step 4: Prepare verification data
    const verificationData = {
      username,
      credential_id: credential.id, // This should be the base64url encoded credential ID
      client_data_json: arrayBufferToBase64Url(response.clientDataJSON),
      attestation_object: arrayBufferToBase64Url(response.attestationObject),
    };

    console.log("📤 Verification data to server:", verificationData);

    // Step 5: Send to server for verification
    console.log("🔄 Step 5: Sending verification data to server...");
    const verificationResponse = await api.verifyRegistration(verificationData);

    console.log("📥 Verification response from server:", verificationResponse);
    console.log("✅ REGISTRATION COMPLETED");

    return verificationResponse;
  } catch (error) {
    console.error("❌ REGISTRATION FAILED");
    console.error("Error details:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw error;
  } finally {
    console.groupEnd();
  }
}

export async function startAuthentication(username?: string) {
  console.group("🔐 WEBAUTHN AUTHENTICATION FLOW");
  console.log(
    "📤 Authentication request for username:",
    username || "(none - using passkey)"
  );

  try {
    // Step 1: Get authentication challenge
    console.log("🔄 Step 1: Getting authentication challenge from server...");
    const challengeResponse = await api.getAuthenticationChallenge({
      username,
    });
    console.log("📥 Challenge from server:", challengeResponse);
    console.log("📊 Challenge details:", {
      challenge: challengeResponse.challenge,
      rpId: challengeResponse.rpId,
      timeout: challengeResponse.timeout,
      userVerification: challengeResponse.userVerification,
      allowCredentials:
        challengeResponse.allowCredentials?.length ||
        "none (using discoverable credentials)",
    });

    // Step 2: Prepare credential request options
    const credentialRequestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge: base64UrlToArrayBuffer(challengeResponse.challenge),
        timeout: challengeResponse.timeout,
        rpId: challengeResponse.rpId,
        allowCredentials: challengeResponse.allowCredentials?.map(
          (cred: any) => ({
            type: "public-key" as PublicKeyCredentialType,
            id: base64UrlToArrayBuffer(cred.id),
          })
        ),
        userVerification:
          challengeResponse.userVerification as UserVerificationRequirement,
      },
    };

    console.log("📤 DATA SENT TO YUBIKEY:", credentialRequestOptions);
    console.log("📊 YUBIKEY REQUEST DETAILS:", {
      challengeBytes:
        prettyPrintArrayBuffer(
          base64UrlToArrayBuffer(challengeResponse.challenge)
        ).substring(0, 100) + "...",
      rpId: challengeResponse.rpId,
      userVerification: challengeResponse.userVerification,
      allowCredentials: challengeResponse.allowCredentials
        ? challengeResponse.allowCredentials.map((cred: any) => ({
            type: "public-key",
            idHexPreview:
              prettyPrintArrayBuffer(base64UrlToArrayBuffer(cred.id)).substring(
                0,
                50
              ) + "...",
          }))
        : "none (using discoverable credentials)",
    });

    // Step 3: Get credential
    console.log("🔄 Step 3: Requesting credential from YubiKey...");
    const credential = (await navigator.credentials.get(
      credentialRequestOptions
    )) as PublicKeyCredential;

    if (!credential) {
      throw new Error("Failed to get credential");
    }

    console.log("📥 RAW DATA FROM YUBIKEY:", credential);
    console.log("📊 CREDENTIAL DETAILS:", {
      id: credential.id,
      type: credential.type,
      rawIdLength: credential.rawId.byteLength,
      rawIdHex:
        prettyPrintArrayBuffer(credential.rawId).substring(0, 100) + "...",
    });

    const response = credential.response as AuthenticatorAssertionResponse;

    // Log response details
    console.log("📥 YUBIKEY RESPONSE DETAILS:");
    console.log("  📄 authenticatorData:", {
      byteLength: response.authenticatorData.byteLength,
      hexPreview:
        prettyPrintArrayBuffer(response.authenticatorData).substring(0, 100) +
        "...",
    });

    console.log("  📄 ClientDataJSON:", {
      byteLength: response.clientDataJSON.byteLength,
      hexPreview:
        prettyPrintArrayBuffer(response.clientDataJSON).substring(0, 100) +
        "...",
    });
    parseAndLogClientData(response.clientDataJSON);

    console.log("  📄 Signature:", {
      byteLength: response.signature.byteLength,
      hexPreview:
        prettyPrintArrayBuffer(response.signature).substring(0, 100) + "...",
    });

    if (response.userHandle) {
      console.log("  📄 UserHandle:", {
        byteLength: response.userHandle.byteLength,
        hexPreview:
          prettyPrintArrayBuffer(response.userHandle).substring(0, 100) + "...",
      });
    }

    // Step 4: Prepare verification data
    const verificationData = {
      credential_id: credential.id,
      authenticator_data: arrayBufferToBase64Url(response.authenticatorData),
      client_data_json: arrayBufferToBase64Url(response.clientDataJSON),
      signature: arrayBufferToBase64Url(response.signature),
      user_handle: response.userHandle
        ? arrayBufferToBase64Url(response.userHandle)
        : undefined,
    };

    console.log("📤 Verification data to server:", verificationData);

    // Step 5: Verify with server
    console.log("🔄 Step 5: Sending verification data to server...");
    const verificationResponse = await api.verifyAuthentication(
      verificationData
    );
    console.log("📥 Verification response from server:", verificationResponse);
    console.log("✅ AUTHENTICATION COMPLETED");

    return verificationResponse;
  } catch (error) {
    console.error("❌ AUTHENTICATION FAILED");
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  } finally {
    console.groupEnd();
  }
}
