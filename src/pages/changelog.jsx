import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import Markdown from 'react-markdown';
import ChangelogData from '../resources/CHANGELOG.md';
import { useEffect, useState } from 'react';

export default function Changelog() {
    const [ markdown, setMarkdown ] = useState('');

    useEffect(() => {
        fetch(ChangelogData).then((response) => response.text()).then((text) => setMarkdown(text));
    }, []);

    return (
        <div className="text-white overflow-hidden bg-black">
            <Header/>
            <div className="flex min-h-screen flex-col mb-5">
                <h1 className='text-6xl font-bold underline my-10 text-center'>Changelog</h1>
                <Markdown children={markdown} className={'markdown'}/>
            </div>
            <Footer />
        </div>
    )

}