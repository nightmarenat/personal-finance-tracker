export function StatCardSkeleton() {
  return (
    <div className="flex-1 rounded-2xl bg-slate-800 p-4 space-y-2">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-7 w-24" />
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-800 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  )
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="space-y-1.5">
        <div className="skeleton h-3.5 w-32" />
        <div className="skeleton h-3 w-20" />
      </div>
      <div className="skeleton h-4 w-16" />
    </div>
  )
}

export function SummaryTabSkeleton() {
  return (
    <div className="space-y-4 px-4 pb-tab-bar pt-2">
      <div className="flex gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-2xl bg-slate-800 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <TransactionRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function BreakdownSkeleton() {
  return (
    <div className="space-y-4 px-4 pb-tab-bar pt-2">
      <div className="skeleton h-56 w-full rounded-2xl" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-800 p-4 space-y-2">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-4 w-14" />
            </div>
            <div className="skeleton h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
