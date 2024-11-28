import React, { useState } from "react";
import Modal from "./ModalDelete";
import ModalDelete from "./ModalDelete";
import ModalErrorAlert from "./ModalErrorAlert";

export default function Todolist() {
   const [inputValue, setInputValue] = useState("");
   const [error, setError] = useState("");
   const [listJob, setListJob] = useState(() => {
      const jobLocal = JSON.parse(localStorage.getItem("jobs")) || [];
      return jobLocal;
   });
   const [isShowModal, setIsShowModal] = useState(false);
   const [idDelete, setIdDelete] = useState(null);
   const [isInputEdit, setIsInputEdit] = useState(false);
   const [idEdit, setIdEdit] = useState(null);
   const [editValue, setEditValue] = useState("");
   const [isShowErrorAlert, setIsShowErrorAlert] = useState(false);
   const [activeTab, setActiveTab] = useState("all");

   const items = [
      {
         id: 1,
         itemName: "all",
         description: "Tất cả",
      },
      {
         id: 2,
         itemName: "completed",
         description: "Hoàn thành",
      },
      {
         id: 3,
         itemName: "incompleted",
         description: "Chưa hoàn thành",
      },
   ];

   // Validate dữ liệu đầu vào
   const validateData = (value) => {
      if (!value) {
         setError("Tên công việc không được để trống");
      } else {
         setError("");
      }
   };

   // Lấy giá trị bên trong input
   const handleChangeInput = (e) => {
      setInputValue(e.target.value);

      // Validate dữ liệu
      validateData(e.target.value);
   };

   // Hàm lưu dữ liệu trên localStorage và cập nhật lại dữ liệu cho component
   const saveDate = (key, value) => {
      // Cập nhật dữ liệu vào state của component
      setListJob(value);

      // Lưu dữ liệu lên localStorage
      localStorage.setItem(key, JSON.stringify(value));
   };

   // Submit form
   const handleSubmit = (e) => {
      // Ngăn chặn sự kiện load lại trang khi submit form
      e.preventDefault();

      // Validate dữ liệu đầu vào
      validateData(inputValue);

      if (inputValue) {
         // Tiến hành thêm mới công việc vào mảng
         // Id, title, status
         const newJob = {
            id: Math.ceil(Math.random() * 1000000),
            title: inputValue,
            status: false,
         };

         // Thêm công việc mới đó vào mảng
         // Dùng spread-operator
         const jobClone = [newJob, ...listJob];

         saveDate("jobs", jobClone);

         // Clear giá trị trong input
         setInputValue("");
      }
   };

   // focus vào input công việc
   const handleInputFocus = () => {
      const input = document.getElementById("form2");
      input.focus();
   };

   // Cập nhật trạng thái công việc
   const handleChangeStatus = (id) => {
      // Cập nhật lại công việc trong mảng theo id
      // B1: Tìm vị trí của công việc trong mảng cần cập nhật
      const findIndexJob = listJob.findIndex((job) => job.id === id);

      // B2: Từ vị trí, truy cập để lấy ra đối tượng công việc
      if (findIndexJob !== -1) {
         // B3: Từ đối tượng job, truy cập vào trường status để cập nhật lại
         listJob[findIndexJob].status = !listJob[findIndexJob].status;
      }

      // Clone ra một mảng mới
      const cloneJobs = [...listJob];

      // B4: Cập nhật lại state cho component và Lưu dữ liệu lên localStorage
      saveDate("jobs", cloneJobs);
   };

   // Hàm mở modal xác nhận xóa
   const handleShowModal = (id) => {
      // Mở modal
      setIsShowModal(true);

      // Lấy id của công việc cần xóa
      setIdDelete(id);
   };

   // Hàm đóng modal xác nhận xóa
   const handleCloseModal = () => {
      setIsShowModal(false);
   };

   // Hàm xác nhận xóa
   const handleConfirmDelete = () => {
      // Lọc các bảng ghi có Id khác với Id cần xóa
      const filterJob = listJob.filter((job) => job.id !== idDelete);

      saveDate("jobs", filterJob);

      // Đóng modal xác nhận xóa
      handleCloseModal();

      // Reset lại Id của công việc cần xóa
      setIdDelete(null);
   };

   // Hàm Show edit input
   const handleShowEdit = (id) => {
      // Lấy id công việc cần sửa để mở edit input
      setIdEdit((prevIdEdit) => (prevIdEdit === id ? null : id));
   };

   // Đóng edit input
   const handleEditCancel = () => {
      // Đóng edit công việc
      const editText = document.querySelector(".update-text");
      editText.style = "display: none";

      // Clear giá trị trong input
      setEditValue("");

      // Reset lại Id của công việc cần Edit
      setIdEdit(null);
   };

   // Lưu dữ liệu edit input
   const handleEditValue = (e) => {
      setEditValue(e.target.value);
   };

   // Cập nhật sửa tiêu đề cho công việc hoặc thông báo lỗi nếu input text trống
   const handleEditSuccess = (id) => {
      // Hiện thông báo lỗi nếu input edit trống
      if (!editValue.trim()) {
         setIsShowErrorAlert(true);
         return;
      }

      // Đã lấy được id khi mở edit input phía trên rồi
      // Lấy ra vị trí công việc cần edit
      const indexJob = listJob.findIndex((job) => job.id === idEdit);

      if (indexJob !== -1) {
         // Cập nhật tiêu đề công viêc
         const updatedJob = { ...listJob[indexJob], title: editValue };

         // Tạo bản sao cho danh sách công việc
         const updatedJobs = [...listJob];
         // Cập nhật cho công việc cần sửa
         updatedJobs[indexJob] = updatedJob;
         // Lưu vào localStorage
         saveDate("jobs", updatedJobs);
      }

      // Clear giá trị của editValue và   setIdEdit
      setEditValue("");
      setIdEdit(null);
   };

   // Hàm đóng thông báo lỗi
   const handleCloseErrorInputText = () => {
      setIsShowErrorAlert(false);
   };

   // Xử lý thêm active khi ấn vào tab khác
   const handleActiveTab = (tab) => {
      setActiveTab(tab);
   };

   return (
      <>
         {/* Modal thông báo lỗi khi edit */}
         <ModalErrorAlert
            title="Cảnh báo"
            content="Tên công việc không được để trống"
            cancel="Đóng"
            open={isShowErrorAlert}
            onCloseAlert={handleCloseErrorInputText}
         />

         {/* Modal xác nhận xóa */}
         <ModalDelete
            title="Xác nhận xóa"
            content="Bạn có muốn xóa công việc này không?"
            cancelText="Hủy"
            confirmText="Xác nhận"
            open={isShowModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
         />
         <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
               <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col col-xl-10">
                     <div className="card">
                        <div className="card-body p-5">
                           <form
                              onSubmit={handleSubmit}
                              className="d-flex justify-content-center align-items-center mb-4"
                           >
                              <div className="form-outline flex-fill">
                                 <input
                                    onBlur={handleChangeInput}
                                    onChange={handleChangeInput}
                                    type="text"
                                    id="form2"
                                    className="form-control"
                                    value={inputValue}
                                 />
                                 <label className="form-label" htmlFor="form2">
                                    Nhập tên công việc
                                 </label>
                              </div>
                              <button
                                 onClick={handleInputFocus}
                                 type="submit"
                                 className="btn btn-info ms-2"
                              >
                                 Thêm
                              </button>
                           </form>

                           {error && (
                              <p
                                 style={{
                                    color: "red",
                                    fontSize: 12,
                                    marginLeft: 10,
                                 }}
                              >
                                 {error}
                              </p>
                           )}
                           {/* Tabs navs */}
                           <ul className="nav nav-tabs mb-4 pb-2">
                              {items.map((tab) => (
                                 <li
                                    key={tab.id}
                                    className="nav-item"
                                    role="presentation"
                                 >
                                    <a
                                       onClick={() =>
                                          handleActiveTab(tab.itemName)
                                       }
                                       className={`nav-link ${
                                          activeTab === tab.itemName
                                             ? "active"
                                             : ""
                                       }`}
                                    >
                                       {tab.description}
                                    </a>
                                 </li>
                              ))}
                           </ul>
                           {/* Tabs navs */}
                           {/* Tabs content */}
                           <div className="tab-content" id="ex1-content">
                              <div className="tab-pane fade show active">
                                 <ul className="list-group mb-0">
                                    {listJob
                                       .filter((item) => {
                                          // Lọc công việc theo tab đã chọn
                                          if (activeTab === "completed") {
                                             // Chỉ hiển thị công việc đã hoàn thành
                                             return item.status === true;
                                          } else if (
                                             activeTab === "incompleted"
                                          ) {
                                             // Chỉ hiển thị công việc chưa hoàn thành
                                             return item.status === false;
                                          } else {
                                             // Hiển thị tất cả công việc nếu tab là "all"
                                             return true;
                                          }
                                       })
                                       .map((item) => (
                                          <li
                                             key={item.id}
                                             className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                                             style={{
                                                backgroundColor: "#f4f6f7",
                                             }}
                                          >
                                             <div>
                                                <input
                                                   onChange={() =>
                                                      handleChangeStatus(
                                                         item.id
                                                      )
                                                   }
                                                   className="form-check-input me-2"
                                                   type="checkbox"
                                                   checked={item.status}
                                                />
                                                {item.status ? (
                                                   <s>{item.title}</s>
                                                ) : (
                                                   <span>{item.title}</span>
                                                )}
                                                {/* Mở Edit text */}
                                                {idEdit === item.id && (
                                                   <div
                                                      className="update-text"
                                                      style={{
                                                         display: "flex",
                                                      }}
                                                   >
                                                      <input
                                                         type="text"
                                                         onChange={
                                                            handleEditValue
                                                         }
                                                         value={editValue}
                                                         className="form-control edit-input"
                                                         placeholder="Nhập công việc mới"
                                                      />
                                                      <button
                                                         onClick={
                                                            handleEditCancel
                                                         }
                                                         className="edit edit-cancel"
                                                      >
                                                         <i className="fa-solid fa-x text-danger"></i>
                                                      </button>
                                                      <button
                                                         onClick={() =>
                                                            handleEditSuccess(
                                                               item.id
                                                            )
                                                         }
                                                         className="edit edit-success"
                                                      >
                                                         <i className="fa-solid fa-check text-success"></i>
                                                      </button>
                                                   </div>
                                                )}
                                             </div>
                                             <div className="d-flex gap-3">
                                                <i
                                                   onClick={() =>
                                                      handleShowEdit(item.id)
                                                   }
                                                   className="fas fa-pen-to-square text-warning"
                                                />
                                                <i
                                                   onClick={() =>
                                                      handleShowModal(item.id)
                                                   }
                                                   className="far fa-trash-can text-danger"
                                                />
                                             </div>
                                          </li>
                                       ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}
