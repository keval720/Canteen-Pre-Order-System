import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import MenuForm from "../../components/admin/MenuForm";

import { subscribeToMenu, updateMenuItem } from "../../services/menuService";

const EditDish = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // REAL-TIME MENU LISTENER
  // ==========================================

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToMenu(
      (menu) => {
        const selectedDish = menu.find((item) => item.id === id);

        if (!selectedDish) {
          alert("Dish not found.");
          navigate("/admin/managemenu");
          return;
        }

        setDish(selectedDish);
        setLoading(false);
      },
      (error) => {
        console.error("Edit Dish Menu Listener Error:", error);

        alert("Failed to load dish.");
        setLoading(false);
        navigate("/admin/managemenu");
      },
    );

    return () => {
      unsubscribe();
    };
  }, [id, navigate]);

  // ==========================================
  // UPDATE DISH
  // ==========================================

  const handleUpdateDish = async (updatedData) => {
    try {
      await updateMenuItem(id, updatedData);

      alert("Dish updated successfully!");

      navigate("/admin/managemenu");
    } catch (error) {
      console.error("Update Dish Error:", error);

      throw error;
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading || !dish) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center bg-[#f9f6f1]">
          <p className="text-sm text-[#8c786d]">Loading dish...</p>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f9f6f1] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#171717]">Edit Dish</h1>

            <p className="mt-1 text-sm text-[#9a7664]">
              Update dish information
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-[#eadfd6] bg-white shadow-sm">
            <MenuForm
              initialData={dish}
              onSubmit={handleUpdateDish}
              submitLabel="Update Dish"
            />

            <div className="border-t border-[#eee4dc] px-5 pb-5 sm:px-7">
              <button
                type="button"
                onClick={() => navigate("/admin/managemenu")}
                className="mt-3 w-full rounded-xl border border-[#e5d8cd] px-5 py-3 text-sm font-medium text-[#594c45] transition-colors hover:bg-[#f7f1eb]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditDish;
