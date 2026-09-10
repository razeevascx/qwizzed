"use client";

import { PendingInvitations } from "@/components/pending-invitations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Mail } from "lucide-react";

export default function InvitationsPage() {
  return (
    <div className="space-y-8 w-full min-w-0">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invitations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Quiz Invitations
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Manage your private invitations and join upcoming assessments
          </p>
        </div>
        <div className="hidden sm:inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mt-2">
          <Mail className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl">
        <PendingInvitations />
      </div>
    </div>
  );
}
