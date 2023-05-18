import {Snackbar, Alert} from '@mui/material';

export default function GlobalSnackbar({snackbar, setSnackbar}) {
    return (
        <>
            <Snackbar open={snackbar.open} autoHideDuration={6000}>
                <Alert severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>

    )
}