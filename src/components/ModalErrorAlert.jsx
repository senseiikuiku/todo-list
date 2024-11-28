import React from "react";

export default function ModalErrorAlert({
   title,
   content,
   cancel,
   open = true,
   onCloseAlert,
}) {
   return (
      <>
         {/* Modal cảnh báo lỗi */}
         {open && (
            <div className="overlay" style={{ zIndex: 100 }}>
               <div className="modal-custom">
                  <div className="modal-header-custom">
                     <h5>{title}</h5>
                     <i onClick={onCloseAlert} className="fas fa-xmark" />
                  </div>
                  <div className="modal-body-custom">
                     <p>{content}</p>
                  </div>
                  <div className="modal-footer-footer">
                     <button onClick={onCloseAlert} className="btn btn-light">
                        {cancel}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
