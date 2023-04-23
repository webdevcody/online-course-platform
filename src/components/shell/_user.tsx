import React from "react";
import {
  IconChevronRight,
  IconChevronLeft,
  IconPower,
} from "@tabler/icons-react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
  rem,
  Button,
  Menu,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

export function User() {
  const theme = useMantineTheme();

  const user = useSession();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      {user.data ? (
        <UnstyledButton
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group>
                <Avatar
                  imageProps={{ referrerPolicy: "no-referrer" }}
                  src={user.data.user.image}
                  radius="xl"
                />
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {user.data.user.name}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user.data.user.email}
                  </Text>
                </Box>

                {theme.dir === "ltr" ? (
                  <IconChevronRight size={rem(18)} />
                ) : (
                  <IconChevronLeft size={rem(18)} />
                )}
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => signOut()}
                icon={<IconPower size={14} />}
              >
                Sign Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </UnstyledButton>
      ) : (
        <Button onClick={() => signIn()}>Login</Button>
      )}
    </Box>
  );
}
