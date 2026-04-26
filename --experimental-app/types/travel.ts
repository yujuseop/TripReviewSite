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
  category?: string | null;
  lat?: number | null;
  lng?: number | null;
  cost?: number | null;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
  images?: string[];
  mood_tags?: string[];
  one_line_summary?: string | null;
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
  oneLineSummary: string;
  moodTags: string[];
  rating: number;
  isPublic: boolean;
  loading: boolean;
  destinations: Array<{
    name: string;
    description: string;
    day: number;
    cost: number;
    category: string;
    lat: number | null;
    lng: number | null;
  }>;
  destName: string;
  destDesc: string;
  destDay: number;
  destCost: number;
  destCategory: string;
  destLat: number | null;
  destLng: number | null;
  destPlaceName: string;
  selectedImages: File[];
  imagePreviewUrls: string[];
}

export type TravelFormAction =
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_REVIEW_CONTENT"; payload: string }
  | { type: "SET_ONE_LINE_SUMMARY"; payload: string }
  | { type: "TOGGLE_MOOD_TAG"; payload: string }
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_IS_PUBLIC"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DEST_NAME"; payload: string }
  | { type: "SET_DEST_DESC"; payload: string }
  | { type: "SET_DEST_DAY"; payload: number }
  | { type: "SET_DEST_COST"; payload: number }
  | { type: "SET_DEST_CATEGORY"; payload: string }
  | { type: "SET_DEST_LAT"; payload: number | null }
  | { type: "SET_DEST_LNG"; payload: number | null }
  | { type: "SET_DEST_PLACE_NAME"; payload: string }
  | { type: "ADD_DESTINATION" }
  | { type: "REMOVE_DESTINATION"; payload: number }
  | { type: "SET_IMAGES"; payload: File[] }
  | { type: "REMOVE_IMAGE"; payload: number }
  | { type: "RESET_FORM" };

export const initialTravelFormState: TravelFormState = {
  location: "",
  reviewContent: "",
  oneLineSummary: "",
  moodTags: [],
  rating: 5,
  isPublic: true,
  loading: false,
  destinations: [],
  destName: "",
  destDesc: "",
  destDay: 1,
  destCost: 0,
  destCategory: "관광지",
  destLat: null,
  destLng: null,
  destPlaceName: "",
  selectedImages: [],
  imagePreviewUrls: [],
};
