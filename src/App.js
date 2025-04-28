import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from 'styled-components';
import AnimeItem from "./Components/AnimeItem";
import Gallery from "./Components/Gallery";
import Homepage from "./Components/Homepage";
import ScrollToTop from "./Components/ScrollToTop";

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: white;
  position: relative;
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <MainContent>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/anime/:id" element={<AnimeItem />} />
            <Route path="/character/:id" element={<Gallery />} />
          </Routes>
        </MainContent>
        <ScrollToTop />
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;

