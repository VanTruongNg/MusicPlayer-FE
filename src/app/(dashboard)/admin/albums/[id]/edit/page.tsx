"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlbumStore } from "@/store/useAlbumStore";
import { useArtistStore } from "@/store/useArtistStore";
import { useSongStore } from "@/store/useSongStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function EditAlbumPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addSongToAlbum, albums } = useAlbumStore();
  const { artists, fetchArtist } = useArtistStore();
  const { songs, fetchSong } = useSongStore();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<"info" | "songs">("info");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [editedAlbum, setEditedAlbum] = useState<any>(null);

  useEffect(() => {
    fetchArtist();
    fetchSong();
    const album = albums.find((a) => a.id === params.id);
    if (album) {
      setEditedAlbum(album);
      if (album.coverImgUrl) {
        setPreviewImage(album.coverImgUrl);
      }
    }
  }, [fetchArtist, fetchSong, albums, params.id]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Nếu đang ở tab songs, xử lý thêm bài hát
      if (editMode === "songs") {
        // Lấy danh sách bài hát mới được thêm vào
        const newSongs = editedAlbum.songs.filter(
          (song: any) =>
            !albums
              .find((a) => a.id === params.id)
              ?.songs?.some((s) => s.id === song.id)
        );

        // Thêm từng bài hát mới vào album
        for (const song of newSongs) {
          await addSongToAlbum(params.id, song.id);
        }

        alert("Cập nhật danh sách bài hát thành công!");
      } else {
        // Xử lý cập nhật thông tin cơ bản của album
        const formData = new FormData();
        formData.append("title", editedAlbum.title);
        formData.append("artistId", editedAlbum.artist.id);
        formData.append("releaseDate", editedAlbum.releaseDate);

        if (editedAlbum.newCoverImage) {
          formData.append("coverImage", editedAlbum.newCoverImage);
        }

        await updateAlbum(params.id, formData);
        alert("Cập nhật thông tin album thành công!");
      }

      router.push("/admin/albums");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Không thể cập nhật album");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedAlbum({
        ...editedAlbum,
        newCoverImage: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSong = async (songId: string) => {
    try {
      setLoading(true);
      await addSongToAlbum(params.id, songId);
      alert("Thêm bài hát vào album thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bài hát:", error);
      alert("Không thể thêm bài hát vào album");
    } finally {
      setLoading(false);
    }
  };

  if (!editedAlbum) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa Album</h2>
        <p className="text-gray-500">Cập nhật thông tin album</p>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info" onClick={() => setEditMode("info")}>
            Thông tin cơ bản
          </TabsTrigger>
          <TabsTrigger value="songs" onClick={() => setEditMode("songs")}>
            Danh sách bài hát
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên Album</label>
                <Input
                  value={editedAlbum.title}
                  onChange={(e) =>
                    setEditedAlbum({ ...editedAlbum, title: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nghệ sĩ</label>
                <Select
                  disabled={loading}
                  value={editedAlbum.artist?.id}
                  onValueChange={(value) => {
                    const selectedArtist = artists.find((a) => a.id === value);
                    setEditedAlbum({
                      ...editedAlbum,
                      artist: selectedArtist,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nghệ sĩ" />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày phát hành</label>
                <Input
                  type="date"
                  value={
                    editedAlbum.releaseDate
                      ? new Date(editedAlbum.releaseDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditedAlbum({
                      ...editedAlbum,
                      releaseDate: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ảnh bìa</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {previewImage && (
                  <div className="relative w-40 h-40">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="songs">
          <Card className="p-6">
            <div className="space-y-4">
              <Select
                onValueChange={(value) => {
                  const newSong = songs.find((s) => s.id === value);
                  if (newSong && editedAlbum) {
                    const isSongExists = editedAlbum.songs?.some(
                      (s: any) => s.id === newSong.id
                    );

                    if (!isSongExists) {
                      setEditedAlbum({
                        ...editedAlbum,
                        songs: [...(editedAlbum.songs || []), newSong],
                      });
                    }
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Thêm bài hát vào album" />
                </SelectTrigger>
                <SelectContent>
                  {songs
                    .filter(
                      (song) =>
                        !editedAlbum.songs?.some((s: any) => s.id === song.id)
                    )
                    .map((song) => (
                      <SelectItem
                        key={song.id}
                        value={song.id}
                        disabled={loading}
                      >
                        {song.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                {editedAlbum.songs?.map((song: any) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2 rounded-md bg-secondary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 relative">
                        <Image
                          src={song.coverImgUrl || "/default-cover.jpg"}
                          alt={song.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {song.artists?.map((a: any) => a.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => {
                        setEditedAlbum({
                          ...editedAlbum,
                          songs:
                            editedAlbum.songs?.filter(
                              (s: any) => s.id !== song.id
                            ) || [],
                        });
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                {(!editedAlbum.songs || editedAlbum.songs.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có bài hát nào trong album
                  </p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/albums")}
          disabled={loading}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
}
