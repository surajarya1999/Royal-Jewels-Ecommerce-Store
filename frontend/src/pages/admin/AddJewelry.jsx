// src/pages/admin/AddJewelry.jsx
import { useState } from 'react';
import { Sparkles, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { addProduct } from '../../services/api';

export default function AddJewelry({ onProductAdded }) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        category: 'Necklaces',
        price: '',
        mrp: '',
        description: '',
        imageFile: null,
        metalType: '22K Yellow Gold',
        karatage: '22K',
        stock: 10
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductForm({ ...productForm, imageFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.imageFile) {
            alert("⚠️ Please select a jewelry image file!");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('category', productForm.category);
            formData.append('price', Number(productForm.price));
            if (productForm.mrp) formData.append('mrp', Number(productForm.mrp));
            formData.append('description', productForm.description);
            formData.append('metalType', productForm.metalType);
            formData.append('karatage', productForm.karatage);
            formData.append('stock', Number(productForm.stock));

            // Backend multer 'image' key expect karta hai, isliye yahan 'image' bhej rahe hain
            formData.append('image', productForm.imageFile);

            const response = await addProduct(formData);
            if (response.data.success) {
                alert(`✨ Successfully published "${productForm.name}" to live store!`);
                setProductForm({
                    name: '',
                    category: 'Necklaces',
                    price: '',
                    mrp: '',
                    description: '',
                    imageFile: null,
                    metalType: '22K Yellow Gold',
                    karatage: '22K',
                    stock: 10
                });
                setImagePreview(null);
                if (onProductAdded) onProductAdded();
            }
        } catch (error) {
            console.error("Error publishing product:", error);
            alert(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-[#FAF8F5]/60 border border-[#EED9C4] text-xs sm:text-sm placeholder:text-xs placeholder-gray-400 text-[#2B040B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition";

    return (
        <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] max-w-3xl mx-auto font-sans">
            <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#2B040B]">
                    Publish New Jewelry Piece
                </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mb-5 sm:mb-6 pb-3.5 border-b border-[#EED9C4]/70">
                Fill in details to list fine jewelry on the live customer storefront.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            Jewelry Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Royal Kundan Choker"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className={`${inputClass} bg-white cursor-pointer`}
                        >
                            <option value="Necklaces">Necklaces</option>
                            <option value="Earrings">Earrings</option>
                            <option value="Rings">Rings</option>
                            <option value="Bridal">Bridal</option>
                            <option value="Bangles">Bangles</option>
                            <option value="Pendants">Pendants</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            Selling Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            placeholder="145000"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            MRP / Original Price (₹)
                        </label>
                        <input
                            type="number"
                            placeholder="165000"
                            value={productForm.mrp}
                            onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            Metal / Polish Type
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 22K Yellow Gold"
                            value={productForm.metalType}
                            onChange={(e) => setProductForm({ ...productForm, metalType: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                Karatage
                            </label>
                            <input
                                type="text"
                                placeholder="22K"
                                value={productForm.karatage}
                                onChange={(e) => setProductForm({ ...productForm, karatage: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                Stock Qty
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="10"
                                value={productForm.stock}
                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows="3"
                            placeholder="Handcrafted 22K gold-plated uncut Kundan set with pearls..."
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1.5">
                            High-Res Image File <span className="text-red-500">*</span>
                        </label>
                        <label
                            htmlFor="file-upload"
                            className="block border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] p-4 sm:p-6 rounded-2xl bg-[#FAF8F5] text-center cursor-pointer transition"
                        >
                            {imagePreview ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#D4AF37] shadow-xs"
                                    />
                                    <p className="text-[11px] sm:text-xs text-emerald-700 font-bold flex items-center gap-1 max-w-full truncate px-2">
                                        <CheckCircle2 size={14} className="shrink-0" />
                                        <span className="truncate">{productForm.imageFile.name}</span>
                                    </p>
                                    <span className="text-[10px] text-[#2B040B] underline">Tap to change photo</span>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37] mx-auto mb-1.5" />
                                    <span className="text-[11px] sm:text-xs font-bold text-[#2B040B] underline hover:text-[#B8860B]">
                                        Tap here to select jewelry photo
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, or WEBP supported</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2B040B] text-[#D4AF37] font-serif font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-[#4A0A17] active:scale-[0.99] transition shadow-lg tracking-wider uppercase text-xs sm:text-sm cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={16} /> Publishing to Catalog...
                        </>
                    ) : (
                        <>Publish to Royal Catalog ✨</>
                    )}
                </button>
            </form>
        </div>
    );
}