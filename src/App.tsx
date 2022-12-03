import React, { useState, useEffect } from 'react';
import './App.css';
import { getAmountOfUncompletedTodos, getAmountOfUnreadActivities } from './utils/utils';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Todo from './tabs/Todo';
import Layout from './components/Layout';
import AddNewTodo from './components/AddNewTodo';
import Activity from './tabs/Activity';
import useFetchTasks from './hooks/useFetchTasks';
import useFetchActivities from './hooks/useFetchActivities';

function App() {

  const [todos, setTodos, addTodo] = useFetchTasks();

  const [activities, setActivities] = useFetchActivities();

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
          todosObject={{ todos, addTodo }}
          newTodoCardOpen={{ isNewTodoCardOpen, setIsNewTodoCardOpen }}
          setActivities={setActivities} />
      </div>

    </Router >
  );
}

export default App;
