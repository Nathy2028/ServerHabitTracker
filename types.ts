// Representa un habito completo tal como se guarda en la base de datos.
export type Habit = {
  id: string
  name: string
  description: string
  frequency: string
  completed: boolean
  created_at: string
  updated_at: string
}

// Campos permitidos al insertar un nuevo habito.
export type HabitInsert = {
  name: string
  description: string
  frequency: string
  completed?: boolean
}

// Campos opcionales que pueden modificarse posteriormente.
export type HabitUpdate = {
  name?: string
  description?: string
  frequency?: string
  completed?: boolean
  updated_at?: string
}

// Estructura tipada que utiliza Supabase para validar las consultas.
export type Database = {
  public: {
    Tables: {
      habits: {
        Row: Habit
        Insert: HabitInsert
        Update: HabitUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Datos que recibe la API al crear un habito.
export type CreateHabitInput = {
  name: string
  description: string
  frequency: string
}

// Reutiliza los campos actualizables para las peticiones PATCH.
export type UpdateHabitInput = HabitUpdate