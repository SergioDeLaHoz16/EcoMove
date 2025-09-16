import { LocalStorageService } from "./LocalStorageService.js"

class AuthService {
  constructor() {
    this.subscribers = []
    this.currentUser = null
    this.isAuthenticated = false
    this.staticUsers = [
      {
        id: "user_1",
        email: "usuario@ecomove.com",
        password: "123456",
        nombre: "Juan",
        apellido: "Pérez",
        tipo: "usuario",
        documento: "12345678",
        telefono: "+57 300 123 4567",
        fechaRegistro: new Date().toISOString(),
        activo: true,
      },
      {
        id: "admin_1",
        email: "admin@ecomove.com",
        password: "admin123",
        nombre: "María",
        apellido: "González",
        tipo: "administrador",
        documento: "87654321",
        telefono: "+57 300 987 6543",
        fechaRegistro: new Date().toISOString(),
        activo: true,
      },
    ]
    this.init()
  }

  init() {
    const userData = LocalStorageService.load("currentUser")
    if (userData) {
      this.currentUser = userData
      this.isAuthenticated = true
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  notifySubscribers() {
    const authState = {
      user: this.currentUser,
      isAuthenticated: this.isAuthenticated,
    }

    this.subscribers.forEach((callback) => {
      callback(authState)
    })
  }

  getCurrentUser() {
    return this.currentUser
  }

  isUserAuthenticated() {
    return this.isAuthenticated
  }

  async login(email, password) {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let user = this.staticUsers.find((u) => u.email === email && u.password === password)

      if (!user) {
        const users = LocalStorageService.loadUsers()
        user = users.find((u) => u.email === email && u.password === password)
      }

      if (!user) {
        throw new Error("Credenciales inválidas")
      }

      // Remove password from user object for security
      const { password: _, ...userWithoutPassword } = user

      this.currentUser = userWithoutPassword
      this.isAuthenticated = true

      LocalStorageService.save("currentUser", userWithoutPassword)
      LocalStorageService.save("ecomove_user_token", userWithoutPassword.id)

      // Notify subscribers
      this.notifySubscribers()

      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  async register(userData) {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const users = LocalStorageService.loadUsers()

      // Check if user already exists
      const existingUser = users.find((u) => u.email === userData.email)
      if (existingUser) {
        throw new Error("El usuario ya existe")
      }

      // Create new user with ID
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      }

      // Add to users array
      users.push(newUser)
      LocalStorageService.saveUsers(users)

      // Remove password for return
      const { password: _, ...userWithoutPassword } = newUser

      this.currentUser = userWithoutPassword
      this.isAuthenticated = true

      LocalStorageService.save("currentUser", userWithoutPassword)
      LocalStorageService.save("ecomove_user_token", userWithoutPassword.id)

      // Notify subscribers
      this.notifySubscribers()

      return userWithoutPassword
    } catch (error) {
      throw error
    }
  }

  logout() {
    this.currentUser = null
    this.isAuthenticated = false

    LocalStorageService.remove("currentUser")
    LocalStorageService.remove("ecomove_user_token")

    // Notify subscribers
    this.notifySubscribers()
  }

  requireAuth(callback) {
    if (!this.isAuthenticated) {
      throw new Error("AUTH_REQUIRED")
    }

    if (callback && typeof callback === "function") {
      return callback()
    }

    return true
  }

  // Method for RentalController compatibility
  isAuthenticated() {
    return this.isAuthenticated
  }
}

// Create singleton instance
export const authService = new AuthService()

// Also export the class for controllers that need to instantiate it
export { AuthService }
