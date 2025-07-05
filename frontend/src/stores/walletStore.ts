import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  isConnected: boolean
  address: string | null
  network: string
  balance: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  getBalance: () => Promise<void>
  switchNetwork: (network: string) => Promise<void>
}

declare global {
  interface Window {
    freighterApi: any
  }
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      network: "testnet",
      balance: "0",

      connectWallet: async () => {
        try {
          if (!window.freighterApi) {
            throw new Error("Freighter wallet not found. Please install Freighter extension.")
          }

          const { address } = await window.freighterApi.getAddress()
          const network = await window.freighterApi.getNetwork()

          set({
            isConnected: true,
            address,
            network,
          })

          // Get balance after connecting
          await get().getBalance()
        } catch (error) {
          console.error("Failed to connect wallet:", error)
          throw error
        }
      },

      disconnectWallet: () => {
        set({
          isConnected: false,
          address: null,
          balance: "0",
        })
      },

      getBalance: async () => {
        try {
          const { address } = get()
          if (!address || !window.freighterApi) return

          // This would typically call Stellar SDK to get balance
          // For now, we'll simulate it
          const balance = (await window.freighterApi.getBalance?.(address)) || "0"
          set({ balance })
        } catch (error) {
          console.error("Failed to get balance:", error)
        }
      },

      switchNetwork: async (network: string) => {
        try {
          if (!window.freighterApi) return

          await window.freighterApi.setNetwork(network)
          set({ network })
        } catch (error) {
          console.error("Failed to switch network:", error)
          throw error
        }
      },
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        network: state.network,
      }),
    },
  ),
)
