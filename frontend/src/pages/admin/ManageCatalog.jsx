// src/pages/admin/ManageCatalog.jsx
import { useState, useEffect } from 'react';
import API, { fetchProducts } from '../../services/api';
import { Edit3, Trash2, X, Check, Grid, UploadCloud, Loader2 } from 'lucide-react';

export default function ManageCatalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit Modal States
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        price: '',
        category: 'Necklaces',
        description: '',
        imageFile: null
    });

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchProducts();
            const data = response.data.products || response.data || [];
            setProducts(data);
        } catch (error) {
            console.error("Error loading catalog products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initCatalog = async () => {
            try {
                const response = await fetchProducts();
                const data = response.data.products || response.data || [];
                if (isMounted) setProducts(data);
            } catch (error) {
                console.error("Error loading catalog products:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initCatalog();
        return () => {
            isMounted = false;
        };
    }, []);

    // Delete Product Handler
    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Kya aap is royal product ko store catalog se delete karna chahte hain?")) {
            try {
                await API.delete(`/products/${id}`);
                setProducts((prev) => prev.filter((p) => p._id !== id));
                alert("🗑️ Product successfully removed from catalog!");
            } catch (error) {
                console.error("Delete Error:", error);
                alert("❌ Failed to delete product.");
            }
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name || '',
            price: product.price || '',
            category: product.category || 'Necklaces',
            description: product.description || '',
            imageFile: null
        });
    };

    // Handle Image Selection inside Edit Modal
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm({ ...editForm, imageFile: file });
        }
    };

    // Save Updated Product using FormData (Supports Image Update)
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('price', Number(editForm.price));
            formData.append('category', editForm.category);
            formData.append('description', editForm.description);

            // Agar user ne new image upload ki hai to 'image' field bhejenge
            if (editForm.imageFile) {
                formData.append('image', editForm.imageFile);
            }

            const response = await API.put(`/products/${editingProduct._id}`, formData);

            if (response.data.success) {
                alert("✨ Product details & image updated successfully!");
                setEditingProduct(null);
                loadProducts();
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("❌ Failed to update product details.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-12 rounded-2xl sm:rounded-3xl border border-[#EED9C4] flex flex-col items-center justify-center text-[#2B040B]">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="text-xs font-serif font-bold tracking-wide">Loading Store Catalog...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-[#EED9C4]/70">
                <div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#2B040B] flex items-center gap-2">
                        <Grid className="w-5 h-5 text-[#D4AF37] shrink-0" />
                        <span>Manage Store Catalog</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        Live inventory synchronized with database. Edit or remove items instantly.
                    </p>
                </div>
                <span className="bg-[#2B040B] text-[#D4AF37] text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0">
                    {products.length} Items Listed
                </span>
            </div>

            {/* Product Grid or Empty State */}
            {products.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4 border border-dashed border-[#D4AF37]/40 rounded-2xl bg-[#FAF8F5]">
                    <p className="text-gray-600 text-xs sm:text-sm font-serif font-bold">
                        No jewelry pieces found in database yet.
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#9E6D68] mt-1">
                        Use the &ldquo;Add New Jewelry&rdquo; tab to publish items!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {products.map((prod) => (
                        <div
                            key={prod._id}
                            className="border border-[#EED9C4] rounded-2xl p-3.5 sm:p-4 bg-[#FAF8F5] flex flex-col justify-between shadow-2xs hover:shadow-md transition"
                        >
                            <div>
                                <div className="h-44 sm:h-52 w-full overflow-hidden rounded-xl bg-gray-100 relative mb-3 border border-[#EED9C4]/60">
                                    <img
                                        src={prod.imageUrl}
                                        alt={prod.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-2 right-2 bg-[#2B040B]/90 text-[#D4AF37] text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                                        {prod.category}
                                    </span>
                                </div>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B040B] line-clamp-1">
                                    {prod.name}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 font-light leading-relaxed">
                                    {prod.description}
                                </p>
                                <p className="text-sm sm:text-base font-serif font-bold text-[#2B040B] mt-2">
                                    ₹{Number(prod.price).toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="flex gap-2 mt-3.5 sm:mt-4 pt-3 border-t border-[#EED9C4]">
                                <button
                                    onClick={() => handleOpenEdit(prod)}
                                    className="flex-1 bg-[#2B040B] text-[#D4AF37] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#4A0A17] active:scale-[0.98] transition cursor-pointer"
                                >
                                    <Edit3 size={13} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(prod._id)}
                                    className="flex-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-100 active:scale-[0.98] transition cursor-pointer"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EDIT MODAL POPUP WITH IMAGE UPLOAD */}
            {editingProduct && (
                <div
                    onClick={() => setEditingProduct(null)}
                    className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#2B040B] border border-[#D4AF37] sm:border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl text-[#FAF8F5] max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-[#D4AF37]/30">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#D4AF37]">
                                Edit Jewelry Piece
                            </h3>
                            <button
                                onClick={() => setEditingProduct(null)}
                                aria-label="Close Edit Modal"
                                className="text-gray-400 hover:text-white cursor-pointer bg-transparent border-none p-1"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3.5 sm:space-y-4">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-[#D4AF37] mb-1 uppercase tracking-wider">
                                    Jewelry Title
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-[#4A0A17] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-[#D4AF37] mb-1 uppercase tracking-wider">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        className="w-full bg-[#4A0A17] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-semibold text-[#D4AF37] mb-1 uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full bg-[#4A0A17] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                                    >
                                        <option value="Necklaces">Necklaces</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Rings">Rings</option>
                                        <option value="Bridal">Bridal</option>
                                        <option value="Bangles">Bangles</option>
                                        <option value="Pendants">Pendants</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-[#D4AF37] mb-1 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={2}
                                    className="w-full bg-[#4A0A17] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] resize-none"
                                />
                            </div>

                            {/* IMAGE UPDATE SECTION */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-[#D4AF37] mb-1 uppercase tracking-wider">
                                    Jewelry Photo (Current or Replace)
                                </label>
                                <div className="flex items-center gap-3 bg-[#4A0A17] p-2.5 rounded-xl border border-[#D4AF37]/40">
                                    <img
                                        src={editForm.imageFile ? URL.createObjectURL(editForm.imageFile) : editingProduct.imageUrl}
                                        alt="Preview"
                                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-[#D4AF37]/50 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <label
                                            htmlFor="edit-image-file"
                                            className="cursor-pointer bg-[#D4AF37] text-[#2B040B] px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 hover:bg-amber-300 transition"
                                        >
                                            <UploadCloud size={13} /> Change Image
                                        </label>
                                        <input
                                            type="file"
                                            id="edit-image-file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <span className="block text-[10px] text-gray-300 mt-1 truncate">
                                            {editForm.imageFile ? editForm.imageFile.name : "Keep existing photo"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2.5 sm:gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    disabled={saving}
                                    className="flex-1 bg-transparent border border-gray-500 hover:border-gray-300 text-gray-300 py-2.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#D4AF37] hover:bg-amber-300 text-[#2B040B] py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={15} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}