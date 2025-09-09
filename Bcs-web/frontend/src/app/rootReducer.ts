import { combineReducers } from "@reduxjs/toolkit";
import appSlice from "../slices/appSlice";

const rootReducer = combineReducers({
  app: appSlice,
});

export default rootReducer;
