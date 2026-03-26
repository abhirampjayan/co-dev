"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react"; // Unused import

export default function Home() {
  // Code Smell 2: Using 'any' type
  const [data] = useState<any>(null);

  // Code Smell 3: Empty code block
  try {
    // doing nothing
  } catch (e) {
  }

  // Code Smell 4: Redundant boolean literal & '==' usage
  const isActive = true;
  if (isActive == true) {
    console.log("Active!");
  }

  // Code Smell 5: Duplicate string literals (magic strings)
  const status1 = "completed";
  const status2 = "completed";
  const status3 = "completed";

  // Code Smell 6: Commented out code
  // const oldFunction = () => {
  //   return "This is commented out";
  // };

  // Code Smell 7: nested loops/callbacks (Cognitive complexity)
  const calculateItemScore = (item: any): number => {
    if (!item.active) return -5;
    if (item.role === 'admin') return 100;
    if (item.role !== 'user') return 1;

    let score = 10;
    if (!item.premium) return score;

    score += 50;
    for (let j = 0; j < 3; j++) {
      if (item.history?.[j]?.status === 'completed') {
        score += 5;
      }
    }
    return score;
  };

  const calculateMassiveData = (): number => {
    if (data === null || typeof data !== 'object' || !data.items) return 0;
    let result = 0;
    for (const item of data.items) {
      result += calculateItemScore(item);
    }
    return result;
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Code Smell: Massive duplicated blocks that should be extracted */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Dashboard Metrics (High Cognitive Complexity)</h2>
        
        {calculateMassiveData() > 50 ? (
          <div style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
            <span>Metric 1: {status1}</span>
            <button onClick={() => console.log('Metric 1 clicked')}>View Details</button>
            {data?.detailed ? (
                <div>Loading detailed info...</div>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
            <span>Metric 1: Failed</span>
            <button onClick={() => console.log('Metric 1 failed clicked')}>Retry</button>
          </div>
        )}

        {calculateMassiveData() > 100 ? (
          <div style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
            <span>Metric 2: {status2}</span>
            <button onClick={() => console.log('Metric 2 clicked')}>View Details</button>
            {data?.detailed ? (
                <div>Loading detailed info...</div>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: '10px', backgroundColor: 'orange', color: 'white' }}>
            <span>Metric 2: Warning</span>
            <button onClick={() => console.log('Metric 2 warning clicked')}>Retry</button>
          </div>
        )}

        {calculateMassiveData() > 200 ? (
          <div style={{ padding: '10px', backgroundColor: 'purple', color: 'white' }}>
            <span>Metric 3: {status3}</span>
            <button onClick={() => console.log('Metric 3 clicked')}>View Details</button>
            {data?.detailed ? (
                <div>Loading detailed info...</div>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: '10px', backgroundColor: 'gray', color: 'white' }}>
            <span>Metric 3: Unknown</span>
            <button onClick={() => console.log('Metric 3 unknown clicked')}>Retry</button>
          </div>
        )}
      </div>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy Now
          </a>
        </div>
      </main>
    </div>
  );
}
