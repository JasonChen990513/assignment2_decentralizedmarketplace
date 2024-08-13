import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { setGood, search, filter } from "../store/goodSlice";

export const useActionsCreator = () => {
    const dispatch = useDispatch();
    return bindActionCreators({ setGood, search, filter }, dispatch);
}



