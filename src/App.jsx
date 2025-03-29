import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ImageEditor from './components/ImageEditor';
import Home from './components/Home';
import CompressImage from './components/CompressImage';
import ResizeImage from './components/ResizeImage';
import CropImage from './components/CropImage';
import ConvertToJpg from './components/ConvertToJpg';
import UpscaleImage from './components/UpscaleImage';
import RemoveBackground from './components/RemoveBackground';
import WatermarkImage from './components/WatermarkImage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/photo-editor"
          element={
            <Layout>
              <ImageEditor />
            </Layout>
          }
        />
        <Route
          path="/compress-image"
          element={
            <Layout>
              <CompressImage />
            </Layout>
          }
        />
        <Route
          path="/resize-image"
          element={
            <Layout>
              <ResizeImage />
            </Layout>
          }
        />
        <Route
          path="/crop-image"
          element={
            <Layout>
              <CropImage />
            </Layout>
          }
        />
        <Route
          path="/convert-to-jpg"
          element={
            <Layout>
              <ConvertToJpg />
            </Layout>
          }
        />
        <Route
          path="/upscale-image"
          element={
            <Layout>
              <UpscaleImage />
            </Layout>
          }
        />
        <Route
          path="/remove-background"
          element={
            <Layout>
              <RemoveBackground />
            </Layout>
          }
        />
        <Route
          path="/watermark-image"
          element={
            <Layout>
              <WatermarkImage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;