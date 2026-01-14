'use client'
import { useDeleteCategoryMutation } from "@/redux/features/categories/categoriesApi"
import { ICategory } from "@/types/category/category"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Edit, Trash } from "lucide-react"
import Link from "next/link"

export const categoryColumns: ColumnDef<ICategory>[] = [
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
          <span className="text-xs text-gray-500 truncate">
            {row.original.name["en"]}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "الوصف",
    size: 300,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
            {row.original.description["ar"]}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div className="text-sm text-gray-900">
          {format(date, "PPP", { locale: ar })}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    size: 100,
    cell: ({ row }) => {
      const [deleteCategory , {}] = useDeleteCategoryMutation();
      const handleDelete = async () => {
        if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
          try {
            await deleteCategory(row.original._id).unwrap()
          } catch (error) {
            console.error("Failed to delete category:", error)
          }
        }
      }
      if (!row.original._id) {
        return null
      }
      return (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/categories/${row.original._id}/update`}>
            <button className="p-1 text-blue-600 hover:text-blue-800">
              <Edit size={18} />
            </button>
          </Link>
          <button onClick={handleDelete} className="p-1 text-red-600 hover:text-red-800">
            <Trash size={18} />
          </button>
        </div>
      )
    },
  },
]