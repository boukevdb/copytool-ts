import React from 'react'
import { CopyPage } from './components/copy/CopyPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <CopyPage />
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}

export default App
