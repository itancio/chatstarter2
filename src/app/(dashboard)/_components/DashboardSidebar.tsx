"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { User2Icon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { NewDirectMessage } from "./NewDirectMessage";
import { useEffect } from "react";

function DashboardSidebar() {
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      <RedirectToSignIn />;
    }
  }, [isAuthenticated]);

  const user = useQuery(api.functions.user.get);
  const directMessages = useQuery(api.functions.dm.list);
  const pathname = usePathname();

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/"}>
                    <Link href="/">
                      <User2Icon />
                      Friends
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroup>
              <SidebarGroupLabel> Direct Messages</SidebarGroupLabel>
              <NewDirectMessage />
              <SidebarGroupContent>
                <SidebarMenu>
                  {directMessages?.map((directMessage) => (
                    <SidebarMenuItem key={directMessage._id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/dms/${directMessage._id}`}
                      >
                        <Link href={`/dms/${directMessage._id}`}>
                          <Avatar className="size-6">
                            <AvatarImage src={directMessage.user.image} />
                            <AvatarFallback>
                              {directMessage.user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium">
                            {directMessage.user.username}
                          </p>
                          <XCircleIcon onClick={() => {}} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="flex items-center">
                        <Avatar className="size-6">
                          <AvatarImage src={user?.image} />
                          <AvatarFallback>{user?.username[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user?.username}</p>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <SignOutButton />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export default DashboardSidebar;
