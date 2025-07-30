import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import LinkComboBoxSelect from './LinkComboBoxSelect';
import PasswordInput from './PasswordInput';
import TagInput from './TagInput';
import Label from './Label';
import Checkbox from './Checkbox';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TranslateLinkComboBoxSelect from './TranslateLinkComboBoxSelect';
import DynamicCombobox from './DynamicCombobox ';
import AppDropZone from './AppDropZone';
import JsonCounterList from './JsonCounterList';

const FormFieldsMapper = ({ fields, data, setData, errors, children }) => {
    const { t } = useTranslation();

    const renderErrorMessage = (error, fieldName) => {
        if (error.includes('required')) {
            return t('errors.required', { field: t(fieldName) });
        }
        if (error.includes('must not be greater than')) {
            const maxMatch = error.match(/(\d+)/); // Extract the max value
            const unit = error.includes('characters')
                ? 'characters'
                : 'kilobytes';
            return t('errors.max', {
                field: t(fieldName),
                max: maxMatch ? maxMatch[0] : '',
                unit: t(unit),
            });
        }
        if (error.includes('must be at least')) {
            const minMatch = error.match(/(\d+)/); // Extract the min value
            return t('errors.min', {
                field: t(fieldName),
                min: minMatch ? minMatch[0] : '',
            });
        }
        if (error.includes('must be unique')) {
            return t('errors.unique', { field: t(fieldName) });
        }
        if (error.includes('must be a number')) {
            return t('errors.numeric', { field: t(fieldName) });
        }
        if (error.includes('must be a valid email address')) {
            return t('errors.email', { field: t(fieldName) });
        }

        return error;
    };

    const renderField = col => {
        switch (col.type) {
            case 'number':
            case 'string':
            case 'date':
                return (
                    <Input
                        id={col.name}
                        value={data[col.name]}
                        placeholder={col.placeholder || ''}
                        type={col.type === 'string' ? 'text' : col.type}
                        onChange={e => setData(col.name, e.target.value)}
                    />
                );

            case 'password':
                return (
                    <PasswordInput
                        id={col.name}
                        value={data[col.name]}
                        onChange={e => setData(col.name, e.target.value)}
                    />
                );

            case 'file':
                return (
                    <AppDropZone
                        multiple={true}
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg'],
                            'application/pdf': ['.pdf'],
                        }}
                        initialFiles={col?.default || []}
                        onChange={e => setData(col.name, e)}
                    />
                );

            case 'tag':
                return (
                    <TagInput
                        id={col.name}
                        defaultValue={col?.default}
                        onChange={e => setData(col.name, e)}
                    />
                );

            case 'select':
                return (
                    <Select
                        name={col.name}
                        id={col.name}
                        onChange={e => setData(col.name, e.target.value)}
                        value={data[col.name]}
                    >
                        {col?.option?.map((val, index) => (
                            <option key={index} value={val}>
                                {val}
                            </option>
                        ))}
                    </Select>
                );

            case 'text':
                return (
                    <Textarea
                        id={col.name}
                        value={data[col.name]}
                        onChange={e => setData(col.name, e.target.value)}
                        rows={5}
                    />
                );

            case 'link':
                return (
                    <LinkComboBoxSelect
                        id={col.name}
                        defaultValue={col.default}
                        dependsOn={
                            col?.depends_on
                                ? {
                                      [col.depends_on]: data[col.depends_on],
                                  }
                                : null
                        }
                        onChange={option => {
                            setData(
                                col.name,
                                col.multiple
                                    ? option.map(opt => opt.value)
                                    : option?.value
                            );
                        }}
                        onClear={() => {
                            if (col.name === 'parent_id') {
                                setData('category_id', null);
                                setData('child_category_id', null);
                            } else if (col.name === 'category_id') {
                                setData('child_category_id', null);
                            }
                        }}
                        url={col.search_url}
                        multiple={col?.multiple || false}
                        placeholder={col?.placeholder || ''}
                    />
                );

            case 'linkTrans':
                return (
                    <TranslateLinkComboBoxSelect
                        id={col.name}
                        defaultValue={
                            fields.find(a => a.name === col.name)?.default
                        }
                        dependsOn={
                            col?.depends_on
                                ? {
                                      [col.depends_on]: data[col.depends_on],
                                  }
                                : null
                        }
                        onChange={option => setData(col.name, option?.value)}
                        url={col.search_url}
                        translate={col.translate}
                    />
                );

            case 'dynamicLink':
                return (
                    <DynamicCombobox
                        id={col.name}
                        defaultValue={
                            fields.find(a => a.name === col.name)?.default
                        }
                        dependsOn={
                            col?.depends_on
                                ? { [col.depends_on]: data[col.depends_on] }
                                : null
                        }
                        onChange={option => setData(col.name, option?.id)}
                        url={col.search_url}
                        permissionModule={col?.permissionModule} // Pass the module name here
                    />
                );

            case 'boolean':
                return (
                    <Checkbox
                        id={col.name}
                        checked={data[col.name]}
                        onChange={e => setData(col.name, e.target.checked)}
                    />
                );

            case 'richtext':
                return (
                    <ReactQuill
                        id={col.name}
                        theme="snow"
                        value={data[col.name]}
                        onChange={e => setData(col.name, e)}
                    />
                );
            case 'json_counter_list':
                return (
                    <JsonCounterList
                        col={col}
                        data={data}
                        setData={setData}
                        defaultValue={col.default}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="col-span-2"></div>
            {fields.map((col, index) => {
                // Handle required_if in the format 'field,value'

                if (col.required_if) {
                    if (
                        typeof col.required_if === 'string' &&
                        col.required_if.includes(',')
                    ) {
                        const [field, value] = col.required_if.split(',');
                        let compareValue = value;
                        // Convert string to boolean if needed
                        if (typeof data[field] === 'boolean') {
                            compareValue = value === 'true';
                        } else if (!isNaN(data[field])) {
                            compareValue = Number(value);
                        }
                        if (data[field] !== compareValue) {
                            return null;
                        }
                    } else if (!data[col.required_if]) {
                        return null;
                    }
                }
                return (
                    <div
                        key={col.name || index}
                        className={`mb-3 ${col?.width ? 'col-span-' + col?.width : ''}`}
                    >
                        <Label
                            text={t(col.label)}
                            htmlFor={col.name}
                            required={col?.required}
                        />

                        {renderField(col)}

                        {errors[col.name] && (
                            <div className="text-red-500 text-sm px-1">
                                {renderErrorMessage(
                                    errors[col.name],
                                    col.label
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
            {children}
        </div>
    );
};

FormFieldsMapper.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf([
                'number',
                'string',
                'date',
                'select',
                'text',
                'richtext',
                'link',
                'password',
                'file',
                'tag',
                'boolean',
                'linkTrans',
            ]).isRequired,
            label: PropTypes.string.isRequired,
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            required: PropTypes.bool,
            placeholder: PropTypes.string,
            option: PropTypes.array,
            depends_on: PropTypes.string,
            search_url: PropTypes.string,
            default_label: PropTypes.string,
            default: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            required_if: PropTypes.string,
        })
    ).isRequired,
    data: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
    errors: PropTypes.object,
};

export default FormFieldsMapper;
