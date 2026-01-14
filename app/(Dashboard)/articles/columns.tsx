import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteArticleMutation } from "@/redux/features/articles/articlesApi";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type Article = {
    id: string;
    title: string;
    author: string;
    date: string;
};

export const columns: ColumnDef<Article>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "العنوان",
    },
    {
        accessorKey: "author",
        header: "الكاتب",
    },
    {
        accessorKey: "date",
        header: "التاريخ",
    },
    {
        id: "actions",
        header: "الإجراءات",
        size: 150,
        cell: ({ row }) => {
        const [deleteArticle] = useDeleteArticleMutation(); // ← هنا مكانه الصحيح

        const handleDelete = async () => {
            if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                try {
                    await deleteArticle(row.original.id);
                    console.log("Deleted product:", row.original.id);
                } catch (error) {
                    console.error("Error deleting product:", error);
                }
            }
        };

        return (
                <div className="flex items-center justify-center gap-2">
                    <Link className={cn(buttonVariants({
                        variant:'outline'
                    }))} href={`/articles/${row.original.id}/update`}>
                    تعديل
                    </Link>
                    <Button
                        onClick={handleDelete}
                        variant={'destructive'}
                    >
                        حذف
                    </Button>
                </div>
            );
        },
    }
]; 