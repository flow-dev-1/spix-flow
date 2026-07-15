const DRAFT_PREFIX = "flow-transition2-assessment-draft";

const getDraftKey = (userAnswers, week) => {
  const enrollmentId = userAnswers?.courseEnrollmentId || "unknown-enrollment";
  return `${DRAFT_PREFIX}:${enrollmentId}:week-${week}`;
};

export const getAssessmentDraft = (userAnswers, week) => {
  try {
    const rawDraft = localStorage.getItem(getDraftKey(userAnswers, week));
    return rawDraft ? JSON.parse(rawDraft) : undefined;
  } catch {
    return undefined;
  }
};

export const saveAssessmentDraft = (userAnswers, week, answers) => {
  try {
    localStorage.setItem(
      getDraftKey(userAnswers, week),
      JSON.stringify(answers)
    );
  } catch {
    // Draft storage is best-effort only.
  }
};

export const clearAssessmentDraft = (userAnswers, week) => {
  try {
    localStorage.removeItem(getDraftKey(userAnswers, week));
  } catch {
    // Draft storage is best-effort only.
  }
};
