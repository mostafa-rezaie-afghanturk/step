import React, { useState } from 'react';
import Button from '@/Components/ui/form/Button';
import Input from '@/Components/ui/form/Input';
import { useForm } from '@inertiajs/react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
} from '@/Components/ui/modal';
import { useTranslation } from 'react-i18next';

const ChangePasswordModal = ({ onClose, userId }) => {
    const { data, setData, post, processing, errors } = useForm({
        new_password: '',
        new_password_confirmation: '',
    });
    const { t } = useTranslation();

    const handleSubmit = e => {
        e.preventDefault();
        post(route('users.changePassword', userId), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal>
            <ModalBody
                title={t('change_password')}
                status={true}
                onClose={onClose}
            >
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Input
                                type="password"
                                name="new_password"
                                value={data.new_password}
                                onChange={e =>
                                    setData('new_password', e.target.value)
                                }
                                placeholder={t('new_password')}
                            />
                            {errors.new_password && (
                                <div className="text-red-500 text-sm">
                                    {errors.new_password}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <Input
                                type="password"
                                name="new_password_confirmation"
                                value={data.new_password_confirmation}
                                onChange={e =>
                                    setData(
                                        'new_password_confirmation',
                                        e.target.value
                                    )
                                }
                                placeholder={t('confirm_password')}
                            />
                            {errors.new_password_confirmation && (
                                <div className="text-red-500 text-sm">
                                    {errors.new_password_confirmation}
                                </div>
                            )}
                        </div>
                        <ModalFooter>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? t('processing')
                                    : t('change_password')}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default ChangePasswordModal;
