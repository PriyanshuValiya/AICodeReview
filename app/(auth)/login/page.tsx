import React from 'react'
import LoginUI from '@/module/auth/components/login-ui'
import { requireUnAuth } from '@/module/utils/auth-utils'

async function LoginPage() {
  await requireUnAuth();

  return (
    <LoginUI />
  )
}

export default LoginPage