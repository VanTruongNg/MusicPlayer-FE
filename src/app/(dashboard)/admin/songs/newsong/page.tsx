"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSongStore } from "@/store/useSongStore";
import { useArtistStore } from "@/store/useArtistStore";
import { useRouter } from "next/navigation";

interface NewSongData {
  title: string;
  artistId: string;
  coverImg?: File;
  mp3File?: File;
}

export default function NewSongPage() {
  const router = useRouter();
  const [newSong, setNewSong] = useState<NewSongData>({
    title: "",
    artistId: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewAudio, setPreviewAudio] = useState<string>("");

  const { createSong } = useSongStore();
  const { artists, fetchArtist } = useArtistStore();

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  // Cleanup URLs khi component unmount
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
      if (previewAudio) URL.revokeObjectURL(previewAudio);
    };
  }, [previewImage, previewAudio]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "coverImg" | "mp3File"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSong((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Tạo URL preview
      const url = URL.createObjectURL(file);
      if (fieldName === "coverImg") {
        setPreviewImage(url);
      } else {
        setPreviewAudio(url);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!newSong.title || !newSong.artistId) {
        alert("Please fill in all required fields");
        return;
      }

      if (!newSong.coverImg || !newSong.mp3File) {
        alert("Please upload both cover image and MP3 file");
        return;
      }

      // Tạo FormData để gửi files
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artistId", newSong.artistId);
      formData.append("coverImg", newSong.coverImg);
      formData.append("mp3File", newSong.mp3File);

      await createSong(formData);
      router.push("/admin/songs");
    } catch (error) {
      console.error("Failed to create song:", error);
      alert("Failed to create song. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Add New Song</h2>
        <Button onClick={() => router.push("/admin/songs")}>
          Back to Songs
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Title</label>
              <Input
                required
                value={newSong.title}
                onChange={(e) =>
                  setNewSong({ ...newSong, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Artist</label>
              <Select
                disabled={loading}
                value={newSong.artistId}
                onValueChange={(value) => {
                  setNewSong({
                    ...newSong,
                    artistId: value,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select artist" />
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
              <label className="block text-sm font-medium">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, "coverImg")}
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">MP3 File</label>
              <Input
                type="file"
                accept="audio/mpeg"
                required
                onChange={(e) => handleFileChange(e, "mp3File")}
              />
              {previewAudio && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={previewAudio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={() => router.push("/admin/songs")} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !newSong.title || !newSong.artistId}
          >
            {loading ? "Creating..." : "Create Song"}
          </Button>
        </div>
      </div>
    </div>
  );
}
