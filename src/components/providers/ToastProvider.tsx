'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          fontSize: '14px',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          maxWidth: '400px',
        },
        
        // Success toasts
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        
        // Error toasts
        error: {
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
          duration: 6000,
        },
        
        // Loading toasts
        loading: {
          style: {
            background: '#fefce8',
            color: '#a16207',
            border: '1px solid #fef3c7',
          },
          iconTheme: {
            primary: '#eab308',
            secondary: '#fefce8',
          },
        },
      }}
    />
  )
}
