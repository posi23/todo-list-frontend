import React, { useEffect, useRef, useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { FiCalendar } from 'react-icons/fi'
import { ActivityArray, determineTheNextId, getErrorMessage, sendNewActivity, TodoState } from '../utils/utils'
import ErrorModal from './ErrorModal'
import Modal from './Modal'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface IProps {
      todosObject: {
            todos: TodoState["type"],
            setTodos: React.Dispatch<React.SetStateAction<TodoState["type"]>>
      }
      newTodoCardOpen: {
            isNewTodoCardOpen: boolean,
            setIsNewTodoCardOpen: React.Dispatch<React.SetStateAction<boolean>>
      },
      setActivities: React.Dispatch<React.SetStateAction<ActivityArray["activities"]>>
}

function AddNewTodo({ todosObject, newTodoCardOpen, setActivities }: IProps) {

      const { todos, setTodos } = todosObject
      const { isNewTodoCardOpen, setIsNewTodoCardOpen } = newTodoCardOpen

      const [taskName, setTaskName] = useState<string>("")
      const [description, setDescription] = useState<string>("")
      const [dueDate, setDueDate] = useState<Date>(new Date())
      const [assignee, setAssignee] = useState<string>("")
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
      const [error, setError] = useState<string>("")

      const newTodoCardRef = useRef<HTMLDivElement | null>(null)

      const CustomInput = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
            return (
                  <button className="date-btn">
                        <span><FiCalendar size={20} /></span>
                        <input {...props} className='date-input' />
                  </button>


            );
      };

      const addNewTodoToTheList = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault()

            try {
                  validateFields()
                  const newTodo = {
                        id: determineTheNextId(todos),
                        taskName,
                        description,
                        dueDate,
                        assignee,
                        completed: false
                  }

                  if (newTodo) {
                        setTodos(prev => [...prev, newTodo])
                        let activity = sendNewActivity(2, null, newTodo.taskName)
                        setActivities(prev => [...prev, { activityString: activity, read: false }])
                  }
                  clearStateToInitialState()
            }
            catch (err) {
                  setError(getErrorMessage(err))
            }
      }

      const clearStateToInitialState = () => {
            setTaskName("")
            setDescription("")
            setDueDate(new Date())
            setAssignee("")
      }

      const validateFields = () => {
            if (taskName === "" || assignee === "") throw new Error("'Task name' or 'Assign To' field needs to filled")
      }

      useEffect(() => {
            if (newTodoCardRef.current) {
                  newTodoCardRef.current.style.display = isNewTodoCardOpen ? 'flex' : 'none'
            }
      }, [isNewTodoCardOpen])

      return (
            <div className='add-task-card' ref={newTodoCardRef}>

                  <input
                        type="text"
                        className='task-name-input'
                        placeholder='Task name here...'
                        value={taskName}
                        onChange={e => setTaskName(e.target.value)} />

                  <input
                        type="text"
                        className='description-input'
                        placeholder='Description'
                        value={description}
                        onChange={e => setDescription(e.target.value)} />

                  <div className='button-container'>
                        <div className='completion-time-buttons'>
                              <div>
                                    <DatePicker selected={dueDate} onChange={date => date && setDueDate(date)} customInput={React.createElement(React.forwardRef(CustomInput))} />
                              </div>

                              <button className='assignee-btn' onClick={() => setIsModalOpen(true)}>
                                    <span><BsPerson size={20} /></span>
                                    {assignee !== "" ? assignee : "Assign To"}
                              </button>
                        </div>

                        <div className="card-action-buttons">
                              <button className="cancel-btn" onClick={e => setIsNewTodoCardOpen(false)}>
                                    Cancel
                              </button>
                              <button className="add-btn" onClick={e => addNewTodoToTheList(e)}>
                                    Add Task
                              </button>
                        </div>

                  </div>

                  <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setAssignee={setAssignee} />

                  <ErrorModal errorMessage={error} setError={setError} />

            </div>
      )
}

export default AddNewTodo