import { useEffect } from 'react'

interface Props {
  message: string
  type?: 'success' | 'error'
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onDismiss, duration = 2500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [onDismiss, duration])

  return (
    <div className="fixed top-16 inset-x-4 z-[100] flex justify-center animate-toast pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-white font-medium text-sm ${
          type === 'success'
            ? 'bg-emerald-500'
            : 'bg-red-500'
        }`}
      >
        <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
        {message}
      </div>
    </div>
  )
}
