import logo from '../../resources/logoSmall.png';
import { useNavigate } from 'react-router-dom';



export const Header = ({choice}) => {
    const history = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();

        history('/');
    };

    const Navigations = (text, path) => {
        return(
            <a href={path} className="uppercase text-2xl mr-5 hover:text-green-300 hover:font-bold duration-150">
                {text}
            </a>
        )
    };

    return (
        <header className="inset-x-0 top-0 bg-neutral-800 h-14 w-full border-y border-zinc-600">
            <section className="absolute top-2 left-0">
                <img onClick={handleClick} draggable='false' src={logo} className="-mt-2.5 cursor-pointer ml-2.5 scale-75 rounded-full" alt="logo" />
            </section>
            <nav className="absolute right-0 top-3">
                {
                (choice === 'about') ? 
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Weather', '/weather')] :
                (choice === 'home') ?
                    [Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('About', '/about')] :
                (choice === 'weather') ?
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('About', '/about')] :
                (choice === 'showWeather') ?
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('About', '/about')] :
                (choice === 'map') ?
                    [Navigations('Home', '/'), Navigations('Weather', '/weather'), Navigations('About', '/about')] :
                (choice === 'showMap') ?
                    [Navigations('Home', '/'), Navigations('Map', '/map'), Navigations('Weather', '/weather'), Navigations('About', '/about')] :
                <></>
                }
            </nav>
        </header>
    )
};