import styled from "styled-components";
import SideBarLayout from "./SideBarLayout";
import CreationBar from "./CreationBar";

const Separator = styled.div`
  height: 1px;
  width: calc(100% - 40px);
  background-color: #282828;
  margin: 8px 16px 0 16px;
`;

const SideBar = () => {
  return (
    <SideBarLayout>
      <CreationBar />
      <Separator />
    </SideBarLayout>
  );
};

export default SideBar;
