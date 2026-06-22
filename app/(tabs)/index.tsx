import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// ✅ The Correct Path: Go up two steps to reach the root level lib folder
import { supabase } from '../../lib/supabase';

// Component Imports
import TaskForm from '../../components/TaskForm';
import TaskItem from '../../components/TaskItem';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error loading tasks:', error.message);
      return;
    }
    setTasks(data || []);
  }

  async function addTask() {
    if (task.trim() === '') return;

    const { error } = await supabase
      .from('tasks')
      .insert([{ title: task, completed: false }]);

    if (error) {
      console.log('Error adding task:', error.message);
      return;
    }

    setTask(''); 
    loadTasks(); 
  }

  async function toggleTask(item) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      console.log('Error updating task:', error.message);
      return;
    }
    loadTasks(); 
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting task:', error.message);
      return;
    }
    loadTasks(); 
  }

  function handleAddTask() {
    addTask();
  }

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.headerTitle}>TaskFlow</Text>
      </View>

      <TaskForm task={task} setTask={setTask} onAdd={handleAddTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        style={styles.listContainer}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
});