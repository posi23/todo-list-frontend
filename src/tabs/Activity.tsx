import React, { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ActivityType } from '../hooks/useFetchActivities'
import { readAllActivities } from '../utils/utils'

interface IProps {
      activitiesObject: {
            activities: ActivityType[],
            setActivities: React.Dispatch<React.SetStateAction<ActivityType[]>>
      },
      setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

function Activity({ activitiesObject, setCurrentTab }: IProps) {

      const location = useLocation()

      const { activities, setActivities } = activitiesObject

      const updateViewStatusForActivities = useCallback(async () => {
            setActivities(prev =>
                  prev.map(activity => {
                        if (activity.read) return activity
                        const updatedActivity = { ...activity, read: true }
                        return updatedActivity
                  })
            )
            await readAllActivities();
      }, [setActivities])


      useEffect(() => {
            let state = location.state as any
            let locationState = state.prevPath
            if (locationState === "/activity") updateViewStatusForActivities()
      }, [updateViewStatusForActivities, location])

      useEffect(() => {
            setCurrentTab("activity")
      }, [setCurrentTab])

      return (
            <div className='activity-display'>
                  <ul className="activityItem">
                        {
                              activities.length > 0 ? activities.map((activity, idx) => (
                                    <li key={idx} style={{ fontWeight: !activity.read ? "bold" : "normal" }}>{activity.activity}</li>
                              ))
                                    : <div style={{ fontSize: '1.1rem' }}>No recent activity</div>
                        }
                  </ul>
            </div>
      )
}

export default Activity