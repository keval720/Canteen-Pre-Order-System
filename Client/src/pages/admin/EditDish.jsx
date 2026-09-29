import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import uploadImage from "../../services/Cloudinary";
import { getMenu, updateMenuItem } from "../../services/menuService";

const EditDish = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [dish, setDish] = useState({
    name: "",
    category: "",
    price: "",
    preparationTime: "",
    batchable: true,
    description: "",
    image: null,
    imageUrl: "",
    status: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ["Breakfast", "Snacks", "Main Course", "Beverages"];

  // Load selected dish
  useEffect(() => {
    const loadDish = async () => {
      try {
        setLoading(true);

        const menu = await getMenu();

        const selectedDish = menu.find((item) => item.id === id);

        if (!selectedDish) {
          alert("Dish not found.");
          navigate("/admin/managemenu");
          return;
        }

        setDish({
          name: selectedDish.name || "",
          category: selectedDish.category || "Breakfast",
          price: selectedDish.price || "",
          preparationTime: selectedDish.preparationTime || "",
          batchable: selectedDish.batchable ?? true,
          description: selectedDish.description || "",
          image: null,
          imageUrl: selectedDish.imageUrl || "",
          status: selectedDish.status ?? true,
        });

        setImagePreview(selectedDish.imageUrl || null);
      } catch (error) {
        console.error("Load Dish Error:", error);
        alert("Failed to load dish.");
        navigate("/admin/managemenu");
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDish((previousDish) => ({
      ...previousDish,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setDish((previousDish) => ({
      ...previousDish,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateDish = async (event) => {
    event.preventDefault();

    if (!dish.name.trim() || !dish.price || !dish.preparationTime) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = dish.imageUrl;

      // Upload only if a new image was selected
      if (dish.image) {
        imageUrl = await uploadImage(dish.image);
      }

      const updatedDish = {
        name: dish.name.trim(),
        description: dish.description.trim(),
        category: dish.category,
        price: Number(dish.price),
        preparationTime: Number(dish.preparationTime),
        batchable: dish.batchable,
        status: dish.status,
        imageUrl,
      };

      await updateMenuItem(id, updatedDish);

      alert("Dish updated successfully!");

      navigate("/admin/managemenu");
    } catch (error) {
      console.error("Update Dish Error:", error);
      alert("Failed to update dish. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/managemenu");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center bg-[#f9f6f1]">
          <p className="text-sm text-[#8c786d]">Loading dish...</p>
        </div>
      </AdminLayout>
    );
  }

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
          <form
            onSubmit={handleUpdateDish}
            className="rounded-2xl border border-[#eadfd6] bg-white p-5 shadow-sm sm:p-7"
          >
            {/* Dish Name */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#594c45]">
                Dish Name
              </label>

              <input
                type="text"
                name="name"
                value={dish.name}
                onChange={handleChange}
                placeholder="Enter dish name"
                className="h-12 w-full rounded-xl border border-[#e5d8cd] px-4 text-sm text-[#333] outline-none placeholder:text-[#9c8f87] focus:border-[#d15d2c]"
                required
              />
            </div>

            {/* Category + Price */}
            <div className="mb-5 grid gap-5 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#594c45]">
                  Category
                </label>

                <select
                  name="category"
                  value={dish.category}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[#e5d8cd] bg-white px-4 text-sm text-[#333] outline-none focus:border-[#d15d2c]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#594c45]">
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8c786d]">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={dish.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="1"
                    className="h-12 w-full rounded-xl border border-[#e5d8cd] pl-9 pr-4 text-sm text-[#333] outline-none placeholder:text-[#9c8f87] focus:border-[#d15d2c]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preparation Time */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#594c45]">
                Preparation Time (minutes)
              </label>

              <input
                type="number"
                name="preparationTime"
                value={dish.preparationTime}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="1"
                className="h-12 w-full rounded-xl border border-[#e5d8cd] px-4 text-sm text-[#333] outline-none placeholder:text-[#9c8f87] focus:border-[#d15d2c]"
                required
              />
            </div>

            {/* Batch Cooking */}
            <div className="mb-5">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="batchable"
                  checked={dish.batchable}
                  onChange={(event) =>
                    setDish((previousDish) => ({
                      ...previousDish,
                      batchable: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#d15d2c]"
                />

                <span className="text-sm font-medium text-[#594c45]">
                  Allow batch cooking
                </span>
              </label>

              <p className="mt-1 pl-7 text-xs text-[#9a8578]">
                Allows this dish to be prepared together for multiple orders.
              </p>
            </div>

            {/* Image */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#594c45]">
                Dish Image
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Preview */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#eee8e1]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#9a8578]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-[#e5d8cd] bg-white px-4 py-2.5 text-sm font-medium text-[#594c45] transition-colors hover:bg-[#f7f1eb]"
                  >
                    Change Image
                  </button>

                  <p className="mt-2 text-xs text-[#9a8578]">
                    JPG, PNG or WEBP · Maximum 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#594c45]">
                Description
              </label>

              <textarea
                name="description"
                value={dish.description}
                onChange={handleChange}
                placeholder="Enter dish description"
                rows="4"
                className="w-full resize-none rounded-xl border border-[#e5d8cd] px-4 py-3 text-sm text-[#333] outline-none placeholder:text-[#9c8f87] focus:border-[#d15d2c]"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eee4dc] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-[#e5d8cd] px-5 py-3 text-sm font-medium text-[#594c45] transition-colors hover:bg-[#f7f1eb]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#d15d2c] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b94f25] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Dish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditDish;
