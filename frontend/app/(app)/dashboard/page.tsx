"use client";

import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        {isLoading ? (
          <Skeleton className="h-8 w-64" />
        ) : (
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
        )}
        <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your trips.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <MapPinned className="size-6" />
            </span>
            <div>
              <p className="font-medium">No trips yet</p>
              <p className="text-sm text-muted-foreground">
                Trip creation is coming in the next update.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
