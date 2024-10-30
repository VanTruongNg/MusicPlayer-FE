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
import { PlusCircle } from "lucide-react";
import { useSongStore, Song } from "@/store/useSongStore";
import Image from "next/image";
import { useArtistStore } from "@/store/useArtistStore";
import { useGenreStore } from "@/store/useGenreStore";
import { useRouter } from "next/navigation";

export default function SongsPage() {
  const { songs, loading, error, fetchSong, deleteSong } = useSongStore();
  const { fetchArtist } = useArtistStore();
  const { fetchGenres } = useGenreStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const columns: ColumnDef<Song>[] = [
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
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "artists",
      header: "Artists",
      cell: ({ row }) => {
        const artists = row.getValue("artists") as Song["artists"];
        return artists.map((artist) => artist.name).join(", ");
      },
    },
    {
      accessorKey: "album",
      header: "Album",
      cell: ({ row }) => {
        const album = row.getValue("album") as Song["album"];
        return album?.title || "-";
      },
    },
    {
      accessorKey: "genres",
      header: "Genres",
      cell: ({ row }) => {
        const genres = row.getValue("genres") as Song["genres"];
        return genres.map((genre) => genre.name).join(", ");
      },
    },
    {
      accessorKey: "fileUrl",
      header: "Preview",
      cell: ({ row }) => (
        <audio controls>
          <source src={row.getValue("fileUrl")} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ),
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
            {deleteLoading === row.original.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSong(), fetchArtist(), fetchGenres()]);
        console.log("All data has been loaded");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [fetchSong, fetchArtist, fetchGenres]);

  const handleEdit = (song: Song) => {
    router.push(`/admin/songs/${song.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài hát này?")) {
      try {
        setDeleteLoading(id);
        await deleteSong(id);
        alert("Xóa bài hát thành công");
      } catch (error) {
        console.error("Lỗi khi xóa bài hát:", error);
        alert("Không thể xóa bài hát");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleAddNew = () => {
    router.push("/admin/songs/newsong");
  };

  const table = useReactTable({
    data: songs,
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Songs Management</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Song
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{songs.length}</div>
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No songs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
