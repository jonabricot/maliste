import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link, useMatch, useMatches } from "react-router"

// This is sample data.
const data = {
  navigation: [
    {
      title: "Entités",
      items: [
        {
          title: "Utilisateur",
          url: "/dashboard/users",
        },
        {
          title: "Liste",
          url: "/dashboard/lists",
        },
      ],
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const matches = useMatches()
  console.log(matches)
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        coucou
      </SidebarHeader>
      <SidebarContent>
        {data.navigation.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={matches[matches.length-1].pathname === item.url}
                      render={<Link to={item.url} />}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
