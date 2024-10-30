import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.nav`
  --side-bar-width: 255px;
  height: calc((100vh - 64px) - 88px);
  grid-column: 1;
  grid-row: 2;
  width: var(--side-bar-width);
  border-radius: 8px;
  background-color: #121212;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0 0 8px;
  height: 100%;
  width: 100%;
`; 

const Resizer = styled.div<{ $isResizeBarVisible: boolean }>`
  height: 100%;
  width: 9px;
  background: linear-gradient(hsla(0, 0%, 100%, 0.3), hsla(0, 0%, 100%, 0.3))
    no-repeat 50%/1px 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  right: -4.5px;
  cursor: col-resize;
  z-index: 1;
  ${({ $isResizeBarVisible }) =>
    $isResizeBarVisible &&
    `
    opacity: 1;
  `}
  &:hover {
    opacity: 1;
  }
`;

const SideBarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sideBar = useRef<HTMLDivElement | null>(null);
  const resizer = useRef<HTMLDivElement | null>(null);
  const [isResizeBarVisible, setIsResizeBarVisible] = useState<boolean>(false);
  const [SideBarWidth, setSideBarWidth] = useState<number>(255);

  const resizeSideBar = (e: MouseEvent) => {
    const boundingRect = sideBar.current?.getBoundingClientRect();
    if (!boundingRect) return;
    let newSize = e.clientX - boundingRect.left;

    if (newSize < 129) {
      newSize = 129;
    } else if (newSize > 393) {
      newSize = 393;
    }

    setSideBarWidth(newSize);
  };

  const handleMouseDown = () => {
    setIsResizeBarVisible(true);
    document.addEventListener("mousemove", resizeSideBar);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsResizeBarVisible(false);
    document.removeEventListener("mousemove", resizeSideBar);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (sideBar.current) {
      sideBar.current.style.setProperty(
        "--side-bar-width",
        `${SideBarWidth}px`
      );
    }
  }, [SideBarWidth]);

  return (
    <Wrapper ref={sideBar}>
      <Container>{children}</Container>
      <Resizer
        ref={resizer}
        onMouseDown={handleMouseDown}
        $isResizeBarVisible={isResizeBarVisible}
      />
    </Wrapper>
  );
};

export default SideBarLayout;
