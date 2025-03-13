import React, { useEffect, useState } from "react";
import prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const App = () => {
    const [code, setCode] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        prism.highlightAll();
    }, [code]);

    const reviewCode = async () => {
        if (!code) {
            setError("You need to add code first.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setReview("");

        try {
            const response = await axios.post("http://localhost:8000/ai/review-code", { code });
            if (response.status === 200) {
                console.log(response.data);
                setReview(response.data);
            } else {
                throw new Error("Failed to fetch review");
            }
        } catch (error) {
            setError(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="h-screen w-full flex flex-wrap md:flex-nowrap gap-2 justify-center items-center bg-slate-600 text-white p-6">
            <div className="flex flex-col gap-4 h-full w-full md:w-1/2 bg-slate-900 rounded-lg p-3 border shadow-2xl overflow-scroll">
                <h1 className="text-2xl font-bold text-center underline underline-offset-4">Add Your Code Here</h1>
                <div className="w-full">
                    <Editor
                        placeholder="Your Code Goes Here!"
                        value={code}
                        onValueChange={(code) => setCode(code)}
                        highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                        padding={10}
                        style={{
                            fontFamily: '"Fira Code", monospace',
                            fontSize: 18,
                            backgroundColor: "#1e293b",
                            color: "#f8f8f2",
                            borderRadius: "5px",
                        }}
                        required
                    />
                </div>
                <button disabled={loading} onClick={reviewCode} className="bg-green-500 px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 select-none w-full font-bold text-xl">
                    {loading ? "Reviewing..." : "Review Code"}
                </button>
            </div>
            <div className="h-full w-full md:w-1/2 bg-slate-950 rounded-lg p-3 border shadow-xl flex flex-col gap-4 overflow-auto">
                <h2 className="text-2xl font-bold text-center underline underline-offset-4">Review Output</h2>
                {loading && <div className="w-14 h-14 border-4 border-solid border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                {error && <p className="text-white bg-red-800 p-3 rounded-md font-semibold">⚠️ {error}</p>}
                {review && (
                    <div className="prose prose-invert max-w-none w-full break-words">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                h1: ({ ...props }) => <h1 className="text-4xl font-bold break-words" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-3xl font-semibold break-words" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-2xl font-semibold break-words" {...props} />,
                                h4: ({ ...props }) => <h4 className="text-xl font-medium break-words" {...props} />,
                                h5: ({ ...props }) => <h5 className="text-lg font-medium break-words" {...props} />,
                                h6: ({ ...props }) => <h6 className="text-base font-medium break-words" {...props} />,
                                p: ({ ...props }) => <p className="text-base leading-relaxed break-words" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc pl-5 break-words" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-5 break-words" {...props} />,
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <Prism style={oneDark} language={match[1]} PreTag="div">
                                            {String(children).replace(/\n$/, "")}
                                        </Prism>
                                    ) : (
                                        <code className="break-words" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {review}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </main>
    );
};

export default App;
