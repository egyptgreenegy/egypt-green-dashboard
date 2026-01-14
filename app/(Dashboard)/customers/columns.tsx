import SortCell from "@/components/sortCell";
import { IClient } from "@/types/clients/client";
import { ColumnDef } from "@tanstack/react-table";

export const  clientColumns:ColumnDef<IClient>[] = [
    {
        id: "name",
        header: ({ column }) => {
            return (
                <SortCell
                    label="العميل"
                    isAscSorted={column.getIsSorted() === "asc"}
                    className="flex items-center justify-start gap-1 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                />
                );
        },
        cell: ({ row }) => (
        <div className="p-2">
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                <span className=" font-semibold">{row.getValue("name")}</span>
                </div>
            </div>
        </div>
        ),
        accessorKey: "name",
        enableSorting: true,
    },
    {
        id: "email",
        header: ({column})=>{
            return (
                <SortCell
                    label="Email"
                    isAscSorted={false}
                    className="flex items-center justify-start gap-1 cursor-pointer"
                    onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}}
                />
                );
        },
        accessorKey: "email",
        enableSorting: false,
    },
    {
        id: "phone",
        header: "Phone",
        accessorKey: "phone",
        enableSorting: false,
    },
    {
        id: "address",
        header: "Address",
        accessorKey: "address",
        enableSorting: false,
    },
    {
        id:"nationality",
        header:"Nationality",
        accessorKey:"nationality",
        enableSorting:false,
    }
]