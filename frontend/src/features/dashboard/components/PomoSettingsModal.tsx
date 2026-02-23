import type { PomoSettings, SessionMode } from "../../../shared/api/types";
import { X } from "lucide-react";

interface PomoSettingsModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onFieldChange: (key: keyof PomoSettings, rawValue: string) => void;
    onModeChange: (value: string) => void;
    mode: SessionMode;
    settingsDraft: PomoSettings
    error: string;
    message: string;
}

export function PomoSettingsModal({ isOpen, onClose, onSave, onFieldChange, onModeChange, mode, settingsDraft, error, message} : PomoSettingsModalProps){
    if(!isOpen) return null;
    return(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity"
                onClick={() => onClose()}
            />
            <div
                className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-3xl shadow-2xl transform transition-all animate-snap-in overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pomo-settings-title"
            >
                <button
                    onClick={() => onClose()}
                    className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
                    aria-label="Close settings"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 pt-10">
                    <div className="space-y-2 text-center">
                        <h2 id="pomo-settings-title" className="text-2xl font-bold text-white">
                            Session Settings
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Adjust your focus rhythm before starting a session.
                        </p>
                    </div>

                    <div className="mt-4 space-y-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                            Focus Minutes
                        </label>
                        <input
                            type="number"
                            min={3}
                            value={settingsDraft.focusMinutes}
                            disabled={mode === "speed"}
                            onChange={(e) => onFieldChange("focusMinutes", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />

                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                            Relax Minutes
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={settingsDraft.relaxMinutes}
                            disabled={mode === "speed"}
                            onChange={(e) => onFieldChange("relaxMinutes", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />

                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                            Question Count
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={settingsDraft.questionCount}
                            disabled={mode === "speed"}
                            onChange={(e) => onFieldChange("questionCount", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                            Study Mode
                        </label>
                        <select value={mode} onChange={(e) => {
                            const raw = e.target.value;
                            onModeChange(raw);
                        }}
                            className="w-full bg-white/5 border border-white/10 h-12 text-white text-left placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        >
                            <option value="pomo">Pomo</option>
                            <option value="speed">Speed</option>
                        </select>
                    </div>
                    {error && (
                        <span className='text-sm text-red-500'>{error}</span>
                    )}
                    {message && (
                        <span className='text-sm text-green-500'>{message}</span>
                    )}

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-all"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}