import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Import the Supabase client configured in Phase 2
import { supabase } from './lib/supabase';

export default function App() {
  // State variables remains local for input and UI synchronization
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // 5.2 Read — Load Tasks on Startup via useEffect
  useEffect(() => {
    loadTasks();
  }, []);

  // 5.2 Read — Fetch rows from Supabase 'tasks' table
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error loading tasks:', error.message);
      return;
    }
    setTasks(data);
  }

  // 5.3 Create — Insert new task to Supabase and reload
  async function addTask() {
    if (task.trim() === '') return;

    const { error } = await supabase
      .from('tasks')
      .insert([{ title: task, completed: false }]);

    if (error) {
      console.log('Error adding task:', error.message);
      return;
    }

    setTask(''); // Clear input text box
    loadTasks(); // Fetch fresh data from backend
  }

  // 5.4 Update — Toggle completion status by targeting specific row ID
  async function toggleTask(item) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      console.log('Error updating task:', error.message);
      return;
    }
    loadTasks(); // Fetch fresh data from backend
  }

  // 5.5 Delete — Remove task via unique ID on long press
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting task:', error.message);
      return;
    }
    loadTasks(); // Fetch fresh data from backend
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>TaskFlow</Text>

      {/* Input Section */}
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

      {/* 5.6 Upgraded Task List Section: FlatList replaces ScrollView & .map() */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item)}
            onLongPress={() => deleteTask(item.id)}
          >
            <View style={styles.taskRow}>
              <MaterialIcons
                name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color={item.completed ? '#2E5BBA' : '#5A6472'}
              />
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
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
});