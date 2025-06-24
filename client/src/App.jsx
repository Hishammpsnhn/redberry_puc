
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './pages/upload/Upload';
import Home from './pages/home/Home';
import VideoPage from './pages/video/VideoPage';

function App() {

  return (
     <BrowserRouter>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/video/:id" element={<VideoPage />} />
        {/* Catch-all for undefined routes */}
        {/* <Route path="*" element={< />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
