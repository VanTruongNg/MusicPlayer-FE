import styled from "styled-components";

const Container = styled.main`
  width: 100%;
  padding: 24px;
  max-width: 1955px;
`;

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

export default PageContainer;
