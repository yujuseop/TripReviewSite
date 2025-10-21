import { useReducer } from "react";
import {
  TravelFormState,
  TravelFormAction,
  initialTravelFormState,
} from "@/types/travel";

export function travelFormReducer(
  state: TravelFormState,
  action: TravelFormAction
): TravelFormState {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_REVIEW_CONTENT":
      return { ...state, reviewContent: action.payload };
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_IS_PUBLIC":
      return { ...state, isPublic: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DEST_NAME":
      return { ...state, destName: action.payload };
    case "SET_DEST_DESC":
      return { ...state, destDesc: action.payload };
    case "SET_DEST_DAY":
      return { ...state, destDay: action.payload };
    case "ADD_DESTINATION":
      if (!state.destName.trim()) return state;
      return {
        ...state,
        destinations: [
          ...state.destinations,
          {
            name: state.destName.trim(),
            description: state.destDesc.trim(),
            day: state.destDay,
          },
        ],
        destName: "",
        destDesc: "",
        destDay: 1,
      };
    case "REMOVE_DESTINATION":
      return {
        ...state,
        destinations: state.destinations.filter((_, i) => i !== action.payload),
      };
    case "RESET_FORM":
      return initialTravelFormState;
    default:
      return state;
  }
}

export function useTravelForm() {
  const [state, dispatch] = useReducer(
    travelFormReducer,
    initialTravelFormState
  );

  const addDestination = () => {
    dispatch({ type: "ADD_DESTINATION" });
  };

  const removeDestination = (index: number) => {
    dispatch({ type: "REMOVE_DESTINATION", payload: index });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return {
    state,
    dispatch,
    addDestination,
    removeDestination,
    resetForm,
  };
}
