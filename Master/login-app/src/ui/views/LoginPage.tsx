import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react'

import { type LoginCredentials, loginSchema } from '../../core/auth.schema'
import { loginUser } from '../../application/authService'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Notification } from '../components/Notification'
import Logo from '../components/Logo'

export const LoginPage: React.FC = () => {
  // --- La lógica del formulario no cambia, ¡sigue siendo perfecta! ---
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true)
    setNotification(null)
    try {
      const result = await loginUser(data)
      setNotification({
        message: `¡Bienvenido, ${result.userName}! Redirigiendo...`,
        type: 'success'
      })
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ message: error.message, type: 'error' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Notification
        message={notification?.message || ''}
        type={notification?.type || 'success'}
        onClose={() => setNotification(null)}
      />

      {/* --- AQUÍ COMIENZA LA NUEVA ESTRUCTURA VISUAL --- */}

      {/* 1. CONTENEDOR PRINCIPAL */}
      {/* Usamos CSS Grid para dividir la pantalla en 2 columnas en pantallas grandes (lg) */}
      <div className='min-h-screen lg:grid lg:grid-cols-2 mx-32'>
        {/* 2. PANEL IZQUIERDO (LOGO) */}
        {/* Este panel tiene un fondo de color y centra el logo. En móvil, es un bloque superior. */}
        <div className='hidden lg:flex items-center justify-center  py-12'>
          {/* ¡AHORA EL LOGO ES GRANDE! 'h-160' es 640px. Puedes ajustarlo si lo necesitas. */}
          <Logo className='h-160 w-auto' />
        </div>

        {/* 3. PANEL DERECHO (FORMULARIO) */}
        {/* Este panel centra vertical y horizontalmente el contenido del formulario. */}
        <div className='flex items-center justify-center  py-12 sm:px-6 lg:px-8'>
          <div className='w-full max-w-md space-y-8  bg-gray-100 p-8 rounded-lg shadow-lg'>
            {/* Logo visible solo en pantallas pequeñas, para mantener la identidad de marca */}
            <div className='lg:hidden'>
              <Logo className='mx-auto h-24 w-auto' />
            </div>

            <div>
              <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                Portal del Personal
              </h2>
              <p className='mt-2 text-center text-sm text-gray-600'>
                Inicia sesión para acceder al sistema
              </p>
            </div>

            <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-4 rounded-md'>
                <Input
                  id='email'
                  label='Correo Electrónico'
                  type='email'
                  autoComplete='email'
                  placeholder='medico@hospital.com'
                  icon={<Mail className='h-5 w-5 text-gray-400' />}
                  registration={register('email')}
                  error={errors.email?.message}
                />
                <Input
                  id='password'
                  label='Contraseña'
                  type='password'
                  autoComplete='current-password'
                  placeholder='••••••••'
                  icon={<Lock className='h-5 w-5 text-gray-400' />}
                  registration={register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div>
                <Button type='submit' isLoading={isLoading}>
                  Iniciar Sesión
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
