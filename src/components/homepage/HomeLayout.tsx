import PageContainer from "../shared/PageContainer";
import WelcomeMessage from "./WelcomeMessage";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageContainer>
      <WelcomeMessage />
      {children}
    </PageContainer>
  );
};

export default HomeLayout;
