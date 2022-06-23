import { FaDiscord } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';

export const Footer = () => {
    return(
        <div className="absolute inset-x-0 bottom-0 bg-zinc-800 h-10 w-full border-y border-zinc-600">
            <div className="relative -bottom-1 flex gap-x-4 justify-center">
                <a className="hover:text-green-300" href="https://discord.gg/n6xr3ZWM8J" target="_blank" rel="noreferrer">
                    <FaDiscord size="30"/>
                </a>
                <a className="hover:text-green-300" href="https://github.com/vikingnope/worther" target="_blank" rel="noreferrer">
                    <BsGithub size="30"/>
                </a>
            </div>
        </div> 
    )
};
    