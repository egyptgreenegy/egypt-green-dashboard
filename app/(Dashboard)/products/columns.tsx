'use client'
import { useDeleteProductMutation } from "@/redux/features/products/productApi";
import { IProduct } from "@/types/products/product";
import { ColumnDef } from "@tanstack/react-table";
export const productColumns:ColumnDef<IProduct>[] = [
    {
        accessorKey: "image",
        header: "الصوره",
        size: 200,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="flex text-center mx-auto">
                    <img
                        src={row.original.image}
                        alt={row.original.name["ar"]}
                        className="w-36 h-16 object-contain rounded-md text-center mx-auto"
                    />
                </div>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "الاسم",
        size: 200,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 truncate">
                        {row.original.name["ar"]}
                    </span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "التصنيف",
        size: 200,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 truncate">
                        {row.original.category.name["ar"]}
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: "actions",
        header: "الإجراءات",
        size: 150,
        cell: ({ row }) => {
        const [deleteProduct] = useDeleteProductMutation(); // ← هنا مكانه الصحيح

        const handleDelete = async () => {
            if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                try {
                    await deleteProduct(row.original._id);
                    console.log("Deleted product:", row.original._id);
                } catch (error) {
                    console.error("Error deleting product:", error);
                }
            }
        };

        return (
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => console.log("Edit product:", row.original._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    تعديل
                </button>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                    حذف
                </button>
            </div>
        );
    },
    }
]