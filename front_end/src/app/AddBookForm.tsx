import React from 'react';

function AddBookForm() {
  const openModal = () => {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div>
      <button className="btn" onClick={openModal}>Open Modal</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* If there is a button in the form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AddBookForm;
