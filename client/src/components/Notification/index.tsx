import React, { createContext, FC, useState } from 'react';
import './styles.css';

export enum NotificationTypes {
    error = 'danger',
    success = 'success',
    info = 'info'
}

interface INotification {
    type: NotificationTypes;
    message: string;
}

interface NotificationsProps {
    notifications: INotification[];
}

type SetNotificationFn = (notification: INotification) => void;

export type NotificationContextType = {
    notifications: INotification[];
    setNotifications: SetNotificationFn;
    addNotification: SetNotificationFn;
    setTtl: (ttl: number) => void;
}

export const NotificationContext = createContext<NotificationContextType>({} as any);

export const NotificationProvider: FC = ({ children }) => {
    let [notifications, setNotifications] = useState<INotification[] | unknown[]>([]);
    let [ttl, setTtl] = useState<number | undefined>(1000);

    const addNotification = (notification: INotification) => {
        if (notification) {
            setNotifications([
                ...notifications,
                notification
            ]);
            if (ttl) {
                setTimeout(() => {
                    notifications.pop();
                    setNotifications(notifications)
                }, ttl);
            }
        }
    }

    // fix typing 'as any'
    const defaultValue: NotificationContextType = {notifications, setNotifications, addNotification, setTtl} as any;
    
    return (
        <NotificationContext.Provider  value={defaultValue}>
            {children}
        </NotificationContext.Provider>
    )
}

const Notifications : FC<NotificationsProps> = ({ notifications }) => {

    const content = notifications.map((notification, i) => {

        return (
            <div key={`notification${i}`} className={`alert alert-${notification.type || 'info'}`}>
                {notification.message}
            </div>
        );
    });

    return (
        <div className='notifications'>
            {content}
        </div>
    )
}

export default Notifications;
