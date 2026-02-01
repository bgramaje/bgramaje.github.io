"use client";

import { useEffect, useState } from "react";
import { Bitcoin } from "lucide-react";
import { Ticker } from "@/components/ui/ticker";

const STORAGE_KEY_LAST_FETCH = "btc_last_fetch";
const STORAGE_KEY_PRICE = "btc_price";
const STORAGE_KEY_CHANGE = "btc_change_24h";
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";

interface CoinGeckoResponse {
  bitcoin?: { usd?: number; usd_24h_change?: number };
}

function getCached(): { price: number; change: number; at: number } | null {
  try {
    const rawFetch = localStorage.getItem(STORAGE_KEY_LAST_FETCH);
    const rawPrice = localStorage.getItem(STORAGE_KEY_PRICE);
    const rawChange = localStorage.getItem(STORAGE_KEY_CHANGE);
    if (rawFetch == null || rawPrice == null) return null;
    const at = Number(rawFetch);
    if (Number.isNaN(at) || Date.now() - at > CACHE_MS) return null;
    const price = Number(rawPrice);
    const change = rawChange != null ? Number(rawChange) : 0;
    if (Number.isNaN(price)) return null;
    return { price, change: Number.isNaN(change) ? 0 : change, at };
  } catch {
    return null;
  }
}

function setCached(price: number, change: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_FETCH, String(Date.now()));
    localStorage.setItem(STORAGE_KEY_PRICE, String(price));
    localStorage.setItem(STORAGE_KEY_CHANGE, String(change));
  } catch {
    // ignore
  }
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface BitcoinTickerProps {
  /** When true, renders only the content (icon + price + change) without button, for use inside tooltips */
  inline?: boolean;
}

export function BitcoinTicker({ inline = false }: BitcoinTickerProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number>(0);

  useEffect(() => {
    function fetchPrice() {
      fetch(COINGECKO_URL)
        .then((res) => res.json())
        .then((data: CoinGeckoResponse) => {
          const usd = data?.bitcoin?.usd;
          const ch = data?.bitcoin?.usd_24h_change ?? 0;
          if (typeof usd === "number") {
            setPrice(usd);
            setChange24h(ch);
            setCached(usd, ch);
          }
        })
        .catch(() => {});
    }

    const cached = getCached();
    if (cached) {
      setPrice(cached.price);
      setChange24h(cached.change);
    } else {
      fetchPrice();
    }

    const intervalId = setInterval(fetchPrice, CACHE_MS);
    return () => clearInterval(intervalId);
  }, []);

  if (price == null) {
    return (
      <span className="text-xs text-neutral-500 dark:text-neutral-400" aria-hidden>
        BTC —
      </span>
    );
  }

  const isUp = change24h >= 0;
  const priceColor = isUp
    ? "text-green-600 dark:text-green-500"
    : "text-red-600 dark:text-red-500";

  const content = (
    <>
      <Bitcoin size={14} className="shrink-0 text-white" aria-hidden />
      <span className={`text-xs ml-[-4px] font-medium ${priceColor}`}>
        {priceFormatter.format(price)}
      </span>
      {change24h !== 0 && (
        <span className={`text-[10px] font-medium ${priceColor}`}>
          {isUp ? "+" : ""}{change24h.toFixed(2)}%
        </span>
      )}
    </>
  );

  if (inline) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-neutral-400 dark:text-neutral-500">
        {content}
      </span>
    );
  }

  return (
    <Ticker
      className="pointer-events-none text-neutral-400 dark:text-neutral-500 p-0"
      aria-label="Bitcoin price"
    >
      {content}
    </Ticker>
  );
}
