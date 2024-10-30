import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const LinkLabel = styled.p<{ $isSelected?: boolean }>`
  font-size: 0.875rem;
  margin-left: 16px;
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#b3b3b3")};
  font-weight: 700;
  width: 100%;
  text-align: left;
  transition: color 0.3s ease-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoContainer = styled.div<{
  $logoBackground: string;
  $isSelected?: boolean;
}>`
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  background: ${({ $logoBackground }) => $logoBackground};
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0.7)};
  transition: opacity 0.3s ease-out;
`;

const CreationLinkButton = styled.div`
  height: 40px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  &:hover ${LinkLabel} {
    color: #fff;
  }
  &:hover ${LogoContainer} {
    opacity: 1;
  }
`;

interface CreationButtonProps {
  label: string;
  link?: string;
  imageSrc: string;
  imageAlt: string;
  logoBackground: string;
}

const CreationButton: React.FC<CreationButtonProps> = ({
  label,
  link,
  imageSrc,
  imageAlt,
  logoBackground,
}) => {
  const pathname = usePathname();

  return (
    <Link href={link ?? "/"}>
      <CreationLinkButton>
        <LogoContainer
          $logoBackground={logoBackground}
          $isSelected={pathname === link}
        >
          <Image src={imageSrc} alt={imageAlt} width={12} height={12} />
        </LogoContainer>
        <LinkLabel $isSelected={pathname === link}>{label}</LinkLabel>
      </CreationLinkButton>
    </Link>
  );
};

export default CreationButton;
