import React from 'react';
import * as MUI from '@material-ui/core';

export default function Toolbar(props) {
    const {user, openMenu} = props;
    return (
        <MUI.AppBar position="static">
            <MUI.Toolbar>
                {
                    user && (
                        <MUI.MenuItem onClick={openMenu}>
                            {user.username}
                        </MUI.MenuItem>
                    )
                }
            </MUI.Toolbar>
        </MUI.AppBar>
    )
}
