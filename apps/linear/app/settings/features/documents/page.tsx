"use client"

import * as React from "react"
import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"

import {
  SettingsList,
  SettingsListHeader,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
} from "@/components/linear/settings-shell"

export default function DocumentsSettingsPage() {

  return (
    <SettingsShell title="Documents" activeId="documents">
      <SettingsPageIntro
        title="Documents"
        description={
          <>
            Workspace templates are available when creating documents for any
            team. Add team-specific templates from team settings.{" "}
            <Link
              href="https://linear.app/docs/documents"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsSection title="Templates">
        <div data-slot="linear-document-template-list">
          <SettingsListHeader
            count="1 document template"
            addLabel="New template"
            onAdd={() => undefined}
          />
          <SettingsList className="rounded-t-none border-t-0">
            <SettingsRow
              icon={<FileText />}
              title="[Feature/Project Name] - Product Requirements"
              description="Created by Alex Smith just now"
              href="/settings/features/documents/new"
            />
          </SettingsList>
        </div>
      </SettingsSection>
    </SettingsShell>
  )
}
