import { useState } from "react";

interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export default function TravelModal({
  isOpen,
  onClose,
  selectedDate,
}: TravelModalProps) {
  const [location, setLocation] = useState("");
  const [review, setReview] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSave = async () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex item-center justify-center bg-black/50 text-black">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-bold">
          {selectedDate.toLocaleDateString()}여행 추가
        </h2>
        <input
          type="text"
          placeholder="여행지 입력"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full my-2"
        />

        <textarea
          placeholder="리뷰 작성"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="border p-2 w-full my-2"
        />

        <label className="flex itemts-center gap-2 my-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          나만 보기
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="p-2 border">
            취소
          </button>
          <button onClick={handleSave} className="p-2 border">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
