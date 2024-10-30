import { usePathname } from "next/navigation";
import NavButton from "./NavButton";
import CreationButton from "./CreationButton";

const pagesWhereFullBooks = [
  "/collection/playlists",
  "/collection/podcasts",
  "/collection/artists",
  "/collection/albums",
];

const CreationBar = () => {
  const pathname = usePathname();

  return (
    <div>
      <NavButton
        label="Libraries"
        link="/collection/playlists"
        imageSrc="/sidebar_logos/books.svg"
        imageSrcSelected="/sidebar_logos/books_full.svg"
        imageAlt="Libraries Link Button"
        isActive={pagesWhereFullBooks.includes(pathname)}
      />
      <CreationButton
        label="Tạo Playlist"
        imageSrc="/sideBar_logos/cross.svg"
        imageAlt="Logo Create Playlist"
        logoBackground="#fff"
      />
    </div>
  );
};

export default CreationBar;
