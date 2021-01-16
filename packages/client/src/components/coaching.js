import * as MUI from '@material-ui/core';
import React, { useMemo } from 'react';
import {useParams} from 'react-router-dom';
import { useAPI } from '../hooks';

export default function Coaching(props) {
    const { user } = props;
    const {id} = useParams();

    const [coachError, coachDetails] = useAPI(`/api/coach/${id}`, [id]);
    const [formsError, forms] = useAPI(`/api/forms`, [user]);
    const sortedForms = useMemo(sortForms, [user]);

    if (!coachDetails)
        return (
            <MUI.CircularProgress />
        );

    return (
        <>
            <MUI.ListItem>
                <MUI.Typography variant="h1">
                  {coachingDetails.settings.displayName || coachingDetails.username}
                </MUI.Typography>
            </MUI.ListItem>
            {
                sortedForms.map((form) => (
                    <MUI.ListItem>
                        <MUI.ListItemText
                            primary={form.id}
                            secondary={moment.utc(form.uploadDate).toLocaleString()} />
                    </MUI.ListItem>
                ))
            }
        </>
    );


    function sortForms() {
        if (!forms) return [];
        return [...forms].sort((formA, formB) => {
            if (formA.uploadDate > formB.uploadDate) return 1;
            else if (formB.uploadDate > formA.uploadDate) return -1;
            else return 0;
        });
    }
}
