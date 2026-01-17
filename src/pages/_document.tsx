import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id" className="dark">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
