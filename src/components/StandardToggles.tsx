// add toggles for markscheme and question image
"use client"
import SliderToggle from "./SliderInput"
import React from "react"

interface StandardTogglesProps {
    displayMarkscheme: boolean;
    setDisplayMarkscheme: (displayMarkscheme: boolean) => void;
    displayAsImages: boolean;
    setDisplayAsImages: (displayAsImages: boolean) => void;
}

const StandardToggles: React.FC<StandardTogglesProps> = ({
    displayMarkscheme,
    setDisplayMarkscheme,
    displayAsImages,
    setDisplayAsImages,
}) => {
    return (
        <div className="flex flex-col md:flex-row">
            <SliderToggle
                left="Display question"
                right="Display markscheme"
                checkedValue={displayMarkscheme}
                onChange={setDisplayMarkscheme}
            />
            <SliderToggle
                left="Display text"
                right="Display images"
                checkedValue={displayAsImages}
                onChange={setDisplayAsImages}
            />
        </div>
    )
}

export default StandardToggles;