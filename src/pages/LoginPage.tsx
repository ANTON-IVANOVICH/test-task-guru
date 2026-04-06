import { useState } from 'react'
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import {
  IconAlertCircle,
  IconLock,
  IconLogin2,
  IconUser,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import { ApiError, login } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

interface LoginFormValues {
  username: string
  password: string
  remember: boolean
}

const LoginPage = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
      remember: false,
    },
    validate: {
      username: (value) =>
        value.trim().length === 0 ? 'Введите логин' : null,
      password: (value) =>
        value.trim().length === 0 ? 'Введите пароль' : null,
    },
  })

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: LoginFormValues) =>
      login({ username, password }),
    onSuccess: (session, variables) => {
      setSession(session, variables.remember)
      notifications.show({
        color: 'green',
        title: 'Успешный вход',
        message: 'Сессия активна',
      })
      navigate('/products', { replace: true })
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.status === 400
            ? 'Invalid credentials'
            : error.message
          : 'Не удалось выполнить вход. Повторите попытку.'
      setApiError(message)
    },
  })

  const handleSubmit = (values: LoginFormValues) => {
    setApiError(null)
    loginMutation.mutate(values)
  }

  return (
    <main className="auth-shell">
      <Paper className="auth-card" radius={32} withBorder>
        <Stack align="center" gap="lg">
          <ThemeIcon className="auth-logo" color="gray" radius="xl" size={48}>
            <IconLogin2 size={22} />
          </ThemeIcon>
          <Stack align="center" gap={6}>
            <Title className="auth-title" order={1}>
              Добро пожаловать!
            </Title>
            <Text c="dimmed">Пожалуйста, авторизуйтесь</Text>
          </Stack>
        </Stack>

        <form className="auth-form" onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Логин"
              leftSection={<IconUser size={16} />}
              placeholder="Введите логин"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Пароль"
              leftSection={<IconLock size={16} />}
              placeholder="Введите пароль"
              {...form.getInputProps('password')}
            />
            <Checkbox
              label="Запомнить данные"
              mt={2}
              {...form.getInputProps('remember', { type: 'checkbox' })}
            />
            {apiError ? (
              <Alert
                color="red"
                icon={<IconAlertCircle size={16} />}
                title="Ошибка авторизации"
                variant="light"
              >
                {apiError}
              </Alert>
            ) : null}
            <Button loading={loginMutation.isPending} mt={4} type="submit">
              Войти
            </Button>
          </Stack>
        </form>

        <Divider label="или" labelPosition="center" my="lg" />
        <Text c="dimmed" ta="center">
          Нет аккаунта?{' '}
          <Anchor
            fw={700}
            href="#"
            onClick={(event) => {
              event.preventDefault()
            }}
          >
            Создать
          </Anchor>
        </Text>
      </Paper>
    </main>
  )
}

export default LoginPage
