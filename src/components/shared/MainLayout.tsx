import styled from "styled-components";
import PageHeader from "./PageHeader";
import { ReactNode } from "react";
import SideBar from "../sidebar/SideBar";
import Player from "../musicbar/Player";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  width: 100%;
  background-color: #000;
  gap: 8px;
  padding: 8px;
`;

const PageContainer = styled.div`
  grid-row: 2;
  grid-column: 2;
  height: calc((100vh - 64px) - 88px);
  background-color: #121212;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  border-radius: 8px;
  /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  scrollbar-width: thin;
  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    min-height: 30px;
    border: 2px solid transparent;
    background-color: rgba(255, 255, 255, 0.3);
    background-clip: content-box;
    transition: background-color 0.2s ease-in-out;
    z-index: 9999;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const PlayerWrapper = styled.div`
  grid-row: 3;
  grid-column: 1 / -1;
  width: 100%;
  padding: 0 8px;
  background-color: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(10px);
`;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <MainWrapper>
        <PageHeader />
        <SideBar />
        <PageContainer>{children}</PageContainer>
        <PlayerWrapper>
          <Player />
        </PlayerWrapper>
      </MainWrapper>
    </>
  );
};

export default MainLayout;
