import React from 'react'
import {BsFillMoonFill} from 'react-icons/bs';

export const Options = () => {
  return (
    <div className="leaflet-bottom leaflet-right w-16 h-96">
        <button onclick="" type="button" className="cursor-pointer absolute w-8 h-8 bottom-12 rounded-md bg-white border-black border-solid border-2 left-6">
            <BsFillMoonFill className="block m-auto" size="15"/>
        </button>
    </div>
  )
}