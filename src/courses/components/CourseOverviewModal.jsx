import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./courseOverviewModal.css";

const overviews = {
  tot: {
    title: "SEL & Positive Psychology for Educators",
    audience: "For educators",
    description:
      "Strengthen your teaching practice through Social and Emotional Learning and Positive Psychology. You will develop practical skills in emotional regulation, classroom relationships, resilience, inclusive teaching, and teacher wellbeing.",
    outcomes: [
      "Apply core SEL competencies in everyday classroom practice.",
      "Build supportive relationships and emotionally safe classrooms.",
      "Create a sustainable SEL implementation plan for your learners.",
    ],
  },
  tot2: {
    title: "Leaving No Learner Behind",
    audience: "For educators",
    description:
      "Build inclusive classrooms where every learner can participate and thrive. This course explores learner differences, accessible teaching strategies, empathy, collaboration, and sustainable teacher wellbeing.",
    outcomes: [
      "Recognise and remove barriers to classroom participation.",
      "Adapt teaching strategies for different strengths and needs.",
      "Work effectively with families, colleagues, and support systems.",
    ],
  },
  transition: {
    title: "From Primary to Secondary School",
    audience: "For students",
    description:
      "Prepare for the move to secondary school with confidence. You will explore mindset, values, relationships, time management, goal setting, resilience, and healthy coping strategies.",
    outcomes: [
      "Understand yourself and what matters to you.",
      "Manage new responsibilities, relationships, and challenges.",
      "Set meaningful goals and prepare for secondary school life.",
    ],
  },
  transition2: {
    title: "Preparing for Your Next Chapter",
    audience: "For students",
    description:
      "Prepare for life after secondary school, whether your next step is university, employment, skills training, or another pathway. Build confidence, independence, resilience, and practical coping skills.",
    outcomes: [
      "Make purposeful choices about your next step.",
      "Build healthy relationships and manage growing independence.",
      "Respond to setbacks with confidence and resilience.",
    ],
  },
};

const CourseOverviewModal = ({ courseKey, currentWeek, currentPage }) => {
  const storageKey = `flow-course-overview-seen-${courseKey}`;
  const [isOpen, setIsOpen] = useState(false);
  const overview = overviews[courseKey];

  useEffect(() => {
    if (!overview || currentWeek !== 1 || currentPage !== 1) {
      setIsOpen(false);
      return;
    }

    try {
      setIsOpen(localStorage.getItem(storageKey) !== "true");
    } catch {
      setIsOpen(true);
    }
  }, [currentPage, currentWeek, overview, storageKey]);

  if (!overview || !isOpen) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // The overview can still be dismissed when storage is unavailable.
    }
    setIsOpen(false);
  };

  return (
    <div className="course-overview-backdrop" role="presentation">
      <section
        className="course-overview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${courseKey}-overview-title`}
      >
        <button
          type="button"
          className="course-overview-close"
          onClick={dismiss}
          aria-label="Close course overview"
        >
          <X aria-hidden="true" size={22} />
        </button>

        <p className="course-overview-audience">{overview.audience}</p>
        <h1 id={`${courseKey}-overview-title`}>{overview.title}</h1>
        <p className="course-overview-description">{overview.description}</p>

        <h2>What you will learn</h2>
        <ul>
          {overview.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>

        <button type="button" className="course-overview-continue" onClick={dismiss}>
          Start course
          <ArrowRight aria-hidden="true" size={20} />
        </button>
      </section>
    </div>
  );
};

export default CourseOverviewModal;
