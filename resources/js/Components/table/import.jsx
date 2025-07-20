import React from 'react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from '@/Components/ui/modal';
import { useDatatable } from './datatableContext';
import { TbFileImport } from 'react-icons/tb';
import FormButton from '../ui/form/Button';
import { Button } from '@headlessui/react';
import { MdOutlineFileDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import Input from '../ui/form/Input';
import Label from '../ui/form/Label';
import { useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const Import = () => {
    const { importUrl, importFormatUrl } = useDatatable();
    const { t } = useTranslation();

    const { setData, post, processing, reset } = useForm({
        file: null,
    });

    const importData = e => {
        e.preventDefault();

        post(importUrl, {
            forceFormData: true,
            onSuccess: () => {
                reset(); // reset the form if needed
            },
            onFinish: response => {
                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);
            },
        });
    };

    return (
        <div>
            <Modal>
                <ModalTrigger as={'div'}>
                    <Button className="flex items-center hover:bg-brand/20 focus:bg-brand/20 font-semibold px-4 py-1 rounded-md gap-x-2 outline-brand/50">
                        <TbFileImport className="w-4 h-4" />
                        <span>{t('import')}</span>
                    </Button>
                </ModalTrigger>

                <ModalBody className="lg:!max-w-[30%] " title={t('import')}>
                    <ModalContent className="!pb-2">
                        <div>
                            <div className="">
                                <Label text={t('excell_file')}></Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xls,.xlsx"
                                    onChange={e =>
                                        setData('file', e.target.files[0])
                                    }
                                />
                            </div>
                        </div>
                    </ModalContent>

                    <ModalFooter className="flex justify-between items-center">
                        <a
                            href={importFormatUrl}
                            className="text-brand underline"
                        >
                            {t('download_format')}
                        </a>
                        <FormButton onClick={importData} disabled={processing}>
                            {t('submit')}
                            <MdOutlineFileDownload
                                size={25}
                                className="ms-2"
                            />{' '}
                        </FormButton>
                    </ModalFooter>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Import;
