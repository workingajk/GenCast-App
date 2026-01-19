import React, { useState } from 'react';
import axios from 'axios';

const PodcastGenerator = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState(null);
    const [scriptText, setScriptText] = useState('');
    const [scriptId, setScriptId] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateScript = async () => {
        setLoading(true);
        setError(null);
        setScript(null);
        try {
            const response = await axios.post('http://localhost:8000/api/podcasts/create/', { topic });
            setScript(response.data.script);
            setScriptText(JSON.stringify(response.data.script, null, 2));
            setScriptId(response.data.script_id);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAudio = () => {
        // Placeholder for next step
        alert('Generate Audio clicked! (Not implemented yet)');
    };

    React.useEffect(() => {
        const handler = setTimeout(() => {
            try {
                if (scriptText) {
                    const parsedScript = JSON.parse(scriptText);
                    setScript(parsedScript);
                    setError(null);
                }
            } catch (e) {
                setError("Invalid JSON format.");
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [scriptText]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">GenCast: AI Podcast Generator</h1>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="topic">
                    Enter a Topic
                </label>
                <div className="flex gap-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="topic"
                        type="text"
                        placeholder="e.g., The History of the Internet"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleGenerateScript}
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Script'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {script && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Generated Script</h2>
                    <textarea
                        className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={scriptText}
                        onChange={(e) => setScriptText(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleGenerateAudio}
                        >
                            Generate Audio
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PodcastGenerator;
