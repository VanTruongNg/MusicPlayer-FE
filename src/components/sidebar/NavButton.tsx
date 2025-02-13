import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const LinkLabel = styled.p<{ $isSelected: boolean }>`
  font-size: 0.875rem;
  margin-left: 16px;
  width: 100%;
  text-align: left;
  line-height: 1.6;
  color: #b3b3b3;
  font-weight: 700;
  transition: color 0.3s ease-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ $isSelected }) => $isSelected && `color: #fff;`}
`;

const NavLinkButton = styled.div`
  height: 40px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  &:hover ${LinkLabel} {
    color: #fff;
  }
`;

const LogoContainer = styled.div`
  opacity: 0.7;
  height: 24px;
  flex-shrink: 0;
  &:hover {
    opacity: 1;
  }
`;

interface NavButtonProps {
  label: string;
  link: string;
  imageSrc: string;
  imageSrcSelected: string;
  imageAlt: string;
  isActive: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  label,
  link,
  imageSrc,
  imageSrcSelected,
  imageAlt,
  isActive,
}) => {
  const imageSource = isActive ? imageSrcSelected : imageSrc;

  return (
    <Link href={link} passHref>
      <NavLinkButton>
        <LogoContainer>
          <Image src={imageSource} alt={imageAlt} width={24} height={24} />
        </LogoContainer>
        <LinkLabel $isSelected={isActive}>{label}</LinkLabel>
      </NavLinkButton>
    </Link>
  );
};

export default NavButton;
