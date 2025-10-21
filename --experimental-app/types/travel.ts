export interface Travel {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  user_id: string;
  destinations?: Destination[];
  reviews?: Review[];
}

export interface Destination {
  id: string;
  name: string;
  description: string | null;
  day: number | null;
  order_num: number | null;
  created_at: string;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
}

export interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  userId: string;
  onTravelAdded: (travel: Travel) => void;
}

export interface TravelFormState {
  location: string;
  reviewContent: string;
  rating: number;
  isPublic: boolean;
  loading: boolean;
  destinations: Array<{
    name: string;
    description: string;
    day: number;
  }>;
  destName: string;
  destDesc: string;
  destDay: number;
}

export type TravelFormAction =
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_REVIEW_CONTENT"; payload: string }
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_IS_PUBLIC"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DEST_NAME"; payload: string }
  | { type: "SET_DEST_DESC"; payload: string }
  | { type: "SET_DEST_DAY"; payload: number }
  | { type: "ADD_DESTINATION" }
  | { type: "REMOVE_DESTINATION"; payload: number }
  | { type: "RESET_FORM" };

export const initialTravelFormState: TravelFormState = {
  location: "",
  reviewContent: "",
  rating: 5,
  isPublic: true,
  loading: false,
  destinations: [],
  destName: "",
  destDesc: "",
  destDay: 1,
};
