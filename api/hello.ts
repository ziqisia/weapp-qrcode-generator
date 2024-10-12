import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.APP_ID}&secret=${process.env.APP_SECRET}`;
  const response = await fetch(url);
  const data = await response.json();
  const token = data.access_token;
  return token;
}

async function generateWxaCode(page: string, scene?: string, env = "release") {
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
  const data = {
    page,
    scene,
    // env_version: env,
    // width: 280,
    // is_hyaline: true,
  };
  const dataStr = JSON.stringify(data);
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(dataStr);
  const arrayBuffer = uint8Array.buffer;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      // "Content-Length": arrayBuffer.byteLength.toString(),
    },
    body: dataStr,
  });
  console.error(">>>", data, request);
  if (!request.ok) {
    throw new Error(`HTTP error! status: ${request.status}`);
  }
  return await request.arrayBuffer();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name = "World" } = req.query;
  const data = await generateWxaCode("pages/demo/index", "badge");
  return res.send(data);
}
