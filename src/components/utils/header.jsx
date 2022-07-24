import logo from '../../resources/logoSmall.png'

const mapCall = (
    <a href="/map" className="relative uppercase text-2xl mr-7 hover:text-green-300 hover:font-bold">
        Map
    </a>
);

const aboutCall = (
    <a href="/about" className="relative uppercase text-2xl mr-12 hover:text-green-300 hover:font-bold">
        About
    </a>
);

const homeCall = (
    <a href="/" className="relative uppercase text-2xl mr-8 hover:text-green-300 hover:font-bold">
        Home
    </a>
);

const contactCall = (
    <a href="/contact" className="relative uppercase text-2xl mr-8 hover:text-green-300 hover:font-bold">
        Contact
    </a>
);

export const Header = ({choice}) => {
    return (
        <header className="absolute inset-x-0 top-0 bg-neutral-800 h-14 w-full border-y border-zinc-600 z-50">
            <section className="fixed top-2 left-0">
                <img src={logo} className="-mt-2.5 ml-2.5 scale-75 rounded-full" alt="logo" />
            </section>
            <nav className="fixed top-3 right-0">
                {
                (choice === 'about') ? 
                    [homeCall, mapCall]
                : (choice === 'home') ?
                    [mapCall, aboutCall] :
                <></>
                }
            </nav>
        </header>
    )
};