import React from "react"

export default function LeadPointContainer({ children }) {
  return (
    <div className="flex flex-col my-10 items-center nav:justify-center w-full max-w-6xl py-12 px-16">
      {children}
    </div>
  )
}
