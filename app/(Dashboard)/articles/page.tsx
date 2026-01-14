'use client'
import React from "react";
import { useTanstackTable } from "@/components/table/use-tanstack-table";
import { columns, Article } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useGetArticlesQuery } from "@/redux/features/articles/articlesApi";
import DataTable from "@/components/table";

const ArticlesPage = () => {
  const { data, isLoading, isError } = useGetArticlesQuery({});

  // Map API data to Article[] for the table
  const articles: Article[] =
    data?.data?.articles.map((item: any) => ({
      id: item.id || item._id || "-",
      title: typeof item.title === "object" ? item.title.ar || item.title.en || item.title.fr || "-" : item.title,
      author: item.author || "-",
      date: item.createdAt ? item.createdAt.slice(0, 10) : "-",
    })) || [];

  const { table } = useTanstackTable<Article, any>({
    data: articles,
    columns,
    features: ["sort", "selection", "pagination", "multiSelection", "filter"],

  });

  if (isLoading) {
    return <div className="p-4">جاري التحميل...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-600">حدث خطأ أثناء جلب المقالات.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">المقالات</h1>
      <DataTable table={table} />

    </div>
  );
};

export default ArticlesPage;
