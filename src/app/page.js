"use client";

import { useState } from "react";
import ErrorDisplay from "./components/ErrorDisplay";
import Instructions from "./components/Instructions";
import ResultDisplay from "./components/ResultDisplay";
import URLForm from "./components/URLForm";

export default function Home() {
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [error, setError] = useState("");

  const handleResult = ({ data, type }) => {
    setError("");
    setResult(data);
    setResultType(type);
  };

  const handleError = (errorMessage) => {
    setResult(null);
    setResultType(null);
    setError(errorMessage);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="container mx-auto">
        <URLForm onResult={handleResult} onError={handleError} />

        {/* Display error if present */}
        {error && <ErrorDisplay message={error} />}

        {/* Display results if available */}
        {result && resultType && !error && (
          <ResultDisplay result={result} type={resultType} />
        )}

        <Instructions />
      </div>
    </main>
  );
}
