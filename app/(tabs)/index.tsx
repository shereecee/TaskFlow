import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Verified relative import path climbing up out of app/(tabs)/
import { supabase } from '../../lib/supabase';

export default function TaskFlowScreen() {
  // Local UI State
  const [task, setTask] = useState('');     // Holds current text input
  const [tasks, setTasks] = useState([]);   // Holds array of tasks retrieved from Supabase

  // ==========================================
  // SUPABASE CRUD OPERATIONS
  // ==========================================

  // 5.2 READ — Load Tasks on Startup
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false }); // Newest tasks at the top

    if (error) {
      console.log('Error loading tasks:', error.message);
      return; // Bail out early if there is an error
    }
    
    setTasks(data || []); // Update local state with real data from cloud
  }

  // Hook to trigger initial fetch once on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // 5.3 CREATE — Add Task to Supabase
  async function addTask() {
    if (task.trim() === '') return;

    const { error } = await supabase
      .from('tasks')
      .insert([{ title: task.trim(), completed: false }]); // Supabase expects an array of objects

    if (error) {
      console.log('Error adding task:', error.message);
      return;
    }

    setTask('');   // Clear text field upon success
    loadTasks();   // Refresh data to show newly added item
  }

  // 5.4 UPDATE — Toggle Completion
  async function toggleTask(item) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id); // Target only this specific task row

    if (error) {
      console.log('Error updating task:', error.message);
      return;
    }

    loadTasks();   // Refresh data to reflect updated UI check status
  }

  // 5.5 DELETE — Remove a Task
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id); // Only delete the targeted row

    if (error) {
      console.log('Error deleting task:', error.message);
      return;
    }

    loadTasks();   // Refresh data to clear deleted row from screen
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>TaskFlow</Text>

      {/* Input Form Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          placeholderTextColor="#A0AAB8"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 5.6 Optimized Task List Section via FlatList */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()} // Handles key allocation implicitly
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item)}        // Single tap toggles checkbox status
            onLongPress={() => deleteTask(item.id)} // Long press triggers deletion
            activeOpacity={0.7}
          >
            <View style={styles.taskRow}>
              <MaterialIcons
                name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color={item.completed ? '#2E5BBA' : '#5A6472'}
              />
              <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

// Layout styling parameters
const styles = StyleSheet.create({
  container: {
    flex: 1, // Enforces the root view to scale properly for FlatList scrolling compatibility
    backgroundColor: '#F5F7FA',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
    color: '#1E293B',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through', // Visual feedback for checked tasks
    color: '#94A3B8',
  },
});