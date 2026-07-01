export const FEEDBACK_STATUS = {
  pending: "pending",
  inProgress: "in-progress",
  complete: "complete",
  notRequired: "not-required",
};

export const CONTENT_TYPES = {
  page: "page",
  step: "step",
  component: "component",
};

export const transition2ContentTracker = [
  {
    id: "transition-2-week-1-page-4-slider",
    type: CONTENT_TYPES.page,
    week: 1,
    page: 4,
    name: "WeekOnePage4Slider",
    path: "./weeks/week1/page4-slider/Page4.jsx",
    sourcePath: "./weeks/week3/page2/Page2.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week1/Week1.jsx",
    notes:
      "Inserted slider page; followed by the existing Week 1 video page before the shifted multi-step activity.",
  },
  {
    id: "transition-2-week-1-page-7-step-3-sentence",
    type: CONTENT_TYPES.step,
    week: 1,
    page: 7,
    step: 3,
    name: "WeekOnePage7SentenceCompletion",
    path: "./weeks/week1/page6/Page6.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week1/Week1.jsx",
    notes:
      "Third step added to current Week 1 Page 7; saved as sentenceAnswer.reason and sentenceAnswer.identity.",
  },
  {
    id: "transition-2-week-1-page-10-reason-sentence",
    type: CONTENT_TYPES.page,
    week: 1,
    page: 10,
    name: "WeekOnePage10ReasonSentence",
    path: "./weeks/week1/page10-reason-sentence/Page10.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week1/Week1.jsx",
    notes:
      "Moved old Week 1 Page 8 steps 2 and 3 into new Page 10; Step 3 renders the vision board from Page 8 selections and the completed sentence.",
  },
  {
    id: "transition-2-week-1-page-11-video-insert",
    type: CONTENT_TYPES.page,
    week: 1,
    page: 11,
    name: "WeekOnePage11InsertedVideo",
    path: "./weeks/week1/page8/Page7.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after new Week 1 Page 10 reason and sentence activity.",
  },
  {
    id: "transition-2-week-1-page-12-scenario-consolidation",
    type: CONTENT_TYPES.page,
    week: 1,
    page: 12,
    name: "WeekOnePage12ScenarioConsolidation",
    path: "./weeks/week1/page9/Page8.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week1/Week1.jsx",
    notes:
      "Consolidated old Week 1 Pages 12, 14, 16, and 18 into one 8-step Page 12; removed the videos between them and shifted the final video to Page 13.",
  },
  {
    id: "transition-2-week-2-page-3-video-duplicate",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 3,
    name: "WeekTwoPage3DuplicateVideo",
    path: "./weeks/week2/page3-duplicate/Page3.jsx",
    sourcePath: "./weeks/week2/page1/Page1.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Duplicate of Week 2 Page 1 video with normal Prev/Next buttons; old Week 2 Page 3 and later pages shifted forward.",
  },
  {
    id: "transition-2-week-2-page-4-question-duplicate",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 4,
    name: "WeekTwoPage4DuplicateQuestion",
    path: "./weeks/week2/page2/Page2.jsx",
    sourcePath: "./weeks/week2/page2/Page2.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week2/Week2.jsx",
    notes: "Duplicate of Week 2 Page 2 question; included in Week 2 feedback as Activity 2.",
  },
  {
    id: "transition-2-week-2-page-6-growth-mindset-drag-drop",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 6,
    name: "WeekTwoPage6GrowthMindsetDragDrop",
    path: "./weeks/week2/page6-growth-mindset/Page6.jsx",
    sourcePath: "../transition-course/weeks/week2/page4/Page4.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week2/Week2.jsx",
    notes:
      "Copied Growth Mindset drag-and-drop from Transition 1 Week 2 Page 4; cards can be swapped later.",
  },
  {
    id: "transition-2-week-2-page-8-first-thought-single-choice",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 8,
    name: "WeekTwoPage8FirstThoughtSingleChoice",
    path: "./weeks/week2/page4/Page4.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week2/Week2.jsx",
    notes:
      "Replaced old text question in place with a single-choice checkbox activity; no page displacement.",
  },
  {
    id: "transition-2-week-2-page-9-video-insert",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 9,
    name: "WeekTwoPage9InsertedVideo",
    path: "./weeks/week2/page7/Page7.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after Week 2 Page 8; old Week 2 Page 9 and later content shifted forward.",
  },
  {
    id: "transition-2-week-2-page-12-step-2-rank-values",
    type: CONTENT_TYPES.step,
    week: 2,
    page: 12,
    step: 2,
    name: "WeekTwoPage12RankValues",
    path: "./weeks/week2/page8/Page8.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week2/Week2.jsx",
    notes:
      "Added second step to rank the five selected values from 1 to 5; saved as answer.rankValues.",
  },
  {
    id: "transition-2-week-2-page-14-value-reflection-single-choice",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 14,
    name: "WeekTwoPage14ValueReflectionSingleChoice",
    path: "./weeks/week2/page14-value-reflection/Page14.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week2/Week2.jsx",
    notes:
      "Inserted single-choice value reflection page; old Week 2 Page 14 shifted to Page 16, with a video inserted as Page 15.",
  },
  {
    id: "transition-2-week-2-page-15-video-insert",
    type: CONTENT_TYPES.page,
    week: 2,
    page: 15,
    name: "WeekTwoPage15InsertedVideo",
    path: "./weeks/week2/page11/Page11.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after the Week 2 Page 14 value reflection question.",
  },
  {
    id: "transition-2-week-3-page-8-support-reflection",
    type: CONTENT_TYPES.page,
    week: 3,
    page: 8,
    name: "WeekThreePage8SupportReflection",
    path: "./weeks/week3/page8-support-reflection/Page8.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week3/Week3.jsx",
    notes:
      "Inserted text response page before the Week 3 budgeting activity; video inserted as Page 9 and old Page 8 shifted to Page 10.",
  },
  {
    id: "transition-2-week-3-page-9-video-insert",
    type: CONTENT_TYPES.page,
    week: 3,
    page: 9,
    name: "WeekThreePage9InsertedVideo",
    path: "./weeks/week3/page9/Page9.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after the Week 3 Page 8 support reflection question.",
  },
  {
    id: "transition-2-week-3-page-10-spending-bucket-single-choice",
    type: CONTENT_TYPES.page,
    week: 3,
    page: 10,
    name: "WeekThreePage10SpendingBucketSingleChoice",
    path: "./weeks/week3/page10-spending-bucket/Page10.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week3/Week3.jsx",
    notes:
      "Inserted single-choice spending bucket question; video inserted as Page 11 and old budgeting activity shifted to Page 12.",
  },
  {
    id: "transition-2-week-3-page-11-video-insert",
    type: CONTENT_TYPES.page,
    week: 3,
    page: 11,
    name: "WeekThreePage11InsertedVideo",
    path: "./weeks/week3/page9/Page9.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after the Week 3 Page 10 spending bucket question.",
  },
  {
    id: "transition-2-week-4-page-2-freedom-regret",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 2,
    name: "WeekFourPage2FreedomRegretQuestion",
    path: "./weeks/week4/page2/Page2.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Split old Week 4 Page 2; this is now a standalone text activity with no step indicator.",
  },
  {
    id: "transition-2-week-4-page-4-university-freedom",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 4,
    name: "WeekFourPage4UniversityFreedomQuestion",
    path: "./weeks/week4/page4/Page4.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Old Week 4 Page 2 Step 2 split into its own standalone page after the Week 4 Page 3 video.",
  },
  {
    id: "transition-2-week-4-page-5-video-insert",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 5,
    name: "WeekFourPage5InsertedVideo",
    path: "./weeks/week4/page5/Page5.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video before the freedom meaning question; old Week 4 Page 5 and later pages shifted forward.",
  },
  {
    id: "transition-2-week-4-page-10-week-reflection",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 10,
    name: "WeekFourPage8WeekReflection",
    path: "./weeks/week4/page8/Page8.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Inserted text response page; shifted to Page 10 after the Week 4 Page 5 video insert.",
  },
  {
    id: "transition-2-week-4-page-11-video-insert",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 11,
    name: "WeekFourPage9InsertedVideo",
    path: "./weeks/week4/page9/Page9.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after the Week 4 week reflection question; shifted to Page 11 after the Page 5 video insert.",
  },
  {
    id: "transition-2-week-4-page-14-step-2-social-skill-rating",
    type: CONTENT_TYPES.step,
    week: 4,
    page: 14,
    step: 2,
    name: "WeekFourPage12SocialSkillRating",
    path: "./weeks/week4/Page12/Page12.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Converted shifted Week 4 Page 12 into a two-step activity; Step 2 captures four 1-5 social skill confidence ratings.",
  },
  {
    id: "transition-2-week-4-page-16-exam-choice",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 16,
    name: "WeekFourPage14ExamChoice",
    path: "./weeks/week4/page14-exam-choice/Page14.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Inserted multiple-choice exam planning question; video inserted as Page 15 and old Week 4 Page 14 shifted to Page 16.",
  },
  {
    id: "transition-2-week-4-page-17-video-insert",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 17,
    name: "WeekFourPage15InsertedVideo",
    path: "./weeks/week4/page13/Page13.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Inserted video after the new Week 4 Page 14 exam choice question.",
  },
  {
    id: "transition-2-week-4-page-20-james-outcome-self-audit",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 20,
    name: "WeekFourPage20JamesOutcomeSelfAudit",
    path: "./weeks/week4/page14/Page14.jsx",
    feedbackStatus: FEEDBACK_STATUS.complete,
    feedbackPath: "./feedback/weeks/week4/Week4.jsx",
    notes:
      "Combined the James outcome choice with the old Week 4 Page 22 self-audit into one four-step activity.",
  },
  {
    id: "transition-2-week-4-page-21-video-insert",
    type: CONTENT_TYPES.page,
    week: 4,
    page: 21,
    name: "WeekFourPage19InsertedVideo",
    path: "./weeks/week4/page13/Page13.jsx",
    feedbackStatus: FEEDBACK_STATUS.notRequired,
    feedbackPath: null,
    notes:
      "Video now follows the combined Week 4 Page 20 four-step activity; assessment starts at Page 22.",
  },
  /*
   * Add every new Transition 2 page or reusable component here when it is created.
   *
   * Example:
   * {
   *   id: "transition-2-week-5-page-11",
   *   type: CONTENT_TYPES.page,
   *   week: 5,
   *   page: 11,
   *   name: "WeekFivePage11",
   *   path: "./weeks/week5/page11/Page11.jsx",
   *   feedbackStatus: FEEDBACK_STATUS.pending,
   *   feedbackPath: "./feedback/weeks/week5/Week5.jsx",
   *   notes: "Track answer rendering and admin feedback controls.",
   * },
   */
];

export const getTrackedTransition2Pages = () =>
  transition2ContentTracker.filter((item) => item.type === CONTENT_TYPES.page);

export const getTrackedTransition2Components = () =>
  transition2ContentTracker.filter(
    (item) => item.type === CONTENT_TYPES.component
  );

export const getTrackedTransition2ItemsByWeek = (week) =>
  transition2ContentTracker.filter((item) => item.week === week);

export const getTransition2ItemsNeedingFeedback = () =>
  transition2ContentTracker.filter(
    (item) => item.feedbackStatus === FEEDBACK_STATUS.pending
  );
