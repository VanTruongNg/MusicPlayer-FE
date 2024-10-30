"use client"

import styled from "styled-components";
import SearchCategories from "@/data/search_categories.json";
import SearchCard from "@/components/searchpage/SearchCard";

const Container = styled.div`
  width: 100%;
  padding: 40px 24px 24px 32px;
  max-width: 1955px;
`;
const SearchSection = styled.section`
  padding: 16px 0;
`;
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  letter-spacing: -0.06rem;
  font-weight: 700;
  color: #fff;
  padding-bottom: 16px;
`;
const CategoriesContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  grid-gap: 24px;
  position: relative;
`;

const SearchPage = () => {
  return (
    <Container>
      <SearchSection>
        <SectionTitle>Tất cả</SectionTitle>
        <CategoriesContainer>
          {SearchCategories.map((category) => (
            <SearchCard
              key={category.title}
              title={category.title}
              cardBackgroundColor={category.background_color}
              imgSrc={category.cover_url}
            />
          ))}
        </CategoriesContainer>
      </SearchSection>
    </Container>
  );
};

export default SearchPage;
