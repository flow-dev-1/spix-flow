import sadEmoji from "@/assets/selfawareness-images/sadEmoji.png";
import okayEmoji from "@/assets/selfawareness-images/okayEmoji.png";
import happyEmoji from "@/assets/selfawareness-images/happyEmoji.png";
import { hideReviewPopup } from "@/store/navigationSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { adminData } from "@/store/adminReducer";

export default function PopUp() {
  const dispatch = useDispatch();
  const adminDatas = useSelector(adminData);

  const handleEmojiClick = (value) => {

    if (adminDatas.isAdmin){
      dispatch(hideReviewPopup());
      return 
      // window.close();
    } 
    if (!value) {
      toast.error("Something went wrong!")

      // This is the correct thing. Temprory commented out!
      return
    }
    try {
      localStorage.setItem("transition2-course-reaction", value);
    } catch {
      // Ignore storage quota/private mode failures.
    }
    toast.dismiss()
    toast.success('Your feedback is really appreciated!');
    dispatch(hideReviewPopup());
  }


  return (
    <div className="transition-review-overlay" role="dialog" aria-modal="true">
      <div className="transition-review-popup review-popup">
        <div>
          <h1 className="review">
            Review this Course
          </h1>
          <p className="text-center my-2">
            Kindly help us with your feedback. <br /> This will help us make this
            course better.
          </p>
          <div
            className="review-buttons"
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
    </div>
  );
}
