import * as z from "zod";
import { useForm, zodResolver } from "@mantine/form";
import useAuth from "@/features/auth/hooks/use-auth";
import { ILogin } from "@/features/auth/types/auth.types";
import {
  Container,
  Title,
  TextInput,
  Button,
  PasswordInput,
  Box,
  Anchor,
  Divider,
} from "@mantine/core";
import classes from "./auth.module.css";
import { useRedirectIfAuthenticated } from "@/features/auth/hooks/use-redirect-if-authenticated.ts";
import { Link, useNavigate } from "react-router-dom";
import APP_ROUTE from "@/lib/app-route.ts";
import { getBackendUrl } from "@/lib/config";
import { useTranslation } from "react-i18next";
import { IconBrandDiscord } from "@tabler/icons-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const { t } = useTranslation();
  const { signIn, isLoading } = useAuth();
  useRedirectIfAuthenticated();

  const form = useForm<ILogin>({
    validate: zodResolver(formSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: ILogin) {
    await signIn(data);
  }

  const handleDiscordLogin = () => {
    window.location.href = `${getBackendUrl()}/auth/discord`;
  };

  return (
    <Container size={420} my={40} className={classes.container}>
      <Box p="xl" mt={200}>
        <Title order={2} ta="center" fw={500} mb="md">
          {t("Login")}
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            id="email"
            type="email"
            label={t("Email")}
            placeholder="email@example.com"
            variant="filled"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label={t("Password")}
            placeholder={t("Your password")}
            variant="filled"
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            {t("Sign In")}
          </Button>
        </form>

        <Divider label={t("Or continue with")} labelPosition="center" />

        <Button
          variant="outline"
          leftSection={<IconBrandDiscord size={20} />}
          onClick={handleDiscordLogin}
          fullWidth
        >
          {t("Continue with Discord")}
        </Button>

        <Anchor
          to={APP_ROUTE.AUTH.FORGOT_PASSWORD}
          component={Link}
          underline="never"
          size="sm"
        >
          {t("Forgot your password?")}
        </Anchor>
      </Box>
    </Container>
  );
}
