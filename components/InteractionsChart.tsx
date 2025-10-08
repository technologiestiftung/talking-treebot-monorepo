"use client"

interface InteractionData {
  date: string
  count: number
}

interface InteractionsChartProps {
  data: InteractionData[]
}

export function InteractionsChart({ data }: InteractionsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const chartHeight = 240

  return (
    <div className="bg-card/70 backdrop-blur-md rounded-xl border border-accent/20 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-6">Interactions Over Time (Last 30 Days)</h3>

      <div className="relative">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-12 w-8 flex flex-col justify-between text-[10px] text-muted-foreground">
          <span>{maxCount}</span>
          <span>{Math.floor(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart container */}
        <div className="ml-10 h-64 relative">
          {/* Bars container */}
          <div className="absolute inset-0 bottom-12 flex items-end justify-between gap-0.5">
            {data.map((item, index) => {
              const date = new Date(item.date)
              const isToday = index === data.length - 1
              const hasData = item.count > 0

              const heightPercent = hasData ? Math.max((item.count / maxCount) * 100, 2) : 100

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full">
                  {/* Count label above bar */}
                  {hasData && (
                    <div className="absolute" style={{ bottom: `calc(${heightPercent}% + 2px)` }}>
                      <span className="text-[10px] text-muted-foreground/60">{item.count}</span>
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full h-full flex items-end">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        hasData
                          ? "bg-emerald-500 hover:bg-emerald-800"
                          : "border-2 border-dotted border-gray-200 bg-transparent hover:border-gray-400"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${item.count} conversations`}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 h-12 flex items-start justify-between pt-2">
            {data.map((item, index) => {
              const date = new Date(item.date)
              const isToday = index === data.length - 1
              const showLabel = index % 5 === 0 || isToday

              return (
                <div key={index} className="flex-1 flex justify-center">
                  {showLabel && (
                    <span
                      className={`text-[9px] ${isToday ? "text-accent-foreground font-bold" : "text-muted-foreground"}`}
                    >
                      {isToday ? "Today" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
