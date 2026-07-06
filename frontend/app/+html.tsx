// © 2026 1001538341 ONTARIO INC. All Rights Reserved.
// @ts-nocheck
import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";
import eventConfig from '../src/data/eventConfig';

const normalizeBasePath = (value?: string) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const withBasePath = (path: string) => {
  const basePath = normalizeBasePath(process.env.EXPO_BASE_URL);
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
};

export default function Root({ children }: PropsWithChildren) {
  const favicon = (eventConfig?.appName && eventConfig.appName.toLowerCase().includes('walkerton'))
    ? withBasePath('/whc-logo.png')
    : withBasePath('/assets/images/favicon.png');

  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*
          Disable body scrolling on web to make ScrollView components work correctly.
          If you want to enable scrolling, remove `ScrollViewStyleReset` and
          set `overflow: auto` on the body style below.
        */}
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" href={withBasePath('/whc-logo.png')} />
        <link rel="manifest" href={withBasePath('/manifest.json')} />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body > div:first-child { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; }
              [role="tablist"] [role="tab"] * { overflow: visible !important; }
              [role="heading"], [role="heading"] * { overflow: visible !important; }
            `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </body>
    </html>
  );
}
