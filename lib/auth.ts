import { cookies } from "next/headers";
import { sql } from "./db";
import bcrypt from "bcrypt";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export type UserRole = "agent" | "supervisor" | "admin";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  supervisor_id: number | null;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  exp: number;
}

// Simple base64 encoding/decoding for JWT
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64").toString();
}

// Simple HMAC-like signature using built-in crypto
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifySignature(
  data: string,
  signature: string
): Promise<boolean> {
  const expectedSignature = await createSignature(data);
  return signature === expectedSignature;
}

export async function createToken(
  payload: Omit<JWTPayload, "exp">
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const fullPayload = { ...payload, exp };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = await createSignature(
    `${headerEncoded}.${payloadEncoded}`
  );

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const [headerEncoded, payloadEncoded, signature] = token.split(".");
    if (!headerEncoded || !payloadEncoded || !signature) return null;

    const isValid = await verifySignature(
      `${headerEncoded}.${payloadEncoded}`,
      signature
    );
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as JWTPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const users = await sql`
      SELECT id, email, name, role, supervisor_id 
      FROM users 
      WHERE id = ${payload.userId}
    `;

    if (users.length === 0) return null;

    return users[0] as User;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
