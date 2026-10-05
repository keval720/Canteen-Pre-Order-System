import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import MenuForm from "../../components/admin/MenuForm";

import { addMenuItem } from "../../services/menuService";

const AddDish = () => {
  const navigate = useNavigate();

  const handleAddDish = async (menuData) => {
    try {
      const newDish = {
        ...menuData,
        status: true,
      };

      await addMenuItem(newDish);

      alert("Dish added successfully!");

      navigate("/admin/managemenu");
    } catch (error) {
      console.error("Add Dish Error:", error);

      throw error;
    }
  };

  const handleCancel = () => {
    navigate("/admin/managemenu");
  };

  const handleClose = () => {
    navigate("/admin/managemenu");
  };

  return (
    <AdminLayout>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
        {/* Modal */}
        <div className="flex max-h-[95vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eee3da] px-5 py-4">
            <h1 className="text-base font-medium text-[#29231f]">
              Add New Dish
            </h1>

            <button
              type="button"
              onClick={handleClose}
              className="text-xl leading-none text-[#9c877a] transition-colors hover:text-[#d15d2c]"
            >
              ×
            </button>
          </div>

          {/* Reusable Form */}
          <MenuForm
            onSubmit={handleAddDish}
            onCancel={handleCancel}
            submitLabel="Add Dish"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddDish;
