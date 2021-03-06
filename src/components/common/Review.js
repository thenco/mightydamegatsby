import React from "react"
import Rating from "./Rating"
import backupImage from "../../images/User.png"

export default function Review({ value, title, quote, image, reviewer }) {
  return (
    <div className="w-60 lg:max-w-80 sm:max-w-64 my-12 mx-4">
      <div className="flex flex-nowrap h-4 mb-5 whitespace-nowrap">
        <Rating value={value} height="3" />
        <span className="ml-3 min-w-min text-xs text-primary font-light">{` ${value} bars`}</span>
      </div>
      <h3 className="text-primary font-medium text-base mb-4 text-right">{title}</h3>
      <q className="text-primary font-light text-xs">{`${quote}`}</q>
      <div className="w-full flex justify-end items-center mt-5">
        <span className="transform translate-x-3.5 font-extralight text-primary z-10">
          {reviewer}
        </span>
        <div className="w-8 h-8 border-none rounded-full overflow-hidden">
          <img
            className="w-full h-auto opacity-50"
            src={image || backupImage}
            alt="user avatar"
          />
        </div>
      </div>
    </div>
  )
}
