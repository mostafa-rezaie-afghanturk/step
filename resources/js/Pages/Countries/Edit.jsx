import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import Label from '@/Components/ui/form/Label';
import Input from '@/Components/ui/form/Input';
import Button from '@/Components/ui/form/Button';
import ReactLoading from 'react-loading';
import { useForm } from '@inertiajs/react';
import { countryListAllIsoData } from '@/lib/countries';
import Select from '@/Components/ui/form/Select';
import { useEffect } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Edit = ({ country }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const { data, setData, put, processing, errors } = useForm({
        name: country.name || '',
        country_code: country.country_code || '',
        name_tr: country.name_tr || '',
        name_primary: country.name_primary || '',
    });

    const handleSubmit = e => {
        e.preventDefault();

        put(route('countries.update', country.country_id), data);
    };

    useEffect(() => {
        const selectedCountryObj = countryListAllIsoData.find(
            c => c.name === data.name
        );
        setData('country_code', selectedCountryObj?.code || '');
    }, [data.name]);

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t('edit_country')}</h1>
                </div>
                <div>
                    {hasPermission('countries write') && (
                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={processing}
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
                                t('Update')
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Container>
                <div>
                    <form onSubmit={handleSubmit}>
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
                                    value={data.name}
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
                                    value={data.country_code}
                                    type="text"
                                    onChange={e =>
                                        setData('country_code', e.target.value)
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
                                    text={t('TurkeyCountryName')}
                                    htmlFor="name_tr"
                                    required={true}
                                />
                                <Input
                                    id="name_tr"
                                    value={data.name_tr}
                                    type="text"
                                    onChange={e =>
                                        setData('name_tr', e.target.value)
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
                                    value={data.name_primary}
                                    type="text"
                                    onChange={e =>
                                        setData('name_primary', e.target.value)
                                    }
                                />
                                {errors.name_primary && (
                                    <div className="text-red-500 text-sm px-1">
                                        {errors.name_primary}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Edit;
