import {BrowserRouter, Routes, Route} from "react-router-dom";
import History from "./pages/History";
import UploadStruk from "./pages/UploadStruk";
import DataStruk from "./pages/DataStruk";

function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<History />}/>
      <Route path="/upload-struk" element={<UploadStruk />}/>
      <Route path="/data-struk" element={<DataStruk /> }/>
      
      </Routes>
      </BrowserRouter>
  );
}

export default App;
