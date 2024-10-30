import styled from "styled-components";

const NoResultsContainer = styled.div`
  padding-top: 25%;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #fff;
  text-align: center;
  line-height: 1.6;
`;

const NoResultsMainMessage = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "CircularSpTitle", "Roboto", sans-serif;
  word-break: break-all;
`;

const NoResultsSubMessage = styled.p`
  padding: 10px 0 30px;
`;

interface NoResultsProps {
  searchValue: string;
}

export default function NoResults({ searchValue }: NoResultsProps) {
  return (
    <NoResultsContainer>
      <NoResultsMainMessage>
        Không tìm thấy kết quả cho <br />
        &ldquo;{searchValue}&ldquo;
      </NoResultsMainMessage>
      <NoResultsSubMessage>
        Vui lòng kiểm tra lại chính tả. Bạn có thể thử sử dụng ít từ khóa hơn
        hoặc dùng các từ khóa khác.
      </NoResultsSubMessage>
    </NoResultsContainer>
  );
}
