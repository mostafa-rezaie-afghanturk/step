import { useEffect, useState } from 'react';

const TagInput = ({
    id,
    defaultValue = [],
    placeholder = '',
    value,
    onChange = e => {},
    ...props
}) => {
    const [tags, setTags] = useState(
        Array.isArray(JSON.parse(defaultValue)) ? JSON.parse(defaultValue) : []
    );
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = e => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    useEffect(() => {
        onChange(JSON.stringify(tags));
    }, [tags]);

    const removeTag = tagToRemove => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div
            className="flex flex-wrap items-center 
       border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500  w-full"
        >
            {tags.map((tag, index) => (
                <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-900 py-1.5 ml-1 px-1.5 rounded break-words  overflow-auto"
                    style={{ maxWidth: '150px' }} // Set a max width to control the size of each tag
                >
                    <span className="truncate"> {tag}</span>

                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-black hover:text-red-500 focus:outline-none"
                    >
                        &times; {/* You can use an icon here instead */}
                    </button>
                </div>
            ))}
            <input
                id={id}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`border-none outline-none flex-1 min-w-[120px] px-1 py-1.5 bg-black/5 rounded-md ${tags.length > 0 ? 'ml-1.5' : ''}`}
                placeholder={placeholder}
            />
        </div>
    );
};

export default TagInput;
