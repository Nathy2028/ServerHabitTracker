export type Habit = {
  id: string
  name: string
  description: string
  frequency: string
  completed: boolean
  created_at: string
  updated_at: string
}

export type HabitInsert = {
  name: string
  description: string
  frequency: string
  completed?: boolean
}

export type HabitUpdate = {
  name?: string
  description?: string
  frequency?: string
  completed?: boolean
  updated_at?: string
}

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

export type CreateHabitInput = {
  name: string
  description: string
  frequency: string
}

export type UpdateHabitInput = HabitUpdate