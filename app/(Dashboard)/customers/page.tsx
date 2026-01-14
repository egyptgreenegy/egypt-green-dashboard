'use client'
import { useGetClientsQuery } from "@/redux/features/client/clientApi";
import Link from "next/link";
import { clientColumns } from "./columns";
import DataTable from "@/components/table";
import { useTanstackTable } from "@/components/table/use-tanstack-table";
import { CustomBreadcrumb } from "@/components/breadCrump";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  const {data:resData , isLoading , isError} =  useGetClientsQuery();
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns:clientColumns,
    data:resData?.data.clients || [],
    features: ["sort", "selection", "pagination", "multiSelection", "filter"],
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight"> <CustomBreadcrumb lastItemAsTitle  items={[{label:'الرئيسيه' , href:'/'} ,{label:'العملاء' , href:'/customers'}]}/></h2>
          <Link href={'/customers/add'} className="bg-primary p-3 flex justify-between rounded-md text-white/80 hover:bg-blue-700 font-bold transition-colors">
            اضافه عميل <Plus className="mx-2"></Plus>
          </Link>
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
