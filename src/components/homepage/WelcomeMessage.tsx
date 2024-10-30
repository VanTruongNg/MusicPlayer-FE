import styled from "styled-components";

const Title = styled.h2`
  color: #fff;
  font-size: 2em;
  line-height: 1em;
  font-weight: 700;
  margin-bottom: 21.5px;
  font-family: "CircularSpTitle", "Roboto", sans-serif;
`;

const WelcomeMessage = () => {
  const getWelcomeMessage = () => {
    const timeInHours = new Date().getHours();
    if (timeInHours >= 4 && timeInHours <= 18) {
      return "Xin Chào!";
    } else {
      return "Buổi Tối Vui Vẻ";
    }
  };

  const welcomeMessage = getWelcomeMessage() || "Xin Chào!";

  return <Title>{welcomeMessage}</Title>;
};

export default WelcomeMessage
