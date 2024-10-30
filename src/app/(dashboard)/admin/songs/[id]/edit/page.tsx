"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Song, useSongStore } from "@/store/useSongStore";
import { useArtistStore } from "@/store/useArtistStore";
import { useGenreStore } from "@/store/useGenreStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditSongPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState<
    "info" | "artists" | "genres" | "albums" | "file" // thêm "file"
  >("info");
  const [editedSong, setEditedSong] = useState<Song | null>(null);

  const [loading, setLoading] = useState(false);
  const [newAudioUrl, setNewAudioUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { songs, fetchSong, updateSongGenres, updateSongFile } = useSongStore();
  const { artists, fetchArtist } = useArtistStore();
  const { genres, fetchGenres } = useGenreStore();

  useEffect(() => {
    return () => {
      if (newAudioUrl) {
        URL.revokeObjectURL(newAudioUrl);
      }
    };
  }, [newAudioUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Chỉ tạo preview và lưu file
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setNewAudioUrl(url);
    } catch (error) {
      console.error("Failed to handle file:", error);
      alert("Failed to handle file");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSong(), fetchArtist(), fetchGenres()]);
      const song = songs.find((s) => s.id === params.id);
      if (song) {
        setEditedSong({
          ...song,
          genres: song.genres?.filter((genre) => genre && genre.id) || [],
        });
      }
    };
    loadData();
  }, [params.id]);

  const handleGenreChange = (newGenreId: string) => {
    const newGenre = genres.find((g) => g.id === newGenreId);

    if (newGenre && editedSong) {
      const isGenreExists = editedSong.genres?.some(
        (g) => g?.id === newGenre.id
      );

      if (!isGenreExists) {
        const currentGenres = editedSong.genres?.filter((g) => g && g.id) || [];
        setEditedSong({
          ...editedSong,
          genres: [...currentGenres, newGenre],
        });
      }
    }
  };

  const handleRemoveGenre = (genreId: string) => {
    if (editedSong) {
      const updatedGenres =
        editedSong.genres?.filter((g) => g && g.id !== genreId) || [];
      setEditedSong({
        ...editedSong,
        genres: updatedGenres,
      });
    }
  };

  const handleSave = async () => {
    console.log("handleSave called", editMode, editedSong);
    if (!editedSong) return;

    try {
      switch (editMode) {
        case "info":
          console.log("Updating info");
          break;
        case "artists":
          console.log("Updating artists");
          break;
        case "genres":
          const validGenres = editedSong.genres?.filter(
            (genre) => genre && genre.id
          );
          console.log("Valid genres to update:", validGenres);

          if (validGenres && validGenres.length > 0) {
            // Truyền trực tiếp mảng Genre[] vào hàm updateSongGenres
            await updateSongGenres(editedSong.id, validGenres);
            console.log("Genres updated successfully");
          } else {
            console.log("No valid genres to update");
          }
          break;
        case "albums":
          console.log("Updating albums");
          break;
        case "file":
          if (!selectedFile) {
            alert("Please select a new audio file first");
            return;
          }
          setLoading(true);
          try {
            await updateSongFile(editedSong.id, selectedFile);
            alert("Audio file updated successfully");
          } catch (error) {
            console.error("Failed to update audio file:", error);
            alert("Failed to update audio file");
          } finally {
            setLoading(false);
          }
          break;
        default:
          console.log("No action for this mode");
      }
      router.push("/admin/songs");
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  if (!editedSong) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Song: {editedSong.title}
        </h2>
        <Button onClick={() => router.push("/admin/songs")}>
          Back to Songs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Song Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="space-y-4">
            {/* Cover Image */}
            <div className="relative h-48 w-48 mx-auto">
              <Image
                src={editedSong.coverImgUrl || "/default-cover.jpg"}
                alt={editedSong.title}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* Audio Preview */}
            <div className="w-full">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <audio controls className="w-full">
                <source src={editedSong.fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Current Info Display */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Current Information</h3>
              <p>
                <span className="font-medium">Title:</span> {editedSong.title}
              </p>
              <p>
                <span className="font-medium">Artists:</span>{" "}
                {editedSong.artists?.map((artist) => artist.name).join(", ") ||
                  "No artists"}
              </p>
              <p>
                <span className="font-medium">Genres:</span>{" "}
                {editedSong.genres
                  ?.filter((g) => g && g.id)
                  .map((genre) => genre.name)
                  .join(", ") || "No genres"}
              </p>
              <p>
                <span className="font-medium">Album:</span>{" "}
                {editedSong.album?.title || "No album"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex space-x-4 mb-6">
            <Button
              onClick={() => setEditMode("info")}
              variant={editMode === "info" ? "default" : "outline"}
            >
              Info
            </Button>
            <Button
              onClick={() => setEditMode("artists")}
              variant={editMode === "artists" ? "default" : "outline"}
            >
              Artists
            </Button>
            <Button
              onClick={() => setEditMode("genres")}
              variant={editMode === "genres" ? "default" : "outline"}
            >
              Genres
            </Button>
            <Button
              onClick={() => setEditMode("albums")}
              variant={editMode === "albums" ? "default" : "outline"}
            >
              Album
            </Button>
            {/* Thêm button mới */}
            <Button
              onClick={() => setEditMode("file")}
              variant={editMode === "file" ? "default" : "outline"}
            >
              File
            </Button>
          </div>

          <div className="space-y-4">
            {editMode === "info" && (
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={editedSong?.title || ""}
                  onChange={(e) =>
                    setEditedSong({ ...editedSong, title: e.target.value })
                  }
                />
              </div>
            )}

            {editMode === "artists" && (
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    const newArtist = artists.find((a) => a.id === value);
                    if (newArtist && editedSong) {
                      // Kiểm tra xem nghệ sĩ đã tồn tại chưa
                      const isArtistExists = editedSong.artists?.some(
                        (a) => a.id === newArtist.id
                      );

                      if (!isArtistExists) {
                        setEditedSong({
                          ...editedSong,
                          artists: [...(editedSong.artists || []), newArtist],
                        });
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn nghệ sĩ" />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map((artist) => (
                      <SelectItem
                        key={artist.id}
                        value={artist.id}
                        disabled={editedSong.artists?.some(
                          (a) => a.id === artist.id
                        )}
                      >
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-2 space-y-2">
                  {editedSong.artists?.map((artist) => (
                    <div
                      key={artist.id}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary"
                    >
                      <span className="font-medium">{artist.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => {
                          setEditedSong({
                            ...editedSong,
                            artists:
                              editedSong.artists?.filter(
                                (a) => a.id !== artist.id
                              ) || [],
                          });
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                  {(!editedSong.artists || editedSong.artists.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Chưa có nghệ sĩ nào được chọn
                    </p>
                  )}
                </div>
              </div>
            )}

            {editMode === "genres" && (
              <div className="space-y-4">
                <Select onValueChange={handleGenreChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem
                        key={genre.id}
                        value={genre.id}
                        disabled={editedSong.genres?.some(
                          (g) => g?.id === genre.id
                        )}
                      >
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-2">
                  {editedSong.genres
                    ?.filter((genre) => genre && genre.id)
                    .map((genre) => (
                      <div
                        key={genre.id}
                        className="flex items-center justify-between p-2 rounded-md bg-secondary mb-2"
                      >
                        <span className="font-medium">{genre.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleRemoveGenre(genre.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  {(!editedSong.genres || editedSong.genres.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Chưa có thể loại nào được chọn
                    </p>
                  )}
                </div>
              </div>
            )}

            {editMode === "file" && (
              <div className="space-y-6">
                {/* Current Audio Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Current Audio</h3>
                  <audio controls className="w-full">
                    <source src={editedSong.fileUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Upload New Audio Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Upload New MP3 File
                  </label>
                  <Input
                    type="file"
                    accept="audio/mpeg"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>

                {/* New Audio Preview Section */}
                {newAudioUrl && (
                  <div className="space-y-2 border-t pt-4">
                    <h3 className="text-lg font-medium">New Audio Preview</h3>
                    <audio controls className="w-full">
                      <source src={newAudioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <p className="text-sm text-gray-500">
                      ⚠️ Preview only. Click Save Changes to update the song.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center text-sm text-gray-500">
                    Updating file...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={() => router.push("/admin/songs")} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
