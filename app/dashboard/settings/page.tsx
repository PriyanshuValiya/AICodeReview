"use client";

import ProfilePage from "@/module/settings/components/profile-form";
import RepositoryList from "@/module/settings/components/repositories-list";

function SettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:px-6 lg:px-3">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account and repositories
          </p>
        </div>

        <div className="mb-5">
          <ProfilePage />
        </div>

        <div>
          <RepositoryList />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
