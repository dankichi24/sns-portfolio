"use client";

interface ModalProps {
  isModalOpen: boolean;
  selectedImage: string | null;
  closeModal: () => void;
}

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
