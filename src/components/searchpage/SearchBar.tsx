"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import SearchLogo from "../../../public/header_logos/search.svg";
import CrossLogo from "../../../public/header_logos/cross.svg";
import { usePathname, useRouter } from "next/navigation";
import { debounce } from "lodash";

const SearchLogoContainer = styled.div`
  height: 24px;
  width: 24px;
  opacity: 0.7;
`;

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &:focus-within ${SearchLogoContainer} {
    opacity: 1;
  }
  &:hover ${SearchLogoContainer} {
    opacity: 1;
  }
`;

const SearchBarHoverContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  right: 12px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  height: 48px;
  width: 440px;
  font-size: 0.875rem;
  color: #fff;
  border: 0;
  background-color: transparent;
  padding: 6px 48px;
  text-overflow: ellipsis;
  background-color: #242424;
  border-radius: 500px;
  &:hover {
    background-color: #2a2a2a;
    box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 20%);
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 2px #fff;
  }
  &:active {
    outline: 0;
    box-shadow: 0 0 0 2px #fff;
  }
`;

const ClearButton = styled.button`
  height: 24px;
  width: 24px;
  border: 0;
  background-color: transparent;
  pointer-events: all;
`;

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const isClearButtonVisible = searchInput.length > 0;

  const updateUrlWithSearchInput = useCallback(
    (input: string) => {
      if (!pathname.startsWith("/search")) {
        return;
      }
      router.replace(`/search/${input}`);
    },
    [pathname, router]
  );

  const debouncedUpdateUrlWithSearchInput = useCallback(
    debounce(updateUrlWithSearchInput, 300),
    [updateUrlWithSearchInput]
  );

  useEffect(() => {
    debouncedUpdateUrlWithSearchInput(searchInput);
    return () => {
      debouncedUpdateUrlWithSearchInput.cancel();
    };
  }, [searchInput, debouncedUpdateUrlWithSearchInput]);

  const handleClickRedirectToSearchPage = () => {
    if (!pathname.startsWith("/search")) {
      router.push("/search");
    }
  };

  return (
    <Container>
      <SearchBarHoverContainer>
        <SearchLogoContainer>
          <SearchLogo />
        </SearchLogoContainer>
        {isClearButtonVisible && (
          <ClearButton onClick={() => setSearchInput("")}>
            <CrossLogo />
          </ClearButton>
        )}
      </SearchBarHoverContainer>
      <SearchInput
        placeholder="Bạn muốn nghe gì ?"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        maxLength={800}
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        onFocus={handleClickRedirectToSearchPage}
      />
    </Container>
  );
};

export default SearchBar;
