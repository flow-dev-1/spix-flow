import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userReducer";
import jwtReducer from "./jwtReducer";
import adminReducer from "./adminReducer";
import navigationReducer from "./navigationSlice";
import feedbackReducer from "./feedbackSlice";
import userAnswersReducer from "./userAnswersReducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["navigation"],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: jwtReducer,
  admin: adminReducer,
  navigation: navigationReducer,
  feedback: feedbackReducer,
  userAnswer: userAnswersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
