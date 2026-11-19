import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
import nowPlayingHandler from './api/now-playing.ts'
import listeningHandler from './api/listening.ts'
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'spotify-now-playing-api',
        configureServer(server) {
          server.middlewares.use('/api/now-playing', (request, response, next) => {
            void nowPlayingHandler(request, response).catch(next)
          })
          server.middlewares.use('/api/listening', (request, response, next) => {
            void listeningHandler(request, response).catch(next)
          })
        },
      },
    ],
  }
})
