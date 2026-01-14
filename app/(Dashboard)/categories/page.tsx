"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Filter, Plus } from "lucide-react"
import Link from "next/link"
import { useTanstackTable } from "@/components/table/use-tanstack-table"
import DataTable from "@/components/table"
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi"
import { categoryColumns } from "./columns"

type Checked = DropdownMenuCheckboxItemProps["checked"]

const Page = () => {
  const { isLoading, data, isError } = useGetCategoriesQuery()
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns: categoryColumns,
    data: data?.data?.categories || [],
    features: ["sort", "selection", "pagination", "multiSelection", "filter"],
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">التصنيفات</h2>
        </div>
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <button className="px-2 py-2 rounded-md bg-primary text-primary-foreground">
                <Link className="flex justify-between gap-3" href="/categories/add">
                  <span>اضافة تصنيف</span> <span><Plus /></span>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500 text-lg">حدث خطأ أثناء تحميل البيانات</div>
            </div>
          ) : (
            <DataTable table={table} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
