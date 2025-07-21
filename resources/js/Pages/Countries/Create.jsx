// resources/js/Pages/Users/Create.jsx
import Input from '@/Components/ui/form/Input';
import Label from '@/Components/ui/form/Label';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Select from '@/Components/ui/form/Select';
import Button from '@/Components/ui/form/Button';
import { countryListAllIsoData } from '@/lib/countries';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { usePermission } from '@/hooks/usePermission';

const Create = ({ fields }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm({
        ...initialData,
        name: countryListAllIsoData[0]?.name,
        country_code: countryListAllIsoData[0]?.code || '',
    });

    const handleSubmit = e => {
        e.preventDefault();

        post(route('countries.store'));
    };

    useEffect(() => {
        const selectedCountryObj = countryListAllIsoData.find(
            c => c.name === data.name
        );
        setData('country_code', selectedCountryObj?.code || '');
    }, [data.name]);

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-end">
                    <div>
                        {hasPermission('countries create') && (
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                disabled={processing}
                                id="saveCountries"
                            >
                                {processing ? (
                                    <>
                                        <ReactLoading
                                            color={'#fff'}
                                            type="bars"
                                            height={20}
                                            width={20}
                                        />
                                    </>
                                ) : (
                                    t('save')
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                <Container>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div id="createCountry">
                                {' '}
                                <h2 className="text-lg font-semibold mb-4 sm:mb-6">
                                    {t('CountryInformation')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                    <div className="mb-3 ">
                                        <Label
                                            text={t('Country Name')}
                                            htmlFor="name"
                                            required={true}
                                        />
                                        <Select
                                            id="name"
                                            aria-label="Country Name"
                                            className="!h-[38px]"
                                            onChange={e =>
                                                setData('name', e.target.value)
                                            }
                                            value={data.name || undefined}
                                        >
                                            {countryListAllIsoData.map(
                                                (item, index) => (
                                                    <option
                                                        value={item.name}
                                                        key={index}
                                                    >
                                                        {' '}
                                                        {item.name}
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                        {errors.name && (
                                            <div className="text-red-500 text-sm px-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Label
                                            text={t('Country Code')}
                                            htmlFor="country_code"
                                            required={true}
                                        />
                                        <Input
                                            id="country_code"
                                            value={
                                                data.country_code || undefined
                                            }
                                            type="text"
                                            onChange={e =>
                                                setData(
                                                    'country_code',
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                        />
                                        {errors.country_code && (
                                            <div className="text-red-500 text-sm px-1">
                                                {errors.country_code}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                    <div className="mb-3">
                                        <Label
                                            text={t('Turkish Name')}
                                            htmlFor="name_tr"
                                            required={true}
                                        />
                                        <Input
                                            id="name_tr"
                                            value={data.name_tr || undefined}
                                            type="text"
                                            onChange={e =>
                                                setData(
                                                    'name_tr',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.name_tr && (
                                            <div className="text-red-500 text-sm px-1">
                                                {errors.name_tr}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Label
                                            text={t('Primary Name')}
                                            htmlFor="name_primary"
                                            required={true}
                                        />
                                        <Input
                                            id="name_primary"
                                            value={
                                                data.name_primary || undefined
                                            }
                                            type="text"
                                            onChange={e =>
                                                setData(
                                                    'name_primary',
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.name_primary && (
                                            <div className="text-red-500 text-sm px-1">
                                                {errors.name_primary}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Container>
            </AuthenticatedLayout>
        </>
    );
};

export default Create;
