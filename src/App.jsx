import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ImageEditor from './components/ImageEditor';
import Home from './components/Home';
import CompressImage from './components/CompressImage';
import ResizeImage from './components/ResizeImage';
import CropImage from './components/CropImage';
import ConvertToJpg from './components/ConvertToJpg';

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
      </Routes>
    </Router>
  );
}

export default App;