import { useParams, usePathname } from "next/navigation";
import styled from "styled-components";
import CategoryFilterButton from "./CategoryFilterButton";

const BarContainer = styled.div`
  height: 64px;
  width: 100%;
  background-color: #121212;
  padding: 0 32px;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  z-index: 10;
`;
const FiltersContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryFilterBar = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchQuery = params.searchQuery as string;

  return (
    <BarContainer>
      <FiltersContainer>
        <CategoryFilterButton
          title="Tất Cả"
          link={`/search/${searchQuery}`}
          isSelected={pathname.split('/').length <= 3}
        />
      </FiltersContainer>
    </BarContainer>
  );
};

export default CategoryFilterBar;
