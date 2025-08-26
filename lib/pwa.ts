export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js')
        console.log('Service Worker registered successfully:', registration)
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                if (confirm('New version available! Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    })
  }
}

export function checkForPWAInstall() {
  if (typeof window !== 'undefined') {
    let deferredPrompt: any = null

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      
      // Show custom install button/banner
      const installBanner = document.getElementById('pwa-install-banner')
      if (installBanner) {
        installBanner.style.display = 'block'
      }
    })

    // Handle install button click
    const installButton = document.getElementById('pwa-install-button')
    if (installButton) {
      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt()
          
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice
          
          if (outcome === 'accepted') {
            console.log('User accepted the PWA install prompt')
          } else {
            console.log('User dismissed the PWA install prompt')
          }
          
          // Clear the deferredPrompt
          deferredPrompt = null
          
          // Hide the install banner
          const installBanner = document.getElementById('pwa-install-banner')
          if (installBanner) {
            installBanner.style.display = 'none'
          }
        }
      })
    }

    // Detect if app is already installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      // Hide install banner if it's still showing
      const installBanner = document.getElementById('pwa-install-banner')
      if (installBanner) {
        installBanner.style.display = 'none'
      }
    })
  }
}

export function isRunningAsPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as any).standalone === true
  )
}
