import { FaDiscord } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';
import { IoDocumentTextSharp } from "react-icons/io5";

export const Footer = () => {
    return(
        <footer className="inset-x-0 bottom-0 bg-neutral-800 h-10 w-full border-y border-zinc-600">
            <nav className="relative -bottom-1.5 flex gap-x-5 justify-center">
                <a className="hover:text-green-300" href="https://discord.gg/n6xr3ZWM8J" target="_blank" rel="noreferrer">
                    <FaDiscord size="26"/>
                </a>
                <a className="hover:text-green-300" href="https://github.com/vikingnope/worther" target="_blank" rel="noreferrer">
                    <BsGithub size="26"/>
                </a>
                <div className='absolute right-5'>
                    <a href='/changelog' className='font-bold underline flex gap-x-1'>
                        <IoDocumentTextSharp size="20"className='my-auto'/>
                        Changelog
                    </a>
                </div>
            </nav>  
        </footer> 
    )
};
    