import {Snackbar, Alert} from '@mui/material';

export default function GlobalSnackbar({snackbar, setSnackbar, vertical, horizontal}) {
    return (
        <>
            <Snackbar 
            open={snackbar.open} 
            autoHideDuration={4000}
            anchorOrigin={{vertical : vertical , horizontal: horizontal}}
            >
                <Alert severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>

    )
}