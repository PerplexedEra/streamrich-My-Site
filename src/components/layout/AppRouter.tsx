import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import VideoPage from '../../pages/VideoPage';
import UploadPage from '../../pages/UploadPage';
import ProfilePage from '../../pages/ProfilePage';
import TrendingPage from '../../pages/TrendingPage';
import NotFoundPage from '../../pages/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watch/:id" element={<VideoPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
