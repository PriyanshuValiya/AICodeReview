"use client"

import ProfilePage from "@/module/settings/components/profile-form"
import RepositoryList from "@/module/settings/components/repositories-list"

function SettingsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage account</p>
            <div><ProfilePage /></div>
        </div>

        <div>
          <RepositoryList />
        </div>
    </div>
  )
}

export default SettingsPage