import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js'
import type { CreateHabitInput, Habit, HabitUpdate, UpdateHabitInput } from '../types.js'

function checkError(error: PostgrestError | null, message: string): void {
  if (error) throw new Error(error.message || message)
}

// Evita devolver una respuesta vacia cuando Supabase no encuentra el registro.
function requireData<T>(data: T | null, message: string): T {
  if (data === null) throw new Error(message)
  return data
}

// Obtiene los habitos mas recientes primero para mostrarlos en la aplicacion.
export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false })

  checkError(error, 'No se pudieron cargar los habitos')
  return data || []
}

// Limpia los textos antes de guardar un nuevo habito.
export async function createHabit(habit: CreateHabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      name: habit.name.trim(),
      description: habit.description.trim(),
      frequency: habit.frequency,
      completed: false
    })
    .select()
    .single()

  checkError(error, 'No se pudo crear el habito')
  return requireData(data, 'No se pudo crear el habito')
}

// Actualiza solo los campos que vienen incluidos en la peticion.
export async function updateHabit(id: string, habit: UpdateHabitInput): Promise<Habit> {
  const updates: HabitUpdate = {
    updated_at: new Date().toISOString()
  }

  if (habit.name !== undefined) updates.name = habit.name.trim()
  if (habit.description !== undefined) updates.description = habit.description.trim()
  if (habit.frequency !== undefined) updates.frequency = habit.frequency
  if (habit.completed !== undefined) updates.completed = habit.completed

  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  checkError(error, 'No se pudo editar el habito')
  return requireData(data, 'No se pudo editar el habito')
}

// Consulta el estado actual y lo cambia por su valor contrario.
export async function toggleHabit(id: string): Promise<Habit> {
  const { data: habit, error } = await supabase
    .from('habits')
    .select('completed')
    .eq('id', id)
    .single()

  checkError(error, 'No se pudo encontrar el habito')
  const currentHabit = requireData(habit, 'No se pudo encontrar el habito')
  return updateHabit(id, { completed: !currentHabit.completed })
}

// Elimina el habito usando su identificador unico.
export async function deleteHabit(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)

  checkError(error, 'No se pudo borrar el habito')
  return true
}