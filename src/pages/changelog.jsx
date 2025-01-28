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
        <div className="text-white overflow-hidden">
            <Header/>
            <div className="bg-black flex min-h-screen flex-col">
                <h1 className='text-6xl font-bold underline mt-4 mb-7 text-center'>Changelog</h1>
                <Markdown children={markdown} className={'markdown'}/>
            </div>
            <Footer />
        </div>
    )

}