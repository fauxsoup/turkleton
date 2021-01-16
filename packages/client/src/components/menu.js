import React from 'react';
import {useHistory} from 'react-router-dom';
import * as MUI from '@material-ui/core';

export default function Menu(props) {
    const { user, isOpen, close } = props;
    const history = useHistory();

    if (!user) return null;

    return (
        <MUI.Drawer open={isOpen} onClose={close}>
            <MUI.ListItem
                button
                onClick={navigate('/dashboard')}
            >
                My Dashboard
            </MUI.ListItem>
            <MUI.ListItem
                button
                onClick={navigate(`/coaches/${user.id}`)}
            >
                My Channel
            </MUI.ListItem>
            <MUI.ListItem
                button
                onClick={navigate('/submissions')}
            >
                My Submissions
            </MUI.ListItem>
        </MUI.Drawer>
    );

    function navigate(path) {
        return () => history.push(path);
    }
}
