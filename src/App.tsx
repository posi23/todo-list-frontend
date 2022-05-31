import React, { useState, useEffect } from 'react';
import './App.css';
import { ActivityArray, getAmountOfUncompletedTodos, getAmountOfUnreadActivities, TodoState } from './utils/utils';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Todo from './tabs/Todo';
import Layout from './components/Layout';
import AddNewTodo from './components/AddNewTodo';
import Activity from './tabs/Activity';

function App() {

  const [todos, setTodos] = useState<TodoState["type"]>([
    {
      id: 1,
      taskName: "Complete main UI components",
      description: "Would be good if we include every component",
      dueDate: new Date("16 May 2022"),
      assignee: "Esther Howard",
      completed: true
    },

    {
      id: 2,
      taskName: "Landing Page Design",
      dueDate: new Date("20 May 2022"),
      assignee: "Brooklyn Simmons",
      completed: false
    }
  ])

  const [activities, setActivities] = useState<ActivityArray["activities"]>([
    {
      activityString: 'Esther Howard has set task "Complete main UI components" to complete',
      read: false
    }
  ])

  const [isNewTodoCardOpen, setIsNewTodoCardOpen] = useState<boolean>(false)
  const [activityNotification, setActivityNotification] = useState<number>(1)
  const [todoNotification, setTodoNotification] = useState<number>(0)
  const [currentTab, setCurrentTab] = useState<string>("todo")


  useEffect(() => {
    let newTodoNotification = getAmountOfUncompletedTodos(todos)
    setTodoNotification(newTodoNotification)
  }, [todos])

  useEffect(() => {
    let newActivityNotification = getAmountOfUnreadActivities(activities)
    setActivityNotification(newActivityNotification)
  }, [activities])

  return (
    <Router>
      <div className='main'>
        <div className='main-card'>
          <Routes>
            <Route path="/" element={<Layout
              newTodoCardOpen={{ isNewTodoCardOpen, setIsNewTodoCardOpen }}
              notifications={{ todoNotification, activityNotification }}
              currentTab={currentTab} />}>
              <Route path="/activity" element={<Activity activitiesObject={{ activities, setActivities }} setCurrentTab={setCurrentTab} />} />
              <Route path="/todo" element={<Todo
                todosObject={{ todos, setTodos }}
                setActivities={setActivities}
                setCurrentTab={setCurrentTab} />} />
            </Route>
          </Routes>
        </div>

        <AddNewTodo
          todosObject={{ todos, setTodos }}
          newTodoCardOpen={{ isNewTodoCardOpen, setIsNewTodoCardOpen }}
          setActivities={setActivities} />
      </div>

    </Router >
  );
}

export default App;
