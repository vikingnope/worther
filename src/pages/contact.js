import React from 'react';

export default class Contact extends React.Component {
  render(){
    return (
      <div className="text-center">
          <header className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
              <p className="-mt-96 text-6xl">
                  Contact Us
              </p>
              <input className="bg-white border-solid rounded-md text-2xl outline-none border-blue-700 text-black mt-5" placeholder="Name"></input>
          </header>
      </div>
    );
  }
}
