import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import WebLogo from "../../../public/header_logos/7304545.png";
import HouseFullLogo from "../../../public/header_logos/house_full.svg";
import HouseLogo from "../../../public/header_logos/house.svg";
import AvatarLogo from "../../../public/header_logos/default_avatar.svg";
import Image from "next/image";
import SearchBar from "../searchpage/SearchBar";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import AccountPanel from "./AccountPanel";

interface HomeLogoContainerProps {
  $isHomePage: boolean;
}

const HeaderContainer = styled.header`
  background-color: #000;
  grid-column: 1 / -1;
  grid-row: 1;
`;

const MainNavbar = styled.div`
  height: 48px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr;
  gap: 16px;
  padding-left: 8px;
  border-radius: 8px;
  background-color: #0ff0;
`;

const LeftContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
  align-items: center;
`;

const LogoButton = styled.div`
  height: 32px;
  width: 32px;
  color: #fff;
  background-color: transparent;
  cursor: pointer;
`;

const CentralContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 32px;
`;

const HomeLogoContainer = styled.div<HomeLogoContainerProps>`
  height: 24px;
  width: 24px;
  opacity: 0.7;
  ${({ $isHomePage }) =>
    $isHomePage &&
    `
      opacity: 1;
    `}
`;

const HomeButton = styled.div`
  height: 48px;
  width: 48px;
  background-color: #242424;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #2a2a2a;
    ${HomeLogoContainer} {
      opacity: 1;
    }
  }
`;

const AccountButton = styled.button`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background-color: #121212;
  border: 8px solid #242424;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  &:hover {
    border-color: #2a2a2a;
  }
  svg {
    margin-bottom: 2px;
  }
  img {
    border-radius: 50%;
    object-fit: cover;
  }
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #333333;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
`;

const PageHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [ isPanelOpen, setIsPanelOpen] = useState(false);
  const { isLoggedIn, user } = useAuthStore();

  const openPanel = () => {
    if (isLoggedIn) {
      setTimeout(() => {
        setIsPanelOpen(true);
      }, 0);
    } else {
      router.push("/login");
    }
  };

  return (
    <HeaderContainer>
      <MainNavbar>
        <LeftContainer>
          <Link href="/" aria-label="accueil">
            <LogoButton>
              <Image src={WebLogo} alt="Logo" height={32} width={32} />
            </LogoButton>
          </Link>
        </LeftContainer>
        <CentralContainer>
          <Link href="/" aria-label="accueil">
            <HomeButton>
              <HomeLogoContainer $isHomePage={pathname === "/"}>
                {pathname === "/" ? <HouseFullLogo /> : <HouseLogo />}
              </HomeLogoContainer>
            </HomeButton>
          </Link>
          <SearchBar />
        </CentralContainer>
        <RightContainer>
          {isLoggedIn ? (
            <AccountButton
              onClick={openPanel}
              aria-label="Mở tuỳ chọn tài khoản"
            >
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  sizes="5vw"
                  draggable="false"
                  fill
                  alt="photo de profil"
                />
              ) : (
                <AvatarLogo width={16} height={16} alt="account button" />
              )}
            </AccountButton>
          ) : (
            <LoginButton onClick={() => router.push("/login")}>
              Đăng nhập
            </LoginButton>
          )}
        </RightContainer>
        {isPanelOpen && <AccountPanel setIsPanelOpen={setIsPanelOpen} />}
      </MainNavbar>
    </HeaderContainer>
  );
};

export default PageHeader;
