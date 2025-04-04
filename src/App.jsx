import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import CompressImage from './components/CompressImage';
import ResizeImage from './components/ResizeImage';
import CropImage from './components/CropImage';
import ConvertToJpg from './components/ConvertToJpg';
import WatermarkImage from './components/WatermarkImage';
import BlurFace from './components/BlurFace';
import ImageEditor from './components/ImageEditor';
import RemoveBackground from './components/RemoveBackground';
import UpscaleImage from './components/UpscaleImage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <div className="pt-20 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compress-image" element={<CompressImage />} />
            <Route path="/resize-image" element={<ResizeImage />} />
            <Route path="/crop-image" element={<CropImage />} />
            <Route path="/convert-to-jpg" element={<ConvertToJpg />} />
            <Route path="/watermark-image" element={<WatermarkImage />} />
            <Route path="/blur-face" element={<BlurFace />} />
            <Route path="/photo-editor" element={<ImageEditor />} />
            <Route path="/remove-background" element={<RemoveBackground />} />
            <Route path="/upscale-image" element={<UpscaleImage />} />
          </Routes>
        </div>
      </Layout>
    </Router>
    
  );
}

export default App;
