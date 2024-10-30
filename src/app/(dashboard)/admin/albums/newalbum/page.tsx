"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlbumStore } from "@/store/useAlbumStore";
import { useArtistStore } from "@/store/useArtistStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface NewAlbumForm {
  title: string;
  artistId: string; // Thay đổi từ artist object sang artistId string
  releaseDate: string;
  coverImg: File | null; // Đổi tên để khớp với backend
}

export default function NewAlbumPage() {
  const router = useRouter();
  const { createAlbum } = useAlbumStore();
  const { artists, fetchArtist } = useArtistStore();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [newAlbum, setNewAlbum] = useState<NewAlbumForm>({
    title: "",
    artistId: "", // Thay đổi từ artist: null
    releaseDate: "",
    coverImg: null, // Đổi tên từ coverImage
  });

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAlbum({
        ...newAlbum,
        coverImg: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artistId", newAlbum.artistId);
      formData.append("releaseDate", newAlbum.releaseDate);

      if (newAlbum.coverImg) {
        formData.append("coverImg", newAlbum.coverImg);
      }

      await createAlbum(formData);
      alert("Tạo album thành công!");
      router.push("/admin/albums");
    } catch (error) {
      console.error("Lỗi khi tạo album:", error);
      alert("Không thể tạo album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tạo Album Mới</h2>
        <p className="text-gray-500">Thêm album mới vào hệ thống</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên Album</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              disabled={loading}
              placeholder="Nhập tên album"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nghệ sĩ</label>
            <Select
              disabled={loading}
              value={newAlbum.artistId} // Thay đổi từ artist?.id
              onValueChange={(value) => {
                setNewAlbum({
                  ...newAlbum,
                  artistId: value, // Lưu trực tiếp artistId
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
              value={newAlbum.releaseDate}
              onChange={(e) =>
                setNewAlbum({
                  ...newAlbum,
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

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/albums")}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !newAlbum.title ||
              !newAlbum.artistId ||
              !newAlbum.releaseDate
            }
          >
            {loading ? "Đang tạo..." : "Tạo Album"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
