import sadEmoji from "@/assets/selfawareness-images/sadEmoji.png";
import okayEmoji from "@/assets/selfawareness-images/okayEmoji.png";
import happyEmoji from "@/assets/selfawareness-images/happyEmoji.png";
import { hideReviewPopup } from "@/store/navigationSlice";
import { useSelector, useDispatch } from "react-redux";
import { userAnswer, updateData } from "@/store/userAnswersReducer";
import { toast } from "react-toastify";
import { adminData } from "@/store/adminReducer";

export default function PopUp() {
  const dispatch = useDispatch();
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const handleEmojiClick = (value) => {
    if (adminDatas.isAdmin) return window.close();
    if (!value) return;

    toast.dismiss();
    toast.success("Your feedback is really appreciated!");
    dispatch(updateData({
      course: null,
      courseEnrollmentId: null,
      week: 1,
      activities: [],
      assessments: [],
    }));
    dispatch(hideReviewPopup());
  };

  return (
    <div
      style={{ width: "620px", paddingTop: "30px" }}
      className="review-popup modal-content position-absolute top-50 start-50 translate-middle"
    >
      <div className="">
        <h1 style={{ margin: "0 auto" }} className="review">
          Review this Course
        </h1>
        <p className="text-center my-2">
          Kindly help us with your feedback. <br /> This will help us make this
          course better.
        </p>
        <div
          style={{ width: "350px", margin: "1rem auto" }}
          className="d-flex review-buttons"
        >
          <button className="btn sad" onClick={() => handleEmojiClick("dislike")}>
            <img src={sadEmoji} alt="sadEmoji" />
            <p className="text-center mt-2">Sad</p>
          </button>
          <button className="btn sad" onClick={() => handleEmojiClick("neutral")}>
            <img src={okayEmoji} alt="okayEmoji" />
            <p className="text-center mt-2">Okay</p>
          </button>
          <button className="btn sad" onClick={() => handleEmojiClick("like")}>
            <img src={happyEmoji} alt="happyEmoji" />
            <p className="text-center mt-2">Happy</p>
          </button>
        </div>
      </div>
    </div>
  );
}
