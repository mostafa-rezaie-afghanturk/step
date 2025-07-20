import React from 'react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

export const onSuccess = (
    message = 'Action completed successfully!',
    title = ''
) => {
    Toast.fire({
        title: title,
        text: message,
        icon: 'success',
    });
};

export const onError = (message = 'Action failed!', title = '') => {
    Toast.fire({
        title: title,
        text: message,
        icon: 'error',
    });
};

export const onConfirm = (title = 'Are you sure to perform this action?') => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f87171',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then(result => {
            if (result.isConfirmed) {
                resolve();
            } else {
                reject();
            }
        });
    });
};
