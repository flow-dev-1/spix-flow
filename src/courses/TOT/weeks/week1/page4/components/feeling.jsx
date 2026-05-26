import feeling1 from "@/assets/tot-images/feeling1.png";
import feeling2 from "@/assets/tot-images/feeling2.png";
import feeling3 from "@/assets/tot-images/feeling3.png";
import feeling4 from "@/assets/tot-images/feeling4.png";
import feeling5 from "@/assets/tot-images/feeling5.png";

import "../page4.css";

export default function Feeling({ answers = [], setAnswers }) {
  // Find if there's already a selected feeling
  const selectedFeeling = answers.find((a) => a.name === "feeling")?.value;

  const handleEmojiClick = (value) => {
    setAnswers((prev) => {
      const otherAnswers = prev.filter((a) => a.name !== "feeling");
      return [...otherAnswers, { name: "feeling", value }];
    });
  };

  return (
    <div className="p-1 p-md-4 feeling-modal">
      <div className="tot-text">
        <div className="px-1 px-md-5 text-center">
          <h1 className="text-blue mb-4" style={{ fontSize: 1 + "em" }}>
            How are you feeling today? <br /> Select the emoji that best
            reflects your mood.
          </h1>
        </div>

        <div className="d-flex justify-content-center review-buttons gap-3">
          <button
            className={`btn sad ${
              selectedFeeling === "feeling1" ? "selected" : ""
            }`}
            onClick={() => handleEmojiClick("feeling1")}
          >
            <img src={feeling1} alt="Feeling 1" />
          </button>
          <button
            className={`btn sad ${
              selectedFeeling === "feeling2" ? "selected" : ""
            }`}
            onClick={() => handleEmojiClick("feeling2")}
          >
            <img src={feeling2} alt="Feeling 2" />
          </button>
          <button
            className={`btn sad ${
              selectedFeeling === "feeling3" ? "selected" : ""
            }`}
            onClick={() => handleEmojiClick("feeling3")}
          >
            <img src={feeling3} alt="Feeling 3" />
          </button>
          <button
            className={`btn sad ${
              selectedFeeling === "feeling4" ? "selected" : ""
            }`}
            onClick={() => handleEmojiClick("feeling4")}
          >
            <img src={feeling4} alt="Feeling 4" />
          </button>
          <button
            className={`btn sad ${
              selectedFeeling === "feeling5" ? "selected" : ""
            }`}
            onClick={() => handleEmojiClick("feeling5")}
          >
            <img src={feeling5} alt="Feeling 5" />
          </button>
        </div>
      </div>
    </div>
  );
}
