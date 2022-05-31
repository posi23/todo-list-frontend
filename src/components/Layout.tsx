import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GrAdd } from 'react-icons/gr'

interface IProps {
      newTodoCardOpen: {
            isNewTodoCardOpen: boolean,
            setIsNewTodoCardOpen: React.Dispatch<React.SetStateAction<boolean>>
      },
      notifications: {
            todoNotification: number,
            activityNotification: number,
      },
      currentTab: string
}

function Layout({ newTodoCardOpen, notifications, currentTab }: IProps) {

      const { todoNotification, activityNotification } = notifications
      const { isNewTodoCardOpen, setIsNewTodoCardOpen } = newTodoCardOpen

      const location = useLocation()
      const navigate = useNavigate()

      const styles = {
            active: {
                  display: "block",
                  color: "#000"

            },
            inactive: {
                  display: "none",
                  color: "rgb(148, 147, 150)",

            }
      }

      useEffect(() => {
            navigate("/todo")
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return (
            <>
                  <div className='scroll-container'>

                        <div className="tabs">
                              <div className="tab">
                                    <Link
                                          to="activity"
                                          state={{ prevPath: location.pathname }}
                                          className='link'
                                          style={{ color: currentTab === "activity" ? styles.active.color : styles.inactive.color }}
                                    // onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => setCurrentTab("activity")}
                                    >
                                          Activity
                                    </Link>
                                    {
                                          activityNotification > 0 && <div className='notification-badge'>
                                                <div className='noti-count'>{activityNotification}</div>
                                          </div>
                                    }
                                    <div
                                          style={{ display: currentTab === "activity" ? styles.active.display : styles.inactive.display }}
                                          className="active-bar">
                                    </div>

                              </div>

                              <div className="tab">
                                    <Link
                                          to="/todo"
                                          state={{ prevPath: location.pathname }}
                                          className='link'
                                          style={{ color: currentTab === "todo" ? styles.active.color : styles.inactive.color }}
                                    // onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => setCurrentTab("todo")}

                                    >
                                          Todo
                                    </Link>
                                    {
                                          todoNotification > 0 && <div className='notification-badge'>
                                                <div className='noti-count'>{todoNotification}</div>
                                          </div>
                                    }
                                    <div
                                          style={{ display: currentTab === "todo" ? styles.active.display : styles.inactive.display }}
                                          className="active-bar">
                                    </div>
                              </div>

                              <div
                                    className='add-icon'
                                    onClick={(e) => setIsNewTodoCardOpen(true)}
                                    style={{ display: isNewTodoCardOpen ? "none" : "block" }}
                              >
                                    <GrAdd size={25} />
                              </div>

                        </div>
                  </div>

                  <Outlet />
            </>
      )
}

export default Layout