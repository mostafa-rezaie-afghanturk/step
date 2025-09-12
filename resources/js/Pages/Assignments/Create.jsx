import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Create = ({ fields, transfer }) => {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();

  const initialData = fields.reduce((acc, field) => {
    acc[field.name] = field.default;
    return acc;
  }, {});

  const { data, setData, post, processing, errors } = useForm(initialData);

  const handleSubmit = e => {
    e.preventDefault();
    post(route('asset-assignments.store'));
  };

  return (
    <>
      <AuthenticatedLayout>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className="text-2xl font-bold">
              {t('create_assignment')}
            </h1>
          </div>
          <div id="asset-assignments">
            {hasPermission('asset-transfer create') && (
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={processing}
              >
                {processing ? (
                  <>
                    {' '}
                    <ReactLoading
                      color={'#fff'}
                      type="bars"
                      height={20}
                      width={20}
                    />{' '}

                  </>
                ) : (
                  t('save')
                )}
              </Button>
            )}
          </div>
        </div>

        <Container>
          <div id="createasset-assignments">
            <form onSubmit={handleSubmit}>
              <FormFieldsMapper
                fields={fields}
                data={data}
                setData={setData}
                errors={errors}
              />
            </form>
          </div>
        </Container>
      </AuthenticatedLayout>
    </>
  );
};

export default Create;


