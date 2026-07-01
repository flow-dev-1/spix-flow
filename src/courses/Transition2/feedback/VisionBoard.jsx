import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

import confidentImg from "@/assets/transition-2-images/week1/page6/confident.png";
import independentImg from "@/assets/transition-2-images/week1/page6/independent.png";
import disciplinedImg from "@/assets/transition-2-images/week1/page6/disciplined.png";
import socialImg from "@/assets/transition-2-images/week1/page6/social.png";
import curiousImg from "@/assets/transition-2-images/week1/page6/curious.png";
import resilientImg from "@/assets/transition-2-images/week1/page6/resilient.png";
import creativeImg from "@/assets/transition-2-images/week1/page6/creative.png";
import leaderImg from "@/assets/transition-2-images/week1/page6/leader.png";

export default function VisionBoard({ answers }) {
  const futureSelfOptions = [
    { label: "Confident", image: confidentImg },
    { label: "Independent", image: independentImg },
    { label: "Disciplined", image: disciplinedImg },
    { label: "Social", image: socialImg },
    { label: "Curious", image: curiousImg },
    { label: "Resilient", image: resilientImg },
    { label: "Creative", image: creativeImg },
    { label: "Leader", image: leaderImg },
  ];

  const checkboxAnswers =
    answers?.week1FutureSelf?.checkboxAnswers ||
    answers?.week1Vision?.checkboxAnswers ||
    {};
  const reason =
    answers?.week1Vision?.textAnswer ||
    (typeof answers?.week1Vision === "string" ? answers.week1Vision : "");
  const sentenceAnswer = answers?.week1Vision?.sentenceAnswer || {};
  const rankValues = answers?.week2Values?.rankValues || {};
  const selectedValues = answers?.week2Values?.selectedValues || {};
  const valueItems = [
    "Honesty",
    "Respect",
    "Kindess",
    "Responsibility",
    "Family",
    "Faith",
    "Hardwork",
    "Growth",
    "Justice",
    "Balance",
  ];

  const rankedValuesFromRanks = Object.entries(rankValues)
    .filter(([, rank]) => rank)
    .sort(([, firstRank], [, secondRank]) => Number(firstRank) - Number(secondRank))
    .map(([value, rank]) => ({ value, rank }))
    .slice(0, 5);
  const rankedValues =
    rankedValuesFromRanks.length > 0
      ? rankedValuesFromRanks
      : Object.keys(selectedValues)
          .filter((key) => selectedValues[key])
          .map((key, index) => ({
            value: valueItems[Number(key)],
            rank: index + 1,
          }))
          .filter((item) => item.value)
          .slice(0, 5);

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "38px 42px",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        color: "#4f5966",
      }}
    >
      <h1
        style={{
          margin: "0 0 18px",
          textAlign: "center",
          color: "#63d1de",
          fontSize: "58px",
          fontWeight: 800,
          letterSpacing: 0,
          lineHeight: 1,
        }}
      >
        flow
      </h1>

      <div style={{ textAlign: "center", marginBottom: 38 }}>
        <div
          style={{
            display: "inline-block",
            minWidth: 330,
            padding: "9px 28px",
            backgroundColor: "#3498d4",
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 800,
            lineHeight: 1,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          MY VISION BOARD
        </div>
      </div>

      <p style={sectionTitleStyle}>
        1. Choose 3-4 that best describe your future self.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px 20px",
          margin: "12px 0 18px",
        }}
      >
        {futureSelfOptions.map((option, index) => (
          <div
            key={option.label}
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 82,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                borderRadius: 8,
              }}
            >
              <img
                src={option.image}
                alt={option.label}
                style={{ maxWidth: 92, maxHeight: 82, objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                width: "100%",
                minHeight: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 5,
                backgroundColor: "#dfcef8",
                color: "#263044",
                fontSize: 11,
                lineHeight: 1,
                boxSizing: "border-box",
              }}
            >
              <img
                src={checkboxAnswers[index] ? checkedImage : uncheckedImage}
                alt=""
                style={{ width: 18, height: 18, flex: "0 0 auto" }}
              />
              <span>{option.label}</span>
            </div>
          </div>
        ))}
      </div>

      <p style={sectionTitleStyle}>
        2. Now, in a structured sentence, I want you to write your reason for
        your next step after secondary school. Why are you making that
        particular decision?
      </p>

      <div style={answerBoxStyle}>{reason || "No answer provided."}</div>

      <p style={sectionTitleStyle}>2. Complete this sentence:</p>

      <div style={answerBoxStyle}>
        "Complete this sentence: I am choosing to pursue higher
        education/further training because{" "}
        <span style={underlineStyle}>
          {sentenceAnswer.reason || "________________________"}
        </span>
        , and the person I want to become is someone who{" "}
        <span style={underlineStyle}>
          {sentenceAnswer.identity || "________________________"}
        </span>
        ."
      </div>

      <p style={sectionTitleStyle}>
        3. Choose the top 5 Values that matter most to you right now, then rank
        them from 1 to 5, with 1 being the most important.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rankedValues.length > 0 ? (
          rankedValues.map(({ value, rank }) => (
            <span
              key={value}
              style={{
                width: "fit-content",
                padding: "5px 12px",
                borderRadius: 999,
                backgroundColor: "#eeeeef",
                color: "#6a717c",
                fontSize: 15,
                lineHeight: 1,
              }}
            >
              {rank}. {value}
            </span>
          ))
        ) : (
          <span style={{ color: "#6a717c", fontSize: 15 }}>
            No ranked values provided.
          </span>
        )}
      </div>
    </div>
  );
}

const sectionTitleStyle = {
  margin: "0 0 8px",
  color: "#275dad",
  fontSize: 15,
  fontWeight: 800,
  lineHeight: 1.2,
};

const answerBoxStyle = {
  margin: "0 0 18px",
  padding: "16px 18px",
  borderRadius: 18,
  backgroundColor: "#f0f1f4",
  color: "#656d78",
  fontSize: 17,
  lineHeight: 1.25,
};

const underlineStyle = {
  display: "inline-block",
  minWidth: 185,
  borderBottom: "1px solid #6e7480",
};
