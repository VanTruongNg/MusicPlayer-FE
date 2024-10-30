import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const PanelContainer = styled.div`
  width: 196px;
  max-height: calc(100vh - 24px);
  background-color: #282828;
  color: #b3b3b3;
  position: absolute;
  top: 56px;
  right: 32px;
  border-radius: 4px;
  box-shadow: 0 16px 24px rgba(0, 0, 0, 0.3), 0 6px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const AccountMenu = styled.ul`
  height: 100%;
  width: 100%;
  padding: 4px;
  list-style: none;

  & li:last-child {
    border-top: 1px solid #3e3e3e;
  }
`;

const ButtonLabel = styled.span`
  width: 100%;
  font-size: 0.875rem;
  line-height: 0.875rem;
  font-weight: 400;
  text-align: left;
  display: inline-block;
`;

const OutlinkLogoContainer = styled.div`
  opacity: 0.9;
`;

const MenuButton = styled.button`
  height: 40px;
  width: 100%;
  border-radius: 2px;
  padding: 12px 8px 12px 12px;
  background-color: transparent;
  border: 0;
  color: #e7e7e7;
  position: relative;

  &:hover {
    background-color: #3e3e3e;

    ${ButtonLabel} {
      color: #fff;
    }

    ${OutlinkLogoContainer} {
      opacity: 1;
    }
  }
`;

const ExtendedMenuButton = styled(MenuButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface AccountPanelProps {
  setIsPanelOpen: (isOpen: boolean) => void;
}

const AccountPanel: React.FC<AccountPanelProps> = ({ setIsPanelOpen }) => {
  const panel = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setIsPanelOpen]);

  const handleLogout = async () => {
    await logout();
    setIsPanelOpen(false);
  };

  return (
    <PanelContainer ref={panel}>
      <AccountMenu>
        <li>
          <ExtendedMenuButton>
            <ButtonLabel>Tài Khoản</ButtonLabel>
            <OutlinkLogoContainer>
              <Image
                className="outlinklogo"
                src="/header_logos/out_link.svg"
                alt="out link logo"
                width={16}
                height={16}
              />
            </OutlinkLogoContainer>
          </ExtendedMenuButton>
        </li>
        <li>
          <MenuButton>
            <ButtonLabel>Tuỳ Chỉnh</ButtonLabel>
          </MenuButton>
        </li>
        <li>
          <MenuButton onClick={handleLogout}>
            <ButtonLabel>Đăng Xuất</ButtonLabel>
          </MenuButton>
        </li>
      </AccountMenu>
    </PanelContainer>
  );
};

export default AccountPanel;
