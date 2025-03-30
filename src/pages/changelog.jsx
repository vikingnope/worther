import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import Markdown from 'react-markdown';
import ChangelogData from '../resources/CHANGELOG.md';
import { useEffect, useState, useMemo } from 'react';

export default function Changelog() {
    const [ markdown, setMarkdown ] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Worther - Changelog";
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(ChangelogData)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch changelog');
                }
                return response.text();
            })
            .then((text) => {
                setMarkdown(text);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const memoiseMarkdown = useMemo(() => {
        return <Markdown>{markdown}</Markdown>;
    }, [markdown]);

    return (
        <div className="text-white overflow-hidden flex flex-col min-h-screen bg-black">
            <Header/>
            <div className="flex flex-col flex-grow mb-5">
                <h1 className='text-6xl font-bold underline my-10 text-center'>Changelog</h1>
                <div className='markdown'>
                    {loading && <p className='text-center'>Loading...</p>}
                    {error && <p className='text-center'>Error: {error}</p>}
                    {!loading && !error && (
                        <div className='markdown-content'>
                            {memoiseMarkdown}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )

}