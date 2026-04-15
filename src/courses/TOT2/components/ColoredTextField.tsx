import React from "react";

function ColoredTextField({ handleChange, value, color, extraMobileStyles }) {
    console.log(extraMobileStyles)
    return (
        <label
            className={`colored-star-input border-0 ${color}-rectangle-colored-small-input-label  ${color}-colored-input-label p-5`}
            style={{ display: "flex", flexGrow: 1 }}
        >
            <textarea
                className={`border-0 bg-transparent no-scrollbar w-100 resize-none text-center colored-text-box ${extraMobileStyles}`}
                placeholder=""
                value={value}
                onChange={handleChange}
                style={{
                    outline: "none",      // ✅ remove blue outline
                    boxShadow: "none",    // ✅ remove shadow highlight
                }}
                onFocus={(e) => e.target.style.outline = "none"} // extra safety
            ></textarea>
        </label>
    );
}

export default ColoredTextField;
