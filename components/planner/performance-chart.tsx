'use client'

import { cn } from "@/lib/utils"

export function PerformanceOverview(){
  const contentTypes = [
    {
      type: 'Reels',
      text_color: 'text-purple-400',
      bg_color: 'bg-purple-300/20'
    },
    {
      type: 'Banner',
      text_color: 'text-green-400',
      bg_color: 'bg-green-300/20'
    },
    {
      type: 'Video',
      text_color: 'text-orange-400',
      bg_color: 'bg-orange-300/20'
    },
    {
      type: 'Standard',
      text_color: 'text-blue-400',
      bg_color: 'bg-blue-300/20'
    }
  ]
  return (
    <div className="mx-8 my-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Content Performance Report</h1>
      </div>
      <div>
        <div className="flex justify-between mb-5">
          <h2 className="text-3xl">Content Breakdown</h2>
          <span className="bg-gray-500/20 rounded-2xl px-3 py-1 text-xl">Total Posts: 58</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {contentTypes.map((content) => (
              <div className="bg-white drop-shadow-xl px-6 py-4 my-4" key={content.type}>
            <div className="flex justify-between my-3">
              <span className={cn("rounded-2xl px-2 mr-7", content.text_color, content.bg_color)}>{content.type}</span>
              <img src="placeholder.svg" alt="Reels Logo" width="10" height="10" />
            </div>
            <div className="flex gap-2 mt-8">
              <p className="text-4xl font-bold">24</p>
              <span className="pt-4 text-gray-500">PUBLISHED</span>
            </div>
          </div>
          ))}
          
          {/* <div className="bg-white drop-shadow-xl px-6 py-4 my-4">
            <div className="flex justify-between my-3">
              <span className="bg-green-300/20 text-green-400 rounded-2xl px-2 mr-7">CAROUSALS</span>
              <img src="placeholder.svg" alt="Carousals Logo" width="10" height="10" />
            </div>
            <div className="flex gap-2 mt-8">
              <p className="text-4xl font-bold">12</p>
              <span className="pt-4 text-gray-500">PUBLISHED</span>
            </div>
          </div>
          <div className="bg-white drop-shadow-xl px-6 py-4 my-4">
            <div className="flex justify-between my-3">
              <span className="bg-orange-300/20 text-orange-400 rounded-2xl px-2">EVENTS</span>
              <img src="placeholder.svg" alt="Events Logo" width="10" height="10" />
            </div>
            <div className="flex gap-2 mt-8">
              <p className="text-4xl font-bold">8</p>
              <span className="pt-4 text-gray-500">PUBLISHED</span>
            </div>
          </div>
          <div className="bg-white drop-shadow-xl px-6 py-4 my-4">
            <div className="flex justify-between my-3">
              <span className="bg-blue-300/20 text-blue-400 rounded-2xl px-2 mr-7">STANDARD</span>
              <img src="placeholder.svg" alt="Standard Logo" width="10" height="10" />
            </div>
            <div className="flex gap-2 mt-8">
              <p className="text-4xl font-bold">14</p>
              <span className="pt-4 text-gray-500">PUBLISHED</span>
            </div>
          </div> */}
        </div>
      </div>
      <div>
        <div className="flex justify-between my-8">
          <h2 className="text-3xl">Key Analytics</h2>
          <button className="bg-black text-white px-3 py-1"> + Add Analytics</button>
        </div>
        <div className="grid grid-cols-5 gap-1">
          <div className="bg-white drop-shadow-xl px-5 py-4">
            <p className="w-[9ch] mb-1.5">FOLLOWERS INCREASE</p>
            <p className="text-4xl mb-0.5">+1,240</p>
            <span>This period</span>
          </div>
          <div className="bg-white drop-shadow-xl px-5 py-4">
            <p className="w-[9ch] mb-1.5">FOLLOWERS INCREASE</p>
            <p className="text-4xl mb-0.5">+1,240</p>
            <span>This period</span>
          </div>
          <div className="bg-white drop-shadow-xl px-5 py-4">
            <p className="w-[9ch] mb-1.5">FOLLOWERS INCREASE</p>
            <p className="text-4xl mb-0.5">+1,240</p>
            <span>This period</span>
          </div>
          <div className="bg-white drop-shadow-xl px-5 py-4">
            <p className="w-[9ch] mb-1.5">FOLLOWERS INCREASE</p>
            <p className="text-4xl mb-0.5">+1,240</p>
            <span>This period</span>
          </div>
          <div className="bg-white drop-shadow-xl px-5 py-4">
            <p className="w-[9ch] mb-1.5">FOLLOWERS INCREASE</p>
            <p className="text-4xl mb-0.5">+1,240</p>
            <span>This period</span>
          </div>
        </div>
      </div>
    </div>
  )
}