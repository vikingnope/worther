import logo from '../../resources/logoSmall.png'

export const Header = () => {
    return (
        <div className="absolute inset-x-0 top-0 bg-neutral-800 h-14 w-full border-y border-zinc-600">
            <div className="fixed top-2 left-0">
                <img src={logo} className="-mt-2.5 ml-2.5 scale-75 rounded-full" alt="logo" />
            </div>
            <div className="fixed top-3 right-0">
                <a href="/map" className="relative uppercase text-2xl mr-7 hover:text-green-300">
                    Map
                </a>
                <a href="/about" className="relative uppercase text-2xl mr-12 hover:text-green-300">
                    About
                </a>
            </div>
        </div>
    )
};