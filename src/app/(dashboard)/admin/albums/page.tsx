"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useAlbumStore, Album } from "@/store/useAlbumStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AlbumsPage() {
  const { albums, loading, error, fetchAlbum } = useAlbumStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (albumId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(albumId)) {
      newExpandedRows.delete(albumId);
    } else {
      newExpandedRows.add(albumId);
    }
    setExpandedRows(newExpandedRows);
  };

  const columns: ColumnDef<Album>[] = [
    {
      accessorKey: "coverImgUrl",
      header: "Cover",
      cell: ({ row }) => (
        <div className="h-12 w-12 relative">
          <Image
            src={row.getValue("coverImgUrl") || "/default-cover.jpg"}
            alt={row.getValue("title")}
            fill
            className="object-cover rounded"
          />
        </div>
      ),
    },
    {
      id: "expand",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRow(row.original.id)}
        >
          {expandedRows.has(row.original.id) ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "artist",
      header: "Artist",
      cell: ({ row }) => {
        const artist = row.original.artist;
        return artist?.name || "-";
      },
    },
    {
      accessorKey: "releaseDate",
      header: "Release Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("releaseDate"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500"
            onClick={() => handleDelete(row.original.id)}
            disabled={deleteLoading === row.original.id}
          >
            {deleteLoading === row.original.id ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const handleEdit = (album: Album) => {
    router.push(`/admin/albums/${album.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    // if (window.confirm("Bạn có chắc chắn muốn xóa album này?")) {
    //   try {
    //     setDeleteLoading(id);
    //     await deleteAlbum(id);
    //     alert("Xóa album thành công");
    //   } catch (error) {
    //     console.error("Lỗi khi xóa album:", error);
    //     alert("Không thể xóa album");
    //   } finally {
    //     setDeleteLoading(null);
    //   }
    // }
  };

  const handleAddNew = () => {
    router.push("/admin/albums/newalbum");
  };

  const table = useReactTable({
    data: albums,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Albums</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Thêm Album Mới
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Album</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows.has(row.original.id) && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="bg-gray-50"
                        >
                          <div className="p-4">
                            <h4 className="font-medium mb-2">
                              Danh sách bài hát:
                            </h4>
                            <div className="space-y-2">
                              {row.original.songs?.map((song) => (
                                <div
                                  key={song.id}
                                  className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100"
                                >
                                  <div className="h-8 w-8 relative">
                                    <Image
                                      src={
                                        song.coverImgUrl || "/default-cover.jpg"
                                      }
                                      alt={song.title}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{song.title}</p>
                                    <p className="text-sm text-gray-500">
                                      {song.artists
                                        ?.map((artist) => artist.name)
                                        .join(", ")}
                                    </p>
                                  </div>
                                  <audio controls className="ml-auto">
                                    <source
                                      src={song.fileUrl}
                                      type="audio/mpeg"
                                    />
                                  </audio>
                                </div>
                              ))}
                              {(!row.original.songs ||
                                row.original.songs.length === 0) && (
                                <p className="text-gray-500">
                                  Không có bài hát nào trong album này.
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không tìm thấy album nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
