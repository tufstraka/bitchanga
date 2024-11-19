import { NextResponse } from 'next/server';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'https://mainnet.dfinity.network',
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '/' }, // Rewrite the path
});

export const config = {
  runtime: 'nodejs', // Ensures the middleware runs on the server
};

export async function middleware(req, ev) {
  return new Promise((resolve, reject) => {
    proxy(req, {}, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
}

export async function GET(req) {
  try {
    const res = await middleware(req);
    return NextResponse.next(res);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
