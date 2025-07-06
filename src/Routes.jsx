import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import FileUploadDashboard from "pages/file-upload-dashboard";
import FilePreviewModal from "pages/file-preview-modal";
import FileOrganizationManager from "pages/file-organization-manager";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<FileUploadDashboard />} />
        <Route path="/file-upload-dashboard" element={<FileUploadDashboard />} />
        <Route path="/file-preview-modal" element={<FilePreviewModal />} />
        <Route path="/file-organization-manager" element={<FileOrganizationManager />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;