import React, { useState, useRef, useEffect } from "react";

function CustomDropDown({ value, onChange, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div
      className="position-relative mx-auto transition2-week3-dropdown"
      ref={dropdownRef}
      style={{ width: "min(100%, 720px)" }}
    >
      <label className="py-1 border-0  px-2 w-100 d-block mx-auto small-input-label">
        <div
          className="border-0 bg-transparent border-outline-0 form-control dropdown-small-input d-flex align-items-center justify-content-between cursor-pointer"
          style={{
            width: "100%",
            maxWidth: "100%",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? (
            <div style={{ flex: "1 1 auto", paddingRight: "2rem" }}>
              <div className="text-gray">
                {selectedOption.id}. {selectedOption.text}
              </div>
              {selectedOption.subText && (
                <div className="text-primary" style={{ fontSize: "0.9rem" }}>
                  {selectedOption.subText}
                </div>
              )}
            </div>
          ) : (
            <span
              className="text-muted"
              style={{ flex: "1 1 auto", paddingRight: "2rem" }}
            >
              Choose an answer
            </span>
          )}
        </div>
      </label>

      {isOpen && (
        <div
          className="position-absolute w-100 bg-white border rounded shadow-lg transition2-week3-dropdown-menu"
          style={{
            top: "100%",
            left: 0,
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <div
            className="p-2 cursor-pointer"
            onClick={() => handleOptionClick("")}
            style={{
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <span className="text-muted">Choose an answer</span>
          </div>
          {options.map((option, index) => (
            <div
              key={index}
              className="p-3 cursor-pointer"
              onClick={() => handleOptionClick(option.id)}
              style={{
                cursor: "pointer",
                borderBottom:
                  index < options.length - 1 ? "1px solid #eee" : "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <div className="text-gray" style={{ fontWeight: "500" }}>
                {option.text}
              </div>
              {option.subText && (
                <div
                  className="text-primary mt-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  {option.subText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropDown;
