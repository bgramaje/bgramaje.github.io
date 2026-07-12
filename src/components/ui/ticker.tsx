
import type { HTMLAttributes, ReactNode } from "react"
import { createContext, memo, useContext, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface TickerContextValue {
  formatter: Intl.NumberFormat
}

const DEFAULT_CURRENCY = "USD"
const DEFAULT_LOCALE = "en-US"

const defaultFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const TickerContext = createContext<TickerContextValue>({
  formatter: defaultFormatter,
})

export const useTickerContext = () => useContext(TickerContext)

export type TickerProps = HTMLAttributes<HTMLButtonElement> & {
  currency?: string
  locale?: string
}

export const Ticker = memo(
  ({
    children,
    className,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    ...props
  }: TickerProps & { children: ReactNode }) => {
    const formatter = useMemo(() => {
      try {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currency.toUpperCase(),
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      } catch {
        return defaultFormatter
      }
    }, [currency, locale])

    return (
      <TickerContext.Provider value={{ formatter }}>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap align-middle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            className,
          )}
          type="button"
          {...props}
        >
          {children}
        </button>
      </TickerContext.Provider>
    )
  },
)
Ticker.displayName = "Ticker"

export type TickerIconProps = HTMLAttributes<HTMLImageElement> & {
  src: string
  symbol: string
}

export const TickerIcon = memo(({ src, symbol, className, ...props }: TickerIconProps) => {
  if (!src) {
    return null
  }
  return (
    <Avatar className={cn("size-7 border border-border bg-muted p-1", className)}>
      <AvatarImage src={src} {...props} />
      <AvatarFallback className="font-semibold text-muted-foreground text-sm">
        {symbol.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
})
TickerIcon.displayName = "TickerIcon"

export type TickerSymbolProps = HTMLAttributes<HTMLSpanElement> & {
  symbol: string
}

export const TickerSymbol = memo(({ symbol, className, ...props }: TickerSymbolProps) => (
  <span className={cn("font-medium", className)} {...props}>
    {symbol.toUpperCase()}
  </span>
))
TickerSymbol.displayName = "TickerSymbol"

export type TickerPriceProps = HTMLAttributes<HTMLSpanElement> & {
  price: number
}

export const TickerPrice = memo(({ price, className, ...props }: TickerPriceProps) => {
  const context = useTickerContext()

  const formattedPrice = useMemo(() => context.formatter.format(price), [price, context])

  return (
    <span className={cn("text-muted-foreground tabular-nums", className)} {...props}>
      {formattedPrice}
    </span>
  )
})
TickerPrice.displayName = "TickerPrice"

export type TickerPriceChangeProps = HTMLAttributes<HTMLSpanElement> & {
  change: number
  isPercent?: boolean
}

export const TickerPriceChange = memo(
  ({ change, isPercent, className, ...props }: TickerPriceChangeProps) => {
    const isPositiveChange = useMemo(() => change >= 0, [change])
    const context = useTickerContext()

    const changeFormatted = useMemo(() => {
      if (isPercent) {
        return `${change.toFixed(2)}%`
      }
      return context.formatter.format(change)
    }, [change, isPercent, context])

    return (
      <span
        className={cn(
          "flex items-center gap-0.5 tabular-nums",
          isPositiveChange ? "text-success" : "text-destructive",
          className,
        )}
        {...props}
      >
        <svg
          aria-labelledby="ticker-change-icon-title"
          className={isPositiveChange ? "" : "rotate-180"}
          fill="currentColor"
          height="12"
          role="img"
          viewBox="0 24"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="ticker-change-icon-title">{isPositiveChange ? "Up icon" : "Down icon"}</title>
          <path d="M24 22h-24l12-20z" />
        </svg>
        {changeFormatted}
      </span>
    )
  },
)
TickerPriceChange.displayName = "TickerPriceChange"

// Demo
const cryptoData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67432.5,
    change: 2.34,
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3521.8,
    change: -1.12,
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 142.65,
    change: 5.67,
    icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.1234,
    change: -3.45,
    icon: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  },
]

export function Demo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Crypto Prices</h3>
        <div className="flex flex-col gap-3">
          {cryptoData.map(crypto => (
            <Ticker
              key={crypto.symbol}
              className="justify-between gap-4 hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TickerIcon src={crypto.icon} symbol={crypto.symbol} />
                <TickerSymbol symbol={crypto.symbol} />
              </div>
              <div className="flex items-center gap-3">
                <TickerPrice price={crypto.price} />
                <TickerPriceChange change={crypto.change} isPercent />
              </div>
            </Ticker>
          ))}
        </div>
      </div>
    </div>
  )
}
