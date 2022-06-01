import React from 'react';

const Contact = () => {
  return (
    <div className="text-center">
        <header className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <p className="-mt-96 text-6xl">
                Contact Us
            </p>
            <input className="bg-white border-solid rounded-md text-2xl outline-none border-blue-700 text-black" placeholder="Name"></input>
        </header>
    </div>
  );
}

export default Contact;