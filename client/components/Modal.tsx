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
  if (!isModalOpen || !selectedImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-screen-lg max-h-screen overflow-auto">
        <img
          src={selectedImage}
          alt="Large view"
          className="w-auto max-w-[90vw] h-auto max-h-[80vh] mx-auto rounded-md shadow-md"
          style={{ objectFit: "contain" }}
        />
        <div className="flex justify-center mt-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            onClick={closeModal}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
