"use client";

interface ModalProps {
  isModalOpen: boolean;
  selectedImage: string | null;
  closeModal: () => void;
}

/**
 * 画像表示用モーダルコンポーネント
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isModalOpen - モーダルが表示中かどうか
 * @param {string|null} props.selectedImage - モーダル内で表示する画像URL
 * @param {Function} props.closeModal - モーダルを閉じるためのコールバック（引数なし）
 * @returns {JSX.Element|null} モーダルUI（非表示時はnull）
 * @description
 * 画像クリックで拡大表示し、背景クリックまたはcloseModalで閉じられるモーダル。
 */
const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  selectedImage,
  closeModal,
}) => {
  if (!isModalOpen || !selectedImage) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-4 rounded shadow-lg max-w-fit max-h-[90vh] overflow-auto">
        <img
          src={selectedImage}
          alt="Large view"
          className="w-auto max-w-[90vw] h-auto max-h-[70vh] mx-auto rounded-md shadow-md"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default Modal;
