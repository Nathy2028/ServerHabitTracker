import { supabase } from './supabaseClient.js';
function checkError(error, message) {
    if (error)
        throw new Error(error.message || message);
}
function requireData(data, message) {
    if (data === null)
        throw new Error(message);
    return data;
}
export async function getHabits() {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });
    checkError(error, 'No se pudieron cargar los habitos');
    return data || [];
}
export async function createHabit(habit) {
    const { data, error } = await supabase
        .from('habits')
        .insert({
        name: habit.name.trim(),
        description: habit.description.trim(),
        frequency: habit.frequency,
        completed: false
    })
        .select()
        .single();
    checkError(error, 'No se pudo crear el habito');
    return requireData(data, 'No se pudo crear el habito');
}
export async function updateHabit(id, habit) {
    const updates = {
        updated_at: new Date().toISOString()
    };
    if (habit.name !== undefined)
        updates.name = habit.name.trim();
    if (habit.description !== undefined)
        updates.description = habit.description.trim();
    if (habit.frequency !== undefined)
        updates.frequency = habit.frequency;
    if (habit.completed !== undefined)
        updates.completed = habit.completed;
    const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    checkError(error, 'No se pudo editar el habito');
    return requireData(data, 'No se pudo editar el habito');
}
export async function toggleHabit(id) {
    const { data: habit, error } = await supabase
        .from('habits')
        .select('completed')
        .eq('id', id)
        .single();
    checkError(error, 'No se pudo encontrar el habito');
    const currentHabit = requireData(habit, 'No se pudo encontrar el habito');
    return updateHabit(id, { completed: !currentHabit.completed });
}
export async function deleteHabit(id) {
    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);
    checkError(error, 'No se pudo borrar el habito');
    return true;
}
