import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming Expo environment based on vector icons usage

export default function App() {
  // 4.2 Add Input State
  const [task, setTask] = useState('');

  // 4.3 Add Tasks State
  const [tasks, setTasks] = useState([]);

  // 4.5 A First Look at useEffect
  useEffect(() => {
    console.log('Component mounted!');
    // This is where Supabase data fetching will live in Phase 5
  }, []);

  // 4.4 A Temporary, Local Add Button Handler
  function handleAddTask() {
    // Prevent adding empty tasks or strings containing only spaces
    if (task.trim() === '') return;

    // IMMUTABLE UPDATE: Create a new array with the spread operator and append the new task object
    setTasks([
      ...tasks, 
      { 
        id: Date.now().toString(), // Temporary unique ID using timestamp
        title: task, 
        completed: false 
      }
    ]);

    // Clear the input box after adding
    setTask('');
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
          value={task}              // Controlled Component: binds UI to state
          onChangeText={setTask}    // Updates state on every keystroke
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Task List Section */}
      <ScrollView style={styles.listContainer}>
        {tasks.map((item) => (
          <View key={item.id} style={styles.taskRow}>
            <MaterialIcons
              name={item.completed ? 'check-box' : 'check-box-outline-blank'}
              size={20}
              color={item.completed ? '#2E5BBA' : '#5A6472'}
            />
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
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