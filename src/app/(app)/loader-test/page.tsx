"use client";

import { Loader } from "@/components/ui/Loader";

export default function LoaderTestPage() {
    return (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center gap-10">
            <h1 className="text-white font-display text-2xl">Loader Component Test</h1>

            <div className="p-10 border border-white/10 rounded-xl bg-slate-800/50">
                <Loader />
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-slate-400 text-xs">Small Scale</span>
                    <Loader className="scale-75 origin-center" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-slate-400 text-xs">Normal</span>
                    <Loader />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-slate-400 text-xs">Large Scale</span>
                    <Loader className="scale-150 origin-center" />
                </div>
            </div>

            <p className="text-slate-500 max-w-md text-center text-sm">
                This component uses the structure of <code>separator.svg</code> with added IDs for future animation manipulation.
            </p>
        </div>
    );
}
