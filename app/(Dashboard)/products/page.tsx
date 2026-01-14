"use client"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Filter, Plus } from "lucide-react"
import Link from "next/link"
import { useTanstackTable } from "@/components/table/use-tanstack-table";
import { productColumns } from "./columns";
import DataTable from "@/components/table";
import { useGetProductsQuery } from "@/redux/features/products/productApi";

export default function ProductsPage() {
  const { data} = useGetProductsQuery()
  const {table ,  setSorting, getSearchVal, setSearchVal} = useTanstackTable({
    columns:productColumns,
    data:data?.data?.products || [],
    features: ["sort", "selection", "pagination", "multiSelection", "filter"],
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">المنتجات</h2>
        </div>
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <button className="px-2 py-2 rounded-md bg-primary text-primary-foreground " ><Link className='flex justify-between gap-3' href='/products/add'> <span>اضافه منتج</span> <span><Plus/></span></Link>
              </button>
            </div>
          </div>
        </div>
        <div>
          <DataTable
          table={table}
          />
        </div>
      </div>
    </div>
  )
}
