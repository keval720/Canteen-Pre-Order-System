import { useRef, useState } from "react";

import uploadImage from "../../services/Cloudinary";

const MenuForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  submitLabel = "Add Dish",
}) => {
  const fileInputRef = useRef(null);

  const [dish, setDish] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Breakfast",
    price: initialData?.price || "",
    preparationTime: initialData?.preparationTime || "",
    batchable:
      initialData?.batchable !== undefined ? initialData.batchable : true,
    description: initialData?.description || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(
    initialData?.imageUrl || null,
  );

  const [saving, setSaving] = useState(false);

  const categories = ["Breakfast", "Snacks", "Main Course", "Beverages"];

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!dish.name.trim() || !dish.price || !dish.preparationTime) {
      alert("Please fill all required fields.");
      return;
    }

    const price = Number(dish.price);

    if (!Number.isFinite(price) || price < 1 || price > 999) {
      alert("Price must be between ₹1 and ₹999.");
      return;
    }

    const preparationTime = Number(dish.preparationTime);

    if (!Number.isFinite(preparationTime) || preparationTime < 1) {
      alert("Preparation time must be at least 1 minute.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = initialData?.imageUrl || "";

      if (dish.image) {
        imageUrl = await uploadImage(dish.image);
      }

      const menuData = {
        name: dish.name.trim(),
        description: dish.description.trim(),
        category: dish.category,
        price,
        preparationTime,
        batchable: dish.batchable,
        imageUrl,
      };

      await onSubmit(menuData);
    } catch (error) {
      console.error("Menu Form Error:", error);

      alert("Failed to save dish. Please try again.");

      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4">
      {/* Dish Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Dish Name <span className="text-[#d15d2c]">*</span>
        </label>

        <input
          type="text"
          name="name"
          value={dish.name}
          onChange={handleChange}
          placeholder="e.g. Paneer Butter Masala"
          className="h-11 w-full rounded-xl border border-[#e2d2c6] px-4 text-sm text-[#302925] outline-none placeholder:text-[#b9a69b] focus:border-[#d15d2c]"
          autoComplete="off"
          required
        />
      </div>

      {/* Category */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Category <span className="text-[#d15d2c]">*</span>
        </label>

        <select
          name="category"
          value={dish.category}
          onChange={handleChange}
          className="h-11 w-full rounded-xl border border-[#e2d2c6] bg-white px-4 text-sm text-[#302925] outline-none focus:border-[#d15d2c]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Price (₹) <span className="text-[#d15d2c]">*</span>
        </label>

        <input
          type="number"
          name="price"
          value={dish.price}
          onChange={handleChange}
          placeholder="e.g. 55"
          min="1"
          max="999"
          step="1"
          className="h-11 w-full rounded-xl border border-[#e2d2c6] px-4 text-sm text-[#302925] outline-none placeholder:text-[#b9a69b] focus:border-[#d15d2c]"
          autoComplete="off"
          required
        />

        <p className="mt-1 text-xs text-[#a89589]">Maximum price: ₹999</p>
      </div>

      {/* Preparation Time */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Preparation Time (minutes) <span className="text-[#d15d2c]">*</span>
        </label>

        <input
          type="number"
          name="preparationTime"
          value={dish.preparationTime}
          onChange={handleChange}
          placeholder="e.g. 10"
          min="1"
          step="1"
          className="h-11 w-full rounded-xl border border-[#e2d2c6] px-4 text-sm text-[#302925] outline-none placeholder:text-[#b9a69b] focus:border-[#d15d2c]"
          autoComplete="off"
          required
        />
      </div>

      {/* Batch Cooking */}
      <div className="mt-4">
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
            autoComplete="off"
          />

          <span className="text-sm font-medium text-[#302925]">
            Allow batch cooking
          </span>
        </label>

        <p className="mt-1 pl-7 text-xs text-[#a89589]">
          Allows this dish to be prepared together for multiple orders.
        </p>
      </div>

      {/* Image */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Dish Image
        </label>

        <div className="flex gap-3">
          {/* Upload Area */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex h-28 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#cbb9ac] bg-[#fffdfa] transition-colors hover:border-[#d15d2c] hover:bg-[#fff8f3]"
          >
            <span className="text-2xl text-[#8f7d72]">🖼️</span>

            <span className="mt-2 text-sm font-medium text-[#51453e]">
              Click to upload image
            </span>

            <span className="mt-1 text-xs text-[#a89589]">
              PNG, JPG, JPEG (Max 5MB)
            </span>
          </button>

          {/* Preview */}
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[#e7ddd6] bg-[#faf7f4]">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dish Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <span className="text-2xl text-[#b5a59b]">🖼️</span>

                <span className="mt-1 text-xs text-[#a89589]">No image</span>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#302925]">
          Description
        </label>

        <textarea
          name="description"
          value={dish.description}
          onChange={handleChange}
          placeholder="Short description of the dish..."
          rows="3"
          className="w-full resize-none rounded-xl border border-[#e2d2c6] px-4 py-3 text-sm text-[#302925] outline-none placeholder:text-[#b9a69b] focus:border-[#d15d2c]"
        />
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-11 flex-1 rounded-xl bg-[#d15d2c] text-sm font-semibold text-white transition-colors hover:bg-[#b94f25] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-11 flex-1 rounded-xl border border-[#e1d3c8] bg-white text-sm font-medium text-[#302925] transition-colors hover:bg-[#faf6f2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MenuForm;
