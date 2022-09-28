import React from 'react'
import {BsFillMoonFill} from 'react-icons/bs';

export const Options = () => {
  return (
    <div className="leaflet-bottom leaflet-right w-16 h-96">
        <button type="button" className="cursor-pointer absolute w-7 h-7 bottom-12 rounded-md border-black border-solid border-2 left-6">
            <BsFillMoonFill size="13"/>
        </button>
    </div>
  )
}