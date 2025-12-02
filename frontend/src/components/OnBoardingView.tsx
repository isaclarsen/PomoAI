import { useState } from "react";

interface OnboardingViewProps {
    // Vi skickar upp datan till App.tsx som gör API-anropet.
    // Det håller vyn "dum" och logiken centraliserad.
    onSubmit: (displayName: string, educationLevel: string) => void;
    isSubmitting: boolean; // För att inaktivera knappen när vi laddar
}

function OnboardingView({ onSubmit, isSubmitting }: OnboardingViewProps) {
    const [displayName, setDisplayName] = useState("");
    const [educationLevel, setEducationLevel] = useState("HIGH_SCHOOL"); // Default värde matchar Backend ENUM

    const handleSubmit = () => {
        if (!displayName.trim()) {
            alert("Please fill in a name"); // Enkel validering
            return;
        }
        onSubmit(displayName, educationLevel);
    };

    return (
        <div className="onboarding-container">
            <p>We need some more information about you to make your experience better</p>

            <div className="form-group">
                <label>What should we call you?</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name..."
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label>What's your education level?</label>
                <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    disabled={isSubmitting}
                >
                    {/* Värdena här MÅSTE matcha din Java ENUM exakt (eller hanteras case-insensitive i backend) */}
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="UNIVERSITY">Univeristy/College</option>
                    <option value="VOCATIONAL">Vocational</option>
                    <option value="SELF_TAUGHT">Self taught</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Get started"}
            </button>
        </div>
    );
}

export default OnboardingView;