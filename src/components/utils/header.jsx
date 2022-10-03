import logo from '../../resources/logoSmall.png'

const Navigations = (text, path) => {
    return(
        <a href={path} className="relative uppercase text-2xl mr-5 hover:text-green-300 hover:font-bold duration-150">
            {text}
        </a>
    )
};


export const Header = ({choice}) => {
    return (
        <header className="absolute inset-x-0 top-0 bg-neutral-800 h-14 w-full border-y border-zinc-600 z-50">
            <section className="fixed top-2 left-0">
                <img src={logo} className="-mt-2.5 ml-2.5 scale-75 rounded-full" alt="logo" />
            </section>
            <nav className="fixed top-3 right-0">
                {
                (choice === 'about') ? 
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('Forums', '/forums')]
                : (choice === 'home') ?
                    [Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('Forums', '/forums'), Navigations('About', '/about')] :
                    (choice === 'forums') ?
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('About', '/about')] :
                    (choice === 'weather') ?
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Forums', '/forums'), Navigations('About', '/about')] :

                <></>
                }
            </nav>
        </header>
    )
};